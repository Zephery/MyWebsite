# ZGC

*本文转载自[12 张图带你彻底理解 ZGC](https://zhuanlan.zhihu.com/p/474527679)*

ZGC（Z Garbage Collector） 是一款性能比 G1 更加优秀的垃圾收集器。ZGC 第一次出现是在 JDK 11 中以实验性的特性引入，这也是 JDK 11 中最大的亮点。在 JDK 15 中 ZGC 不再是实验功能，可以正式投入生产使用了，使用 –XX:+UseZGC 可以启用 ZGC。

ZGC 有 3 个重要特性：

- 暂停时间不会超过 10 ms。

> JDK 16 发布后，GC 暂停时间已经缩小到 1 ms 以内，并且时间复杂度是 o(1)，这也就是说 GC 停顿时间是一个固定值了，并不会受堆内存大小影响。
> 下面图片来自:[https://malloc.se/blog/zgc-jdk16](https://link.zhihu.com/?target=https%3A//malloc.se/blog/zgc-jdk16)

![img](https://github-images.wenzhihuai.com/images/v2-62257a68cd5fa063d16cb4c30bd75ac0_1440w.webp)

- 最大支持 16TB 的大堆，最小支持 8MB 的小堆。
- 跟 G1 相比，对应用程序吞吐量的影响小于 15 %。

## **1 内存多重映射**

内存多重映射，就是使用 mmap 把不同的虚拟内存地址映射到同一个物理内存地址上。如下图：



![img](https://github-images.wenzhihuai.com/images/v2-febbe42423b1c45c891919800e7a9dce_1440w.webp)



ZGC 为了更灵活高效地管理内存，使用了内存多重映射，把同一块儿物理内存映射为 Marked0、Marked1 和 Remapped 三个虚拟内存。

当应用程序创建对象时，会在堆上申请一个虚拟地址，这时 ZGC 会为这个对象在 Marked0、Marked1 和 Remapped 这三个视图空间分别申请一个虚拟地址，这三个虚拟地址映射到同一个物理地址。

Marked0、Marked1 和 Remapped 这三个虚拟内存作为 ZGC 的三个视图空间，在同一个时间点内只能有一个有效。ZGC 就是通过这三个视图空间的切换，来完成并发的垃圾回收。

## **2 染色指针**

### **2.1 三色标记回顾**

我们知道 G1 垃圾收集器使用了三色标记，这里先做一个回顾。下面是一个三色标记过程中的对象引用示例图：

![img](https://github-images.wenzhihuai.com/images/v2-fe3f4a72fa6d62f53ed30a54ce6f318e_1440w.webp)

总共有三种颜色，说明如下：

- 白色：本对象还没有被标记线程访问过。
- 灰色：本对象已经被访问过，但是本对象引用的其他对象还没有被全部访问。
- 黑色：本对象已经被访问过，并且本对象引用的其他对象也都被访问过了。

三色标记的过程如下：

1. 初始阶段，所有对象都是白色。
2. 将 GC Roots 直接引用的对象标记为灰色。
3. 处理灰色对象，把当前灰色对象引用的所有对象都变成灰色，之后将当前灰色对象变成黑色。
4. 重复步骤 3，直到不存在灰色对象为止。

三色标记结束后，白色对象就是没有被引用的对象（比如上图中的 H 和 G），可以被回收了。

### **2.2 染色指针**

ZGC 出现之前， GC 信息保存在对象头的 Mark Word 中。比如 64 位的 JVM，对象头的 Mark Word 中保存的信息如下图：

![img](https://github-images.wenzhihuai.com/images/v2-5b89e4cbd40143e1b66c4928ab737692_1440w.webp)

前 62位保存了 GC 信息，最后两位保存了锁标志。

ZGC 的一大创举是将 GC 信息保存在了染色指针上。**染色指针是一种将少量信息直接存储在指针上的技术**。在 64 位 JVM 中，对象指针是 64 位，如下图：

![img](https://github-images.wenzhihuai.com/images/v2-358e6823e714f2c0661414d429cf6bed_1440w.webp)

在这个 64 位的指针上，高 16 位都是 0，暂时不用来寻址。剩下的 48 位支持的内存可以达到 256 TB（2 ^48）,这可以满足多数大型服务器的需要了。不过 ZGC 并没有把 48 位都用来保存对象信息，而是用高 4 位保存了四个标志位，这样 ZGC 可以管理的最大内存可以达到 16 TB（2 ^ 44）。

通过这四个标志位，JVM 可以从指针上直接看到对象的三色标记状态（Marked0、Marked1）、是否进入了重分配集（Remapped）、是否需要通过 finalize 方法来访问到（Finalizable）。

无需进行对象访问就可以获得 GC 信息，这大大提高了 GC 效率。

## **3 内存布局**

首先我们回顾一下 G1 垃圾收集器的内存布局。G1把整个堆分成了大小相同的 region，每个堆大约可以有 2048 个region，每个 region 大小为 1~32 MB （必须是 2 的次方）。如下图：

![img](https://github-images.wenzhihuai.com/images/v2-9bd5069ce01db2607ea2db6751f1cb37_1440w.webp)

跟 G1 类似，ZGC 的堆内存也是基于 Region 来分布，不过 ZGC 是不区分新生代老年代的。不同的是，ZGC 的 Region 支持动态地创建和销毁，并且 Region 的大小不是固定的，包括三种类型的 Region ：

- Small Region：2MB，主要用于放置小于 256 KB 的小对象。
- Medium Region：32MB，主要用于放置大于等于 256 KB 小于 4 MB 的对象。
- Large Region：N * 2MB。这个类型的 Region 是可以动态变化的，不过必须是 2MB 的整数倍，最小支持 4 MB。每个 Large Region 只放置一个大对象，并且是不会被重分配的。

## **4 读屏障**

读屏障类似于 Spring AOP 的前置增强，是 JVM 向应用代码中插入一小段代码，当应用线程从堆中读取对象的引用时，会先执行这段代码。**注意：只有从堆内存中读取对象的引用时，才会执行这个代码**。下面代码只有第一行需要加入读屏障。

```text
Object o = obj.FieldA
Object p = o //不是从堆中读取引用
o.dosomething() //不是从堆中读取引用
int i =  obj.FieldB //不是引用类型
```

读屏障在解释执行时通过 load 相关的字节码指令加载数据。作用是在对象标记和转移过程中，判断对象的引用地址是否满足条件，并作出相应动作。如下图：

![img](https://github-images.wenzhihuai.com/images/v2-1ca4d50695135c37a833b0d25d295a08_1440w.webp)

标记、转移和重定位这些过程请看下一节。

> 读屏障会对应用程序的性能有一定影响，据测试，对性能的最高影响达到 4%，但提高了 GC 并发能力，降低了 STW。

## **5 GC 过程**

前面已经讲过，ZGC 使用内存多重映射技术，把物理内存映射为 Marked0、Marked1 和 Remapped 三个地址视图，利用地址视图的切换，ZGC 实现了高效的并发收集。

ZGC 的垃圾收集过程包括标记、转移和重定位三个阶段。如下图：

![img](https://github-images.wenzhihuai.com/images/v2-a0c8cf1fffc8dd487139841e371ce327_1440w.webp)

ZGC 初始化后，整个内存空间的地址视图被设置为 Remapped。

### **5.1 初始标记**

从 GC Roots 出发，找出 GC Roots 直接引用的对象，放入活跃对象集合，这个过程需要 STW，不过 **STW 的时间跟 GC Roots 数量成正比**，耗时比较短。

### **5.2 并发标记**

并发标记过程中，GC 线程和 Java 应用线程会并行运行。这个过程需要注意下面几点：

- GC 标记线程访问对象时，如果对象地址视图是 Remapped，就把对象地址视图切换到 Marked0，如果对象地址视图已经是 Marked0，说明已经被其他标记线程访问过了，跳过不处理。
- 标记过程中Java 应用线程新创建的对象会直接进入 Marked0 视图。
- 标记过程中Java 应用线程访问对象时，如果对象的地址视图是 Remapped，就把对象地址视图切换到 Marked0，可以参考前面讲的读屏障。
- 标记结束后，如果对象地址视图是 Marked0，那就是活跃的，如果对象地址视图是 Remapped，那就是不活跃的。

**标记阶段的活跃视图也可能是 Marked1，为什么会采用两个视图呢？**

这里采用两个视图是为了区分前一次标记和这一次标记。如果这次标记的视图是 Marked0，那下一次并发标记就会把视图切换到 Marked1。这样做可以配合 ZGC 按照页回收垃圾的做法。如下图：

![img](https://github-images.wenzhihuai.com/images/v2-064d101e87e45dde0f6d25668c2820e4_1440w.webp)

第二次标记的时候，如果还是切换到 Marked0，那么 2 这个对象区分不出是活跃的还是上次标记过的。如果第二次标记切换到 Marked1，就可以区分出了。

这时 Marked0 这个视图的对象就是上次标记过程被标记过活跃，转移的时候没有被转移，但这次标记没有被标记为活跃的对象。Marked1 视图的对象是这次标记被标记为活跃的对象。Remapped 视图的对象是上次垃圾回收发生转移或者是被 Java 应用线程访问过，本次垃圾回收中被标记为不活跃的对象。

### **5.3 再标记**

并发标记阶段 GC 线程和 Java 应用线程并发执行，标记过程中可能会有引用关系发生变化而导致的漏标记问题。再标记阶段重新标记**并发标记阶段**发生变化的对象，还会对非强引用（软应用，虚引用等）进行并行标记。

这个阶段需要 STW，但是需要标记的对象少，耗时很短。

### **5.4 初始转移**

**转移就是把活跃对象复制到新的内存，之前的内存空间可以被回收。**

初始转移需要扫描 GC Roots 直接引用的对象并进行转移，这个过程需要 STW，STW 时间跟 GC Roots 成正比。

### **5.5 并发转移**

并发转移过程 GC 线程和 Java 线程是并发进行的。上面已经讲过，转移过程中对象视图会被切回 Remapped 。转移过程需要注意以下几点：

- 如果 GC 线程访问对象的视图是 Marked0，则转移对象，并把对象视图设置成 Remapped。
- 如果 GC 线程访问对象的视图是 Remapped，说明被其他 GC 线程处理过，跳过不再处理。
- 并发转移过程中 Java 应用线程创建的新对象地址视图是 Remapped。
- 如果 Java 应用线程访问的对象被标记为活跃并且对象视图是 Marked0，则转移对象，并把对象视图设置成 Remapped。

### **5.6 重定位**

转移过程对象的地址发生了变化，在这个阶段，把所有指向对象旧地址的指针调整到对象的新地址上。

## **6 垃圾收集算法**

ZGC 采用标记 - 整理算法，算法的思想是把所有存活对象移动到堆的一侧，移动完成后回收掉边界以外的对象。如下图：

![img](https://github-images.wenzhihuai.com/images/v2-59c87f0385d1c53919152250f73770d8_1440w.webp)

### **6.1 JDK 16 之前**

在 JDK 16 之前，ZGC 会预留（Reserve）一块儿堆内存，这个预留内存不能用于 Java 线程的内存分配。即使从 Java 线程的角度看堆内存已经满了也不能使用 Reserve，只有 GC 过程中搬移存活对象的时候才可以使用。如下图：

![img](https://github-images.wenzhihuai.com/images/v2-ed0c5178c1a4429f0794f024211e687c_1440w.webp)

这样做的好处是算法简单，非常适合并行收集。但这样做有几个问题：

- 因为有预留内存，能给 Java 线程分配的堆内存小于 JVM 声明的堆内存。
- Reserve 仅仅用于存放 GC 过程中搬移的对象，有点内存浪费。
- 因为 Reserve 不能给 GC 过程中搬移对象的 Java 线程使用，搬移线程可能会因为申请不到足够内存而不能完成对象搬移，这返回过来又会导致应用程序的 OOM。

### **6.2 JDK 16 改进**

JDK 16 发布后，ZGC 支持就地搬移对象（G1 在 Full GC 的时候也是就地搬移）。这样做的好处是不用预留空闲内存了。如下图：

![img](https://github-images.wenzhihuai.com/images/v2-af685613a34e774a88b112fe43b2b2a0_1440w.webp)

不过就地搬移也有一定的挑战。比如：必须考虑搬移对象的顺序，否则可能会覆盖尚未移动的对象。这就需要 GC 线程之间更好的进行协作，不利于并发收集，同时也会导致搬移对象的 Java 线程需要考虑什么可以做什么不可以做。

为了获得更好的 GC 表现，**JDK 16 在支持就地搬移的同时，也支持预留（Reserve）堆内存的方式**，并且 ZGC 不需要真的预留空闲的堆内存。默认情况下，只要有空闲的 region，ZGC 就会使用预留堆内存的方式，如果没有空闲的 region，否则 ZGC 就会启用就地搬移。如果有了空闲的 region， ZGC 又会切换到预留堆内存的搬移方式。

## **7 总结**

内存多重映射和染色指针的引入，使 ZGC 的并发性能大幅度提升。

**ZGC 只有 3 个需要 STW 的阶段**，其中初始标记和初始转移只需要扫描所有 GC Roots，STW 时间 GC Roots 的数量成正比，不会耗费太多时间。再标记过程主要处理并发标记引用地址发生变化的对象，这些对象数量比较少，耗时非常短。可见整个 ZGC 的 STW 时间几乎只跟 GC Roots 数量有关系，不会随着堆大小和对象数量的变化而变化。

ZGC 也有一个缺点，就是浮动垃圾。因为 ZGC 没有分代概念，虽然 ZGC 的 STW 时间在 1ms 以内，但是 ZGC 的整个执行过程耗时还是挺长的。在这个过程中 Java 线程可能会创建大量的新对象，这些对象会成为浮动垃圾，只能等下次 GC 的时候进行回收。



参考：

1.[https://wiki.openjdk.java.net/display/zgc](https://link.zhihu.com/?target=https%3A//wiki.openjdk.java.net/display/zgc)

2.[https://openjdk.java.net/jeps/304](https://link.zhihu.com/?target=https%3A//openjdk.java.net/jeps/304)

3.[https://openjdk.java.net/jeps/376](https://link.zhihu.com/?target=https%3A//openjdk.java.net/jeps/376)

4.[https://malloc.se/blog/zgc-jdk16](https://link.zhihu.com/?target=https%3A//malloc.se/blog/zgc-jdk16)

5.[https://mp.weixin.qq.com/s/ag5u2EPObx7bZr7hkcrOTg](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s/ag5u2EPObx7bZr7hkcrOTg)

6.[https://mp.weixin.qq.com/s/FIr6r2dcrm1pqZj5Bubbmw](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s/FIr6r2dcrm1pqZj5Bubbmw)

7.[https://www.jianshu.com/p/664e4da05b2c](https://link.zhihu.com/?target=https%3A//www.jianshu.com/p/664e4da05b2c)

8.[https://www.cnblogs.com/jimoer/p/13170249.html](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/jimoer/p/13170249.html)

9.[https://www.jianshu.com/p/12544c0ad](https://link.zhihu.com/?target=https%3A//www.jianshu.com/p/12544c0ad5c1)
