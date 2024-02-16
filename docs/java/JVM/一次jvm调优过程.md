# 一次jvm调优过程  
前端时间把公司的一个分布式定时调度的系统弄上了容器云，部署在kubernetes，在容器运行的动不动就出现问题，特别容易jvm溢出，导致程序不可用，终端无法进入，日志一直在刷错误，kubernetes也没有将该容器自动重启。业务方基本每天都在反馈task不稳定，后续就协助接手看了下，先主要讲下该程序的架构吧。
该程序task主要分为三个模块：
console进行一些cron的配置（表达式、任务名称、任务组等）；
schedule主要从数据库中读取配置然后装载到quartz再然后进行命令下发；
client接收任务执行，然后向schedule返回运行的信息（成功、失败原因等）。
整体架构跟github上开源的xxl-job类似，也可以参考一下。

## 1. 启用jmx和远程debug模式
容器的网络使用了BGP，打通了公司的内网，所以可以直接通过ip来进行程序的调试，主要是在启动的jvm参数中添加：
```bash
JAVA_DEBUG_OPTS=" -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,address=0.0.0.0:8000,server=y,suspend=n "
JAVA_JMX_OPTS=" -Dcom.sun.management.jmxremote.port=1099 -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false "
```
其中，调试模式的address最好加上0.0.0.0，有时候通过netstat查看端口的时候，该位置显示为127.0.0.1，导致无法正常debug，开启了jmx之后，可以初步观察堆内存的情况。

![](https://github-images.wenzhihuai.com/images/20200121102100646998927.png)

![](https://github-images.wenzhihuai.com/images/20200121102112646209333.png)



堆内存（特别是cms的old gen），初步看代码觉得是由于用了大量的map，本地缓存了大量数据，怀疑是每次定时调度的信息都进行了保存。

## 2. memory analyzer、jprofiler进行堆内存分析
先从容器中dump出堆内存
```bash
jmap -dump:live,format=b,file=heap.hprof 58
```
![](https://github-images.wenzhihuai.com/images/202001211021411245129253.png)

由图片可以看出，这些大对象不过也就10M，并没有想象中的那么大，所以并不是大对象的问题，后续继续看了下代码，虽然每次请求都会把信息放进map里，如果能正常调通的话，就会移除map中保存的记录，由于是测试环境，执行端很多时候都没有正常运行，甚至说业务方关闭了程序，导致调度一直出现问题，所以map的只会保留大量的错误请求。不过相对于该程序的堆内存来说，不是主要问题。

## 3. netty的方面的考虑
另一个小伙伴一直怀疑的是netty这一块有错误，着重看了下。该程序用netty自己实现了一套rpc，调度端每次进行命令下发的时候都会通过netty的rpc来进行通信，整个过程逻辑写的很混乱，下面开始排查。
首先是查看堆内存的中占比：

![](https://github-images.wenzhihuai.com/images/20200121102201592637921.png)

可以看出，io.netty.channel.nio.NioEventLoop的占比达到了40%左右，再然后是io.netty.buffer.PoolThreadCache，占比大概达到33%左右。猜想可能是传输的channel没有关闭，还是NioEventLoop没有关闭。再跑去看一下jmx的线程数：

![](https://github-images.wenzhihuai.com/images/202001211022191867685117.png)

达到了惊人的1000个左右，而且一直在增长，没有过下降的趋势，再次猜想到可能是NioEventLoop没有关闭，在代码中全局搜索NioEventLoop，找到一处比较可疑的地方。

![](https://github-images.wenzhihuai.com/images/20200121102239634803742.png)

声明了一个NioEventLoopGroup的成员变量，通过构造方法进行了初始化，但是在执行syncRequest完之后并没有进行对group进行shutdownGracefully操作，外面对其的操作并没有对该类的group对象进行关闭，导致线程数一直在增长。

![](https://github-images.wenzhihuai.com/images/20200121102251548240533.png)

最终解决办法：
在调用完syncRequest方法时，对ChannelBootStrap的group对象进行行shutdownGracefully

![](https://github-images.wenzhihuai.com/images/202001211023001796761285.png)

提交代码，容器中继续测试，可以基本看出，线程基本处于稳定状态，并不会出现一直增长的情况了

![](https://github-images.wenzhihuai.com/images/202001211023141978405713.png)

还原本以为基本解决了，到最后还是发现，堆内存还算稳定，但是，直接内存依旧打到了100%，虽然程序没有挂掉，所以，上面做的，可能仅仅是为这个程序续命了而已，感觉并没有彻底解决掉问题。

![](https://github-images.wenzhihuai.com/images/202001211023231033694109.png)

## 4. 直接内存排查
第一个想到的就是netty的直接内存，关掉，命令如下：
```bash
-Dio.netty.noPreferDirect=true -Dio.netty.leakDetectionLevel=advanced
```

![](https://github-images.wenzhihuai.com/images/202001211023381459531529.png)

查看了一下java的nio直接内存，发现也就几十kb，然而直接内存还是慢慢往上涨。毫无头绪，然后开始了自己的从linux层面开始排查问题

## 5. 推荐的直接内存排查方法

#### 5.1 pmap
一般配合pmap使用，从内核中读取内存块，然后使用views 内存块来判断错误，我简单试了下，乱码，都是二进制的东西，看不出所以然来。
```bash
pmap -d 58  | sort -n -k2
pmap -x 58  | sort -n -k3
grep rw-p /proc/$1/maps | sed -n 's/^\([0-9a-f]*\)-\([0-9a-f]*\) .*$/\1 \2/p' | while read start stop; do gdb --batch --pid $1 -ex "dump memory $1-$start-$stop.dump 0x$start 0x$stop"; done
```
这个时候真的懵了，不知道从何入手了，难道是linux操作系统方面的问题？

#### 5.2 [gperftools]（https://github.com/gperftools/gperftools）
起初，在网上看到有人说是因为linux自带的glibc版本太低了，导致的内存溢出，考虑一下。初步觉得也可能是因为这个问题，所以开始慢慢排查。oracle官方有一个jemalloc用来替换linux自带的，谷歌那边也有一个tcmalloc，据说性能比glibc、jemalloc都强，开始换一下。
根据网上说的，在容器里装libunwind，然后再装perf-tools，然后各种捣鼓，到最后发现，执行不了，
```bash
pprof --text /usr/bin/java java_58.0001.heap
```

![](https://github-images.wenzhihuai.com/images/202001211024021477267177.png)

看着工具高大上的，似乎能找出linux的调用栈，
## 6. 意外的结果
毫无头绪的时候，回想到了linux的top命令以及日志情况，测试环境是由于太多执行端业务方都没有维护，导致调度系统一直会出错，一出错就会导致大量刷错误日志，平均一天一个容器大概就有3G的日志，cron一旦到准点，就会有大量的任务要同时执行，而且容器中是做了对io的限制，磁盘也限制为10G，导致大量的日志都堆积在buff/cache里面，最终直接内存一直在涨，这个时候，系统不会挂，但是先会一直显示内存使用率达到100%。
修复后的结果如下图所示：

![](https://github-images.wenzhihuai.com/images/202001211024142482541.png)

![](https://github-images.wenzhihuai.com/images/202001211024261078778632.png)

## 总结
定时调度这个系统当时并没有考虑到公司的系统会用的这么多，设计的时候也仅仅是为了实现上千的量，没想到到最后变成了一天的调度都有几百万次。最初那批开发也就使用了大量的本地缓存map来临时存储数据，然后面向简历编程各种用netty自己实现了通信的方式，一堆坑都留给了后人。目前也算是解决掉了一个由于线程过多导致系统不可用的情况而已，但是由于存在大量的map，系统还是得偶尔重启一下比较好。

参考：  
1.[记一次线上内存泄漏问题的排查过程](https://www.cnblogs.com/testfan2019/p/11151008.html)  
2.[Java堆外内存增长问题排查Case](https://coldwalker.com/2018/08//troubleshooter_native_memory_increase/)  
3.[Troubleshooting Native Memory Leaks in Java Applications](https://static.rainfocus.com/oracle/oow18/sess/1524505564465001W0mS/PF/Troubleshooting_native_memory_leaks_1540301908390001k6DR.pdf)  