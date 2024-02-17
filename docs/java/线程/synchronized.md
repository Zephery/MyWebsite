# synchronized

*偏向锁在JDK 15后已经废弃*

## 一、什么是synchronized

关键字提供了一种简单而有效的方式来控制并发访问共享资源。但是，它也有一些限制，例如性能问题和潜在的死锁风险，在更复杂的并发场景中，可以考虑使用`java.util.concurrent`包中提供的更灵活的同步机制。

![img](https://github-images.wenzhihuai.com/images/v2-47781295251ded0e8ff32cf6a73fbfd0_1440w.webp)

学习Java的小伙伴都知道synchronized关键字是解决并发问题常用解决方案，常用的有以下三种使用方式：

- 修饰代码块，即同步语句块，其作用的范围是大括号{}括起来的代码，作用的对象是调用这个代码块的对象。
- 修饰普通方法，即同步方法，其作用的范围是整个方法，作用的对象是调用这个方法的对象。
- 修饰静态方法，其作用的范围是整个静态方法，作用的对象是这个类的所有对象。

关于synchronized的使用方式以及三种锁的区别在[学习指南](https://blog.csdn.net/carson_ho/article/details/82992269)中讲解的十分清楚。

具体使用规则如下：
![在这里插入图片描述](https://github-images.wenzhihuai.com/images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zNjc1OTQwNQ==,size_16,color_FFFFFF,t_70.png)

## 二、Synchronized 原理

实现原理： JVM 是通过进入、退出 **对象监视器(Monitor)** 来实现对方法、同步块的同步的，而对象监视器的本质依赖于底层操作系统的 **互斥锁(Mutex Lock)** 实现。

具体实现是在编译之后在同步方法调用前加入一个`monitor.enter`指令，在退出方法和异常处插入`monitor.exit`的指令。

对于没有获取到锁的线程将会阻塞到方法入口处，直到获取锁的线程`monitor.exit`之后才能尝试继续获取锁。

流程图如下：
![在这里插入图片描述](https://github-images.wenzhihuai.com/images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zNjc1OTQwNQ==,size_16,color_FFFFFF,t_70.jpeg)

通过一段代码来演示:

```java
public static void main(String[] args) {
    synchronized (Synchronize.class){
        System.out.println("Synchronize");
    }
}
12345
```

使用`javap -c Synchronize`可以查看编译之后的具体信息。
![在这里插入图片描述](https://github-images.wenzhihuai.com/images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zNjc1OTQwNQ==,size_16,color_FFFFFF,t_70-20240217012902416.png)
可以看到在同步块的入口和出口分别有`monitorenter`和`monitorexit`指令。当执行`monitorenter`指令时，线程试图获取锁也就是获取monitor（monitor对象存在于每个Java对象的对象头中，synchronized锁便是通过这种方式获取锁的，也是为什么Java中任意对象可以作为锁的原因）的持有权。当计数器为0则可以成功获取，获取后将锁计数器设为1也就是加1。相应的在执行`monitorexit`指令后，将锁计数器设为0，表明锁被释放。如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止。

在synchronized修饰方法时是添加`ACC_SYNCHRONIZED`标识，该标识指明了该方法是一个同步方法，JVM通过该`ACC_SYNCHRONIZED`访问标志来辨别一个方法是否声明为同步方法，从而执行相应的同步调用。
![在这里插入图片描述](https://github-images.wenzhihuai.com/images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zNjc1OTQwNQ==,size_16,color_FFFFFF,t_70-20240217012902463.png)
synchronized的特点：
![在这里插入图片描述](https://github-images.wenzhihuai.com/images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zNjc1OTQwNQ==,size_16,color_FFFFFF,t_70-20240217012902480.png)

## 三、Synchronized 优化

从synchronized的特点中可以看到它是一种重量级锁，会涉及到操作系统状态的切换影响效率，所以JDK1.6中对synchronized进行了各种优化，为了能减少获取和释放锁带来的消耗引入了偏向锁和轻量锁。

### 3.1 偏向锁

引入偏向锁是为了在无多线程竞争的情况下尽量减少不必要的轻量级锁执行路径，因为轻量级锁的获取及释放依赖多次CAS原子指令，而偏向锁只需要在置换ThreadID的时候依赖一次CAS原子指令（由于一旦出现多线程竞争的情况就必须撤销偏向锁，所以偏向锁的撤销操作的性能损耗必须小于节省下来的CAS原子指令的性能消耗）。

**3.1.1 偏向锁的获取过程**

（1）访问Mark Word中偏向锁的标识是否设置成“1”，锁标志位是否为“01”——确认为可偏向状态。
（2）如果为可偏向状态，判断线程ID是否指向当前线程，如果是进入步骤（5），否则进入步骤（3）。
（3）如果线程ID并未指向当前线程，则通过CAS操作竞争锁。如果竞争成功，则将Mark Word中线程ID设置为当前线程ID，然后执行（5）；如果竞争失败，执行（4）。

（4）如果CAS获取偏向锁失败，则表示有竞争。当到达全局安全点（safepoint）时获得偏向锁的线程被挂起，偏向锁升级为轻量级锁，然后被阻塞在安全点的线程继续往下执行同步代码。
（5）执行同步代码。

**3.1.2 偏向锁的释放**

偏向锁只有遇到其他线程尝试竞争偏向锁时，持有偏向锁的线程才会释放锁，线程不会主动去释放偏向锁。偏向锁的撤销，需要等待全局安全点（在这个时间点上没有字节码正在执行），它会首先暂停拥有偏向锁的线程，判断锁对象是否处于被锁定状态，撤销偏向锁后恢复到未锁定（标志位为“01”）或轻量级锁（标志位为“00”）的状态。

### 3.2 轻量锁

轻量级锁并不是用来代替重量级锁的，它的本意是在没有多线程竞争的前提下，减少传统的重量级锁使用产生的性能消耗。

**3.2.1 轻量级锁的加锁过程**

（1）在代码进入同步块时，如果同步对象锁状态为无锁状态（锁标志位为“01”状态，是否为偏向锁为“0”），虚拟机首先将在当前线程的栈帧中建立一个名为锁记录（Lock Record）的空间，用于存储锁对象目前的Mark Word的拷贝。
（2）拷贝对象头中的Mark Word复制到锁记录中。
（3）拷贝成功后，虚拟机将使用CAS操作尝试将对象的Mark Word更新为指向Lock Record的指针，并将Lock Record里的owner指针指向object mark word。如果更新成功，则执行步骤（3），否则执行步骤（4）。
（4）如果这个更新动作成功，那么这个线程就拥有了该对象的锁，并且对象Mark Word的锁标志位设置为“00”，即表示此对象处于轻量级锁定状态。
（5）如果这个更新操作失败，虚拟机首先会检查对象的Mark Word是否指向当前线程的栈帧，如果是就说明当前线程已经拥有了这个对象的锁，那就可以直接进入同步块继续执行。否则说明多个线程竞争锁，轻量级锁就要膨胀为重量级锁，锁标志的状态值变为“10”，Mark Word中存储的就是指向重量级锁（互斥量）的指针，后面等待锁的线程也要进入阻塞状态。 而当前线程便尝试使用自旋来获取锁，自旋就是为了不让线程阻塞，而采用循环去获取锁的过程。

**3.2.2 轻量级锁的解锁过程**

（1）通过CAS操作尝试把线程中复制的Displaced Mark Word对象替换当前的Mark Word。
（2）如果替换成功，整个同步过程完成。
（3）如果替换失败，说明有其他线程尝试过获取该锁（此时锁已膨胀），那就要在释放锁的同时，唤醒被挂起的线程。

### 3.3 其他优化

适应性自旋：在使用CAS时，如果操作失败，CAS会自旋再次尝试。由于自旋是需要消耗CPU资源的，所以如果长期自旋就白白浪费了CPU。JDK1.6 加入了适应性自旋，即如果某个锁自旋很少成功获得，那么下一次就会减少自旋。

通过`--XX:+UseSpinning`参数来开启自旋（JDK1.6之前默认关闭自旋）。
通过`--XX:PreBlockSpin`修改自旋次数，默认值是10次。

锁消除：锁消除指的就是虚拟机即使编译器在运行时，如果检测到那些共享数据不可能存在竞争，那么就执行锁消除。锁消除可以节省毫无意义的请求锁的时间。

锁粗化：我们在写代码时推荐将同步块的作用范围限制得尽量小——只在共享数据的实际作用域才进行同步，这样是为了使得需要同步的操作数量尽可能变小，如果存在锁竞争，那等待线程也能尽快拿到锁。

注意：在大部分情况下，上面的原则都是没有问题的，但是如果一系列的连续操作都对同一个对象反复加锁和解锁，那么会带来很多不必要的性能消耗。

## 四、扩展

其他控制并发/线程同步方式还有 Lock/ReentrantLock。

### 4.1 Synchronized 和 ReenTrantLock 的对比

① 两者都是可重入锁

两者都是可重入锁。“可重入锁”概念是：自己可以再次获取自己的内部锁。比如一个线程获得了某个对象的锁，此时这个对象锁还没有释放，当其再次想要获取这个对象的锁的时候还是可以获取的，如果不可锁重入的话，就会造成死锁。同一个线程每次获取锁，锁的计数器都自增1，所以要等到锁的计数器下降为0时才能释放锁。

② synchronized依赖于JVM而ReenTrantLock依赖于API

synchronized是依赖于JVM实现的，前面我们也讲到了 虚拟机团队在JDK1.6为synchronized关键字进行了很多优化，但是这些优化都是在虚拟机层面实现的，并没有直接暴露给我们。ReenTrantLock是JDK层面实现的（也就是API层面，需要lock()和unlock()方法配合try/finally语句块来完成），所以我们可以通过查看它的源代码，来看它是如何实现的。

③ ReenTrantLock比synchronized增加了一些高级功能

相比synchronized，ReenTrantLock增加了一些高级功能。主要来说主要有三点：①**等待可中断**；②**可实现公平锁**；③**可实现选择性通知**（锁可以绑定多个条件）

- ReenTrantLock提供了一种能够中断等待锁的线程的机制，通过lock.lockInterruptibly()来实现这个机制。也就是说正在等待的线程可以选择放弃等待，改为处理其他事情。
- ReenTrantLock可以指定是公平锁还是非公平锁。而synchronized只能是非公平锁。所谓的公平锁就是先等待的线程先获得锁。ReenTrantLock默认情况是非公平的，可以通过ReenTrantLoc类的ReentrantLock(boolean fair)构造方法来制定是否是公平的。
- synchronized关键字与wait()和notify()/notifyAll()方法相结合可以实现等待/通知机制，ReentrantLock类当然也可以实现，但是需要借助于Condition接口与newCondition()方法。Condition是JDK1.5之后才有的，它具有很好的灵活性，比如可以实现多路通知功能也就是在一个Lock对象中可以创建多个Condition实例（即对象监视器），线程对象可以注册在指定的Condition中，从而可以有选择性的进行线程通知，在调度线程上更加灵活。 在使用notify/notifyAll()方法进行通知时，被通知的线程是由JVM选择的，用ReentrantLock类结合Condition实例可以实现“选择性通知” ，这个功能非常重要，而且是Condition接口默认提供的。而synchronized关键字就相当于整个Lock对象中只有一个Condition实例，所有的线程都注册在它一个身上。如果执行notifyAll()方法的话就会通知所有处于等待状态的线程这样会造成很大的效率问题，而Condition实例的signalAll()方法只会唤醒注册在该Condition实例中的所有等待线程。

如果你想使用上述功能，那么选择ReenTrantLock是一个不错的选择。

④ 性能已不是选择标准

在JDK1.6之前，synchronized的性能是比ReenTrantLock差很多。具体表示为：synchronized关键字吞吐量随线程数的增加，下降得非常严重。而ReenTrantLock 基本保持一个比较稳定的水平。在JDK1.6之后JVM团队对synchronized关键字做了很多优化，性能基本能与ReenTrantLock持平。所以JDK1.6之后，性能已经不是选择 synchronized 和ReenTrantLock的影响因素，而且虚拟机在未来的性能改进中会更偏向于原生的synchronized，所以还是提倡在synchronized能满足你的需求的情况下，优先考虑使用synchronized关键字来进行同步！优化后的synchronized和ReenTrantLock一样，在很多地方都是用到了CAS操作。

CAS的原理是通过不断的比较内存中的值与旧值是否相同，如果相同则将内存中的值修改为新值，相比于synchronized省去了挂起线程、恢复线程的开销。

```java
// CAS的操作参数
// 内存位置（A）
// 预期原值（B）
// 预期新值（C）

// 使用CAS解决并发的原理：
// 1. 首先比较A、B，若相等，则更新A中的值为C、返回True；若不相等，则返回false；
// 2. 通过死循环，以不断尝试尝试更新的方式实现并发

// 伪代码如下
public boolean compareAndSwap(long memoryA, int oldB, int newC){
    if(memoryA.get() == oldB){
        memoryA.set(newC);
        return true;
    }
    return false;
}
1234567891011121314151617
```

具体使用当中CAS有个先检查后执行的操作，而这种操作在 Java 中是典型的不安全的操作，所以CAS在实际中是由C++通过调用CPU指令实现的。
具体过程：

1. CAS在Java中的体现为Unsafe类。
2. Unsafe类会通过C++直接获取到属性的内存地址。
3. 接下来CAS由C++的Atomic::cmpxchg系列方法实现。

AtomicInteger的 i++ 与 i-- 是典型的CAS应用，通过compareAndSet & 一个死循环实现。

```java
private volatile int value; 
/** 
* Gets the current value. 
* 
* @return the current value 
*/ 
public final int get() { 
   return value; 
} 
/** 
* Atomically increments by one the current value. 
* 
* @return the previous value 
*/ 
public final int getAndIncrement() { 
   for (;;) { 
       int current = get(); 
       int next = current + 1; 
       if (compareAndSet(current, next)) 
           return current; 
   } 
} 

/** 
* Atomically decrements by one the current value. 
* 
* @return the previous value 
*/ 
public final int getAndDecrement() { 
   for (;;) { 
       int current = get(); 
       int next = current - 1; 
       if (compareAndSet(current, next)) 
           return current; 
   } 
}
123456789101112131415161718192021222324252627282930313233343536
```

以上内容引用自[学习指南](https://blog.csdn.net/carson_ho/article/details/82992269)。
总的来说：
1、synchronized是java关键字，而Lock是java中的一个接口
2、synchronized会自动释放锁，而Lock必须手动释放锁
3、synchronized是不可中断的，Lock可以中断也可以不中断
4、通过Lock可以知道线程有没有拿到锁，而synchronized不能
5、synchronized能锁住方法和代码块，而Lock只能锁住代码块
6、Lock可以使用读锁提高多线程读效率
7、synchronized是非公平锁，ReentranLock可以控制是否公平锁

### 4.2 Synchronized 与 ThreadLocal 的对比

Synchronized 与 ThreadLocal（有关ThreadLocal的知识会在之后的博客中介绍）的比较：

1. Synchronized关键字主要解决多线程共享数据同步问题；ThreadLocal主要解决多线程中数据因并发产生不一致问题。
2. Synchronized是利用锁的机制，使变量或代码块只能被一个线程访问。而ThreadLocal为每一个线程都提供变量的副本，使得每个线程访问到的并不是同一个对象，这样就隔离了多个线程对数据的数据共享。




### 4.3 synchronized与volatile区别

| volatile                   | synchronized                     |
|------------------------|-------------------------|
| 通过禁止 CPU 缓存优化来保证变量的可见性 | 通过加锁和解锁来保证同步性和原子性       |     
| 只保证变量的可见性，还可以禁止指令重排    | 保证变量的可见性与原子性            |      
| volatile修饰变量，仅用于变量级    | synchronized锁变量或代码段，锁级  |      
| 不会造成线程阻塞               | 会造成线程阻塞                 |      
| 只是禁止了缓存优化，因此其开销相对较小    | 需要加锁、解锁等额外的操作，因此其开销相对较大 |      




## 五、各种锁

公平锁：是指多个线程按照申请锁的顺序来获取锁。
非公平锁：是指多个线程获取锁的顺序并不是按照申请锁的顺序，有可能后申请的线程比先申请的线程优先获取锁。有可能，会造成优先级反转或者饥饿现象。
可重入锁：是指可重复可递归调用的锁，在外层使用锁之后，在内层仍然可以使用，并且不发生死锁（前提是同一个对象或者class），这样的锁就叫做可重入锁。Lock和synchronized都是可重入锁
独享锁 ：该锁每一次只能被一个线程所持有。
共享锁 ：该锁可被多个线程共有，典型的就是ReentrantReadWriteLock里的读锁，它的读锁是可以被共享的，但是它的写锁确每次只能被独占。
互斥锁 ：在访问共享资源之前对其进行加锁操作，在访问完成之后进行解锁操作。 加锁后，任何其他试图再次加锁的线程会被阻塞，直到当前进程解锁。
读写锁 ：读写锁既是互斥锁，又是共享锁，read模式是共享，write是互斥(排它锁)的
乐观锁：总是假设最坏的情况，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会阻塞直到它拿到锁
悲观锁：总是假设最好的情况，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号机制和CAS算法实现。
偏向锁：是指一段同步代码一直被一个线程所访问，那么该线程会自动获取锁。降低获取锁的代价。
轻量级锁：是指当锁是偏向锁的时候，被另一个线程所访问，偏向锁就会升级为轻量级锁，其他线程会通过自旋的形式尝试获取锁，不会阻塞，提高性能。
重量级锁：是指当锁为轻量级锁的时候，另一个线程虽然是自旋，但自旋不会一直持续下去，当自旋一定次数的时候，还没有获取到锁，就会进入阻塞，该锁膨胀为重量级锁。重量级锁会让其他申请的线程进入阻塞，性能降低。
自旋锁：是指当一个线程在获取锁的时候，如果锁已经被其它线程获取，那么该线程将循环等待，然后不断的判断锁是否能够被成功获取，直到获取到锁才会退出循环 。

## 参考

1.[MarkWord和Synchronized的锁升级机制详解（JDK8）](https://zhuanlan.zhihu.com/p/676473256)
2.[synchronized 关键字原理](https://github.com/crossoverJie/JCSprout/blob/master/MD/Synchronize.md)
3.[Java并发编程：Synchronized底层优化（偏向锁、轻量级锁）](http://www.cnblogs.com/paddix/p/5405678.html)
4.[Java：这是一份全面 & 详细的 Sychronized关键字 学习指南](https://blog.csdn.net/carson_ho/article/details/82992269)


