# 在鹅厂做java开发是什么体验

离职已有好几个月，准备写一篇关于之前在腾讯做Java开发的经历，现在来谈谈在Java领域里，在腾讯做Java开发的体验。随便写写别较真。

![](https://github-images.wenzhihuai.com/images/image-20250226005803850.png)

首先，介绍一下腾讯里与Java相关的部门。主要有CDG中的腾讯广告和FIT（金融科技事业群）理财通。其他部门则包括TEG中的一些大数据部门，以及IEG中的大数据相关团队。在腾讯，大部分Java工作都是与大数据相关的，因此在腾讯写代码的项目通常B2B或大数据相关的业务，其他类型项目较少。

![](https://github-images.wenzhihuai.com/images/a0722ea4-4c0d-43ae-8237-26fc2141dcbe.jpeg)

## 一、Spring Boot

接下来谈谈在腾讯的一些开发工具。首先，在框架方面，大部分项目仍然使用Spring Boot，也有一些项目选择不知名的框架，曾经看到过使用Grizzly（号称高性能目前已过时）的项目，然后加了Spring Boot变成了大杂烩，可能是因为晋升有东西可讲吧。

还有一些历史较悠久的项目，各种奇怪的框架都有存在。关于JDK，绝大多数项目使用的版本各异，某些项目甚至源自十几或二十年前，可能会基于JDK1.8，更新的则普遍使用JDK 17，具体还是看各个部门的选择。一些ToB业务由于需要迁移到云端，使用了腾讯云的微服务框架TSF，没用过不评价吧。

![](https://github-images.wenzhihuai.com/images/image-20250226221411785.png)

## 二、中间件、服务发现、网关等

中间件其实都是以来腾讯云，有些BG会二次封装一下，基本也都是Kafka、Mysql、Elasticsearch、Redis这些，二次改装后可能交Tendis，TKafka，TDSQL之类的，是不是很好奇都加了个T，之前有人在脉脉调侃会不会出个TDeepSeek哈哈哈。

在服务发现方面早期的有Taf，搭配nginx实现微服务框架，同时提供服务发现功能。令人惊讶的是，这些技术已经存在十几、二十年了，由于历史原因，也不敢动，不得不持续使用。内部大部分使用北极星（即在GitHub上开源的Polaris）。也存在一些较老的网关，名字记不太清了。

RPC的话，内部频繁提到的是TRPC，这是一种类似于开源gRPC的框架。TRPC是基于TAF演变而来，是专为RPC设计的框架。公司为了推广这一框架，已成功在不少项目中应用。然而，TOB业务使用这一框架的情况较少，大部分仍使用SpringCloud框架，尤其是Spring Cloud。我个人觉得，灵活性是最佳策略，绝大多数项目选择Spring Boot。如果整合Kubernetes（k8s），再加上北极星网关，这样基本能够满足大部分业务需求。内部主要还是看团队的工具为主，基本每个BG都在搞自己的paas相关服务，比如tkex、天机阁，各种名字都有。

ToB的业务可能比较惨，一边公司要求必须使用公司组件，一边客户要求不能使用鹅厂内部的东西，有时就得准备两套应对。。。

![](https://github-images.wenzhihuai.com/images/image-20250226221646890.png)

## 三、大数据

内部也是封装了spark、flink这些，有的叫taiji、有的叫洛子(us)，现在不知道啥情况了，迭代很慢，spark on k8s这个天然适合调度的，不知道现在集成情况怎么样了。ui的话，感觉洛子交互更加友好（个人感觉哈），任务之间拉条线就能上下依赖，外面也有海豚apache dolphinscheduler类似的。虽然整体大数据平时吐槽会有点老旧，好像外面的集成更差一点哈哈。

## 四、监控

在监控方面，各种工具层出不穷。早期有秒级监控，还有天机阁。内部主流的监控产品是孵化出来的，其次有资源监控功能。确实有一些会议类似Prometheus的开源项目，资源监控的实现相对困难，设计上存在一些冗杂的环节。当一个服务不属于任何具体服务时，必须依赖于Agent（这可能指某种特定的日志或监控工具）来收集日志或监控数据。个人觉得这种设计有点奇葩，不知道怎么想的，部署一个服务还得配置考虑怎么配置日志、监控相关的agent。

早期的秒级监控确实良好，并配有成熟的告警机制，但之后维护减少。我推测，监控逐渐被当作数据库使用，因为多维度相乘的成本相当高，最终的成本由业务自行承担，跨越发展时期的项目因无法承受过高的成本而被迫退出。许多项目在无奈的情况下，选择继续迁移至资源监控，导致监控的使用过程中显得相当不合理。

此外，也了解到一些部门使用Prometheus，外部生态的确较好，不过Prometheus在腾讯内部使用较少。关于PaaS服务，公司内部有很多平台，主流的是腾讯云及PCG的007平台，还有TEG的TKEX。内部孵化的平台较多，同时保留了一些早期云平台的遗留产物，毕竟是在云原生技术成熟之前形成的。

由于历史原因，维护这些老旧服务的工作极具挑战性，始终难以去除（这可能指这些古老服务一直以来存在且难以消除的现状），业务方面的调整往往比较谨慎。不同产品线的输出中，也有CICD（持续集成/持续部署）相关的工具。确实存在许多优秀的CICD工具，以蓝鲸平台为主，还有一些收购的公司如Coding等，提供多样化的CICD工具。

![](https://github-images.wenzhihuai.com/images/image-20250226004709780.png)

## 五、职场那点事-有人的地方就有江湖。

腾讯主要还是以C++、Go为主，做为Java在里面的位置可想而知。10位组长中大约有4位曾经负责C++和PHP开发，另1位可能来自算法研究，剩余5位才是Java相关的。所以和组长的沟通中，就显得非常重要，比如周会说下进度的时候，有的人就简单两三句说完了，有的人就会把很简单的事情说的很复杂，甚至还把别人的成果也说了进去，那么在组长眼里，你做的事情太简单了，别人做的事情更有成果。当然了，大厂还是主要看组，每个组的氛围都不同，也跟组织架构有关，有时候每半年换个总监，每次换领导之前的项目就没有意义了，每个领导的想法不同吧。整体而言，外面也一样，都是看运气和个人如何面对吧。

## 六、总结

滨海里的夕阳很好看

![](https://github-images.wenzhihuai.com/images/image-20250226004658950.png)

