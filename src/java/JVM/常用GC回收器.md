# 主流GC收集器采用的算法

| 垃圾回收器                  | 采用的GC算法                    | 代次   |
| --------------------------- | ------------------------------- | ------ |
| Serial                      | 复制                            | 新生代 |
| Parallel                    | 复制                            | 新生代 |
| ParNew                      | 复制                            | 新生代 |
| CMS (Concurrent Mark-Sweep) | 标记-清除                       | 老年代 |
| G1 (Garbage-First)          | 标记-整理                       | 老年代 |
| ZGC (Z Garbage Collector)   | 标记-整理                       | 老年代 |
| Shenandoah                  | 标记-复制（独立的全局复制阶段） | 老年代 |

上述表格展示了一些主流垃圾回收器所采用的GC算法。值得注意的是，一些回收器可能会组合使用不同的算法，或者在特定阶段采用特定的算法，以优化性能和内存利用。这种选择通常取决于应用程序的特性和性能需求。


## 是否可以使用两种或多种垃圾回收器
在Java中，你不能同时使用两种不同的垃圾回收器。Serial和G1是两种不同的垃圾回收器，它们有不同的设计目标和使用场景。

Serial垃圾回收器是一个单线程的垃圾回收器，它在进行垃圾回收时会暂停所有的应用线程。这种垃圾回收器适合于单核处理器或者内存较小的系统。

G1垃圾回收器是一种并行和并发的垃圾回收器，它可以处理大量的堆内存并且尽量减少垃圾回收引起的暂停时间。G1垃圾回收器适合于多核处理器和内存较大的系统。

如果你想在你的应用中使用某种垃圾回收器，你可以通过JVM的命令行选项来指定，例如"-XX:+UseSerialGC"可以启用Serial垃圾回收器，"-XX:+UseG1GC"可以启用G1垃圾回收器。但是你不能同时启用两种垃圾回收器。

## 查看java进程用的是哪种垃圾回收器
首先，你需要找到你的Java进程的进程ID。你可以使用jps命令来列出所有的Java进程和它们的进程ID。

然后，你可以使用jinfo -flags 进程ID命令来查看Java进程的JVM标志。在输出的信息中，你可以找到-XX:+UseXXXGC这样的标志，这个标志表示Java进程使用的垃圾回收器。例如，如果你看到-XX:+UseG1GC，那么这个Java进程就是使用G1垃圾回收器。
样例：
```shell
[root@xxxx-1-b68d78f6d-b9nnq /data/logs]# jinfo -flags 4868
VM Flags:
-XX:CICompilerCount=2 -XX:ConcGCThreads=1 -XX:G1ConcRefinementThreads=2 -XX:G1HeapRegionSize=1048576 -XX:GCDrainStackTargetSize=64 -XX:InitialHeapSize=2147483648 -XX:MarkStackSize=4194304 -XX:MaxHeapSize=2147483648 -XX:MaxNewSize=1287651328 -XX:MinHeapDeltaBytes=1048576 -XX:NonNMethodCodeHeapSize=5826188 -XX:NonProfiledCodeHeapSize=122916026 -XX:ProfiledCodeHeapSize=122916026 -XX:ReservedCodeCacheSize=251658240 -XX:+SegmentedCodeCache -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:+UseG1GC
```

## 怎么查看java进程eden、survivor等各个区的内存占用
用jstat -gc 进程ID命令来查看Java进程的堆内存使用情况。这个命令会显示一些列的数据，包括：

S0C、S1C、S0U、S1U：Survivor 0和Survivor 1区的当前容量（Capacity）和使用量（Used）。
EC、EU：Eden区的当前容量和使用量。
OC、OU：Old区的当前容量和使用量。
MC、MU：元数据区的当前容量和使用量。
CCSC、CCSU：压缩类空间的当前容量和使用量。
这些数据都是以KB为单位的。你可以通过这些数据来了解Java进程的堆内存使用情况。
样例：
```shell
[root@xxxx-1-b68d78f6d-b9nnq /data/logs]# jstat -gc  4868
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT    CGC    CGCT     GCT   
 0.0   5120.0  0.0   5120.0 1315840.0 871424.0  776192.0   300002.0  123212.0 117919.3 14464.0 12606.6  68825 1274.741   0      0.000  46      0.664 1275.405
```


## 参考：
1.[儒猿课堂](https://space.bilibili.com/478364560/article)