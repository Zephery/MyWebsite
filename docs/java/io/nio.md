# JAVA NIO

## 一、简介

1）Java BIO ： 同步并阻塞(传统阻塞型)，服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销。

2）Java NIO ： 同步非阻塞，服务器实现模式为一个线程处理多个请求(连接)，即客户端发送的连接请求都会注册到多路复用器上，多路复用器轮询到连接有I/O请求就进行处理。

3）Java AIO：异步非阻塞，在AIO模型中，当我们发起一个I/O操作（如读或写）时，我们不需要等待它完成，我们的代码会立即返回，可以继续执行其他任务。当I/O操作完成时，我们之前注册的回调函数会被自动调用，我们可以在这个回调函数中处理I/O操作的结果。

### 1.1典型的多路复用IO实现

目前流程的多路复用IO实现主要包括四种: `select`、`poll`、`epoll`、`kqueue`。下表是他们的一些重要特性的比较:

| IO模型 | 相对性能 | 数据结构     | 关键思路         | 操作系统      | JAVA支持情况                                                 |
| ------ | -------- | ------------ | ---------------- | ------------- | ------------------------------------------------------------ |
| select | 较高     | 位图         | Reactor          | windows/Linux | 支持,Reactor模式(反应器设计模式)。Linux操作系统的 kernels 2.4内核版本之前，默认使用select；而目前windows下对同步IO的支持，都是select模型 |
| poll   | 较高     | 数组或者链表 | Reactor          | Linux         | Linux下的JAVA NIO框架，Linux kernels 2.6内核版本之前使用poll进行支持。也是使用的Reactor模式 |
| epoll  | 高       | 红黑树       | Reactor/Proactor | Linux         | Linux kernels 2.6内核版本及以后使用epoll进行支持；Linux kernels 2.6内核版本之前使用poll进行支持；另外一定注意，由于Linux下没有Windows下的IOCP技术提供真正的 异步IO 支持，所以Linux下使用epoll模拟异步IO |
| kqueue | 高       |              | Proactor         | Linux         | 目前JAVA的版本不支持                                         |

多路复用IO技术最适用的是“高并发”场景，所谓高并发是指1毫秒内至少同时有上千个连接请求准备好。其他情况下多路复用IO技术发挥不出







## 参考

1.[元动力](https://www.ydlclass.com/doc21xnv/java/first/javase/15%E3%80%81nio/)
