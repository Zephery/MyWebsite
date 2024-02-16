# synchronized
*偏向锁在JDK 15后已经废弃*

## 一、什么是synchronized

`synchronized`关键字提供了一种简单而有效的方式来控制并发访问共享资源。但是，它也有一些限制，例如性能问题和潜在的死锁风险，在更复杂的并发场景中，可以考虑使用`java.util.concurrent`包中提供的更灵活的同步机制。

![img](https://github-images.wenzhihuai.com/images/v2-47781295251ded0e8ff32cf6a73fbfd0_1440w.webp)











## 参考

1.[MarkWord和Synchronized的锁升级机制详解（JDK8）](https://zhuanlan.zhihu.com/p/676473256)
