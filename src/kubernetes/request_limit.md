# Kubernetes之request 和 limit详解
我们都知道 Kubernetes 中最小的原子调度单位是Pod，那么就意味着资源管理和资源调度相关的属性都应该Pod对象的字段，其中我们最常见的就是 Pod 的 CPU 和内存配置，而为了实现 Kubernetes 集群中资源的有效调度和充分利用，Kubernetes采用 requests 和 limits 两种限制类型来对CPU和内存资源进行容器粒度的分配。

```yaml
resources:  
    limits:    
        cpu: "1"
        memory: "500Mi"
    requests:    
        cpu: "100m"
        memory: "1000Mi"
```
下面我们首先来了解一下上面这段 yaml 文件中字段的含义：requests 和 limits：

**requests 定义了对应的容器所需要的最小资源量。**
**limits 定义了对应容器最大可以消耗的资源上限。**
cpu 等于1一般等同于1CPU 核心，1个VCPU或者一个超线程，具体要看服务器的CPU。而 limits 这里设置的 100m 则叫做100毫核，100m就表示0.1个核,所以这里也可以用0.1代替。
memory 等于500Mi，（备注：1Mi=10241024；1M=10001000）
接下来我们来初步理解 requests 和 limits 这两个资源限制类型，在 Kubernetes 对 CPU 和内存资源限额的设计，通常是指用户在提交 Pod 时，可以声明一个相对较小的 requests 值供调度器使用，而 Kubernetes 真正设置给容器 Cgroups 的，则是相对较大的 limits 值。所以一般来说，在调度的时候 requests 比较重要，在运行时 limits 比较重要。

而对应实际的业务场景来说，以 java 应用为例，requests 对应的就是JVM虚拟机所需资源的最小值，而 limits 对应的就是 JVM 虚拟机所能够使用的资源最大值。以内存资源为例一般就是指：Xms 和 Xmx，如果 requests 值设置的小于JVM虚拟机 Xms 的值，那么就会导致 Pod 内存溢出，从而导致 Pod 被杀掉，而后重新创建一个Pod。

那么如果 CPU 资源使用超过了 limits，Pod会不会被杀掉呢？答案是不会，但是被限制。如果没有设置 limits ，Pod 可以使用全部空闲的资源。另外如果设置了 limits而没有设置 requests 时，Kubernetes 默认会将 requests 等于 limits。

这里通常还会将 requests 和 limits 描述的资源分为两类：可压缩资源（compressible resources） 和不可压缩资源（incompressible resources）。这里不难看出CPU这类型资源为可压缩资源，而内存这类型资源为不可压缩资源。所以合理设置不可压缩资源的limits值就相当重要了。
