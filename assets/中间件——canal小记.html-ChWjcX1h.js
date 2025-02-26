import{_ as a,c as t,d as i,o as n}from"./app-DChB4uJf.js";const s={};function l(r,e){return n(),t("div",null,e[0]||(e[0]=[i(`<h1 id="canal小记" tabindex="-1"><a class="header-anchor" href="#canal小记"><span>canal小记</span></a></h1><p>接到个小需求，将mysql的部分数据增量同步到es，但是不仅仅是使用canal而已，整体的流程是mysql&gt;&gt;canal&gt;&gt;flume&gt;&gt;kafka&gt;&gt;es，说难倒也不难，只是做起来碰到的坑实在太多，特别是中间套了那么多中间件，出了故障找起来真的特别麻烦。</p><p>先来了解一下MySQL的主从备份：</p><figure><img src="https://github-images.wenzhihuai.com/images/20180421025107389573244.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>从上层来看，复制分成三步：<br> master将改变记录到二进制日志(binary log)中（这些记录叫做二进制日志事件，binary log events，可以通过show binlog events进行查看）；<br> slave将master的binary log events拷贝到它的中继日志(relay log)；<br> slave重做中继日志中的事件，将改变反映它自己的数据。</p><h2 id="问题一-测试环境一切正常-但是正式环境中-这几个字段全为0-不知道为什么" tabindex="-1"><a class="header-anchor" href="#问题一-测试环境一切正常-但是正式环境中-这几个字段全为0-不知道为什么"><span>问题一：测试环境一切正常，但是正式环境中，这几个字段全为0，不知道为什么</span></a></h2><p>最后发现是沟通问题。。。</p><figure><img src="https://github-images.wenzhihuai.com/images/2018042101385616022393.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>排查过程：</p><ol><li>起初，怀疑是es的问题，会不会是string转为long中出现了问题，PUT了个，无异常，这种情况排除。</li><li>再然后以为是代码有问题，可是想了下，rowData.getAfterColumnsList().forEach(column -&gt; data.put(column.getName(), column.getValue()))这句不可能有什么其他的问题啊，而且测试环境中一切都是好好的。</li><li>canal安装出错，重新查看了一次canal.properties和instance.properties，并没有发现配置错了啥，如果错了，那为什么只有那几个字段出现异常，其他的都是好好的，郁闷。而且，用测试环境的canal配置生产中的数据库，然后本地调试，结果依旧一样。可能问题出在mysql。</li></ol><p>最后发现，居然是沟通问题。。。。测试环境中是从正式环境导入的，用的insert，可是在正式环境里，用的确实insert后update字段，之后发现居然还用delete，，，，晕。。。。之前明确问过了只更新insert的，人与人之间的信任在哪里。。。。</p><h2 id="问题二-canal-properties中四种模式的差别" tabindex="-1"><a class="header-anchor" href="#问题二-canal-properties中四种模式的差别"><span>问题二：canal.properties中四种模式的差别</span></a></h2><p>简单的说，canal维护一份增量订阅和消费关系是依靠解析位点和消费位点的，目前提供了一下四种配置，一开始我也是懵的。</p><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">#canal.instance.global.spring.xml = classpath:spring/local-instance.xml</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">#canal.instance.global.spring.xml = classpath:spring/memory-instance.xml</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">canal.instance.global.spring.xml = classpath:spring/file-instance.xml</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">#canal.instance.global.spring.xml = classpath:spring/default-instance.xml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>local-instance</strong><br> 我也不知道啥。。</p><p><strong>memory-instance</strong><br> 所有的组件(parser , sink , store)都选择了内存版模式，记录位点的都选择了memory模式，重启后又会回到初始位点进行解析<br> 特点：速度最快，依赖最少(不需要zookeeper)<br> 场景：一般应用在quickstart，或者是出现问题后，进行数据分析的场景，不应该将其应用于生产环境。<br> 个人建议是调试的时候使用该模式，即新增数据的时候，客户端能马上捕获到改日志，但是由于位点一直都是canal启动的时候最新的，不适用与生产环境。</p><p><strong>file-instance</strong><br> 所有的组件(parser , sink , store)都选择了基于file持久化模式，注意，不支持HA机制.<br> 特点：支持单机持久化<br> 场景：生产环境，无HA需求，简单可用.<br> 采用该模式的时候，如果关闭了canal，会在destination中生成一个meta.dat，用来记录关键信息。如果想要启动canal之后马上订阅最新的位点，需要把该文件删掉。<br><em>{&quot;clientDatas&quot;:[{&quot;clientIdentity&quot;:{&quot;clientId&quot;:1001,&quot;destination&quot;:&quot;example&quot;,&quot;filter&quot;:&quot;.</em>\\..<em>&quot;},&quot;cursor&quot;:{&quot;identity&quot;:{&quot;slaveId&quot;:-1,&quot;sourceAddress&quot;:{&quot;address&quot;:&quot;192.168.6.71&quot;,&quot;port&quot;:3306}},&quot;postion&quot;:{&quot;included&quot;:false,&quot;journalName&quot;:&quot;binlog.008335&quot;,&quot;position&quot;:221691106,&quot;serverId&quot;:88888,&quot;timestamp&quot;:1524294834000}}}],&quot;destination&quot;:&quot;example&quot;}</em></p><p><strong>default-instance</strong><br> 所有的组件(parser , sink , store)都选择了持久化模式，目前持久化的方式主要是写入zookeeper，保证数据集群共享。<br> 特点：支持HA<br> 场景：生产环境，集群化部署.<br> 该模式会记录集群中所有运行的节点，主要用与HA主备模式，节点中的数据如下，可以关闭某一个canal服务来查看running的变化信息。</p><figure><img src="https://github-images.wenzhihuai.com/images/201804210425561692361189.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="问题三-如果要订阅的是mysql的从库改怎么做" tabindex="-1"><a class="header-anchor" href="#问题三-如果要订阅的是mysql的从库改怎么做"><span>问题三：如果要订阅的是mysql的从库改怎么做？</span></a></h2><p>生产环境中的主库是不能随便重启的，所以订阅的话必须订阅mysql主从的从库，而从库中是默认下只将主库的操作写进中继日志，并写到自己的二进制日志的，所以需要让其成为canal的主库，必须让其将日志也写到自己的二进制日志里面。处理方法：修改/etc/my.cnf，增加一行log_slave_updates=1，重启数据库后就可以了。</p><figure><img src="https://github-images.wenzhihuai.com/images/201804210451321357023546.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="问题四-部分字段没有更新" tabindex="-1"><a class="header-anchor" href="#问题四-部分字段没有更新"><span>问题四：部分字段没有更新</span></a></h2><p>最终版本是以mysql的id为es的主键，用canal同步到flume，再由flume到kafka，然后再由一个中间件写到es里面去，结果发现，一天之中，会有那么一段时间得出的结果少一丢丢，甚至是骤降，如图。不得不从头开始排查情况，canal到flume，加了canal的重试，以及发送到flume的重试机制，没有报错，所有数据正常发送。flume到kafka不敢怀疑，毕竟公司一直在用，怎么可能有问题。kafka到es的中间件？组长写的，而且一直在用，不可能==最后确认的是flume到kafka，kafka的parition处理速度不同，</p><figure><img src="https://github-images.wenzhihuai.com/images/20180428015132288764661.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>check一下flume的文档，可以知道</p><table><thead><tr><th>Property Name</th><th>Description</th></tr></thead><tbody><tr><td>defaultPartitionId</td><td>Specifies a Kafka partition ID (integer) for all events in this channel to be sent to, unless overriden by partitionIdHeader. By default, if this property is not set, events will be distributed by the Kafka Producer’s partitioner - including by key if specified (or by a partitioner specified by kafka.partitioner.class).</td></tr><tr><td>partitionIdHeader</td><td>When set, the producer will take the value of the field named using the value of this property from the event header and send the message to the specified partition of the topic. If the value represents an invalid partition the event will not be accepted into the channel. If the header value is present then this setting overrides defaultPartitionId.</td></tr></tbody></table><p>大概意思是flume如果不自定义partitionIdHeader，那么消息将会被分布式kafka的partion处理，kafka本身的设置就是高吞吐量的消息系统，同一partion的消息是可以按照顺序发送的，但是多个partion就不确定了，如果需要将消息按照顺序发送，那么就必须要指定一个parition，即在flume的配置文件中添加：a1.channels.channel1.partitionIdHeader=1，指定parition即可。全部修改完之后，在kibana查看一下曲线：</p><figure><img src="https://github-images.wenzhihuai.com/images/201804290227121343830102.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>用sql在数据库确认了下，终于一致了，不容易。。。</p>`,30)]))}const p=a(s,[["render",l],["__file","中间件——canal小记.html.vue"]]),c=JSON.parse('{"path":"/middleware/canal/%E4%B8%AD%E9%97%B4%E4%BB%B6%E2%80%94%E2%80%94canal%E5%B0%8F%E8%AE%B0.html","title":"canal小记","lang":"zh-CN","frontmatter":{"description":"canal小记 接到个小需求，将mysql的部分数据增量同步到es，但是不仅仅是使用canal而已，整体的流程是mysql>>canal>>flume>>kafka>>es，说难倒也不难，只是做起来碰到的坑实在太多，特别是中间套了那么多中间件，出了故障找起来真的特别麻烦。 先来了解一下MySQL的主从备份： 从上层来看，复制分成三步： master将改...","head":[["meta",{"property":"og:url","content":"http://www.wenzhihuai.com/middleware/canal/%E4%B8%AD%E9%97%B4%E4%BB%B6%E2%80%94%E2%80%94canal%E5%B0%8F%E8%AE%B0.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"canal小记"}],["meta",{"property":"og:description","content":"canal小记 接到个小需求，将mysql的部分数据增量同步到es，但是不仅仅是使用canal而已，整体的流程是mysql>>canal>>flume>>kafka>>es，说难倒也不难，只是做起来碰到的坑实在太多，特别是中间套了那么多中间件，出了故障找起来真的特别麻烦。 先来了解一下MySQL的主从备份： 从上层来看，复制分成三步： master将改..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://github-images.wenzhihuai.com/images/20180421025107389573244.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-06T07:53:39.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-06T07:53:39.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"canal小记\\",\\"image\\":[\\"https://github-images.wenzhihuai.com/images/20180421025107389573244.png\\",\\"https://github-images.wenzhihuai.com/images/2018042101385616022393.png\\",\\"https://github-images.wenzhihuai.com/images/201804210425561692361189.png\\",\\"https://github-images.wenzhihuai.com/images/201804210451321357023546.png\\",\\"https://github-images.wenzhihuai.com/images/20180428015132288764661.png\\",\\"https://github-images.wenzhihuai.com/images/201804290227121343830102.png\\"],\\"dateModified\\":\\"2024-02-06T07:53:39.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Zephery\\",\\"url\\":\\"https://wenzhihuai.com/article/\\"}]}"]]},"headers":[{"level":2,"title":"问题一：测试环境一切正常，但是正式环境中，这几个字段全为0，不知道为什么","slug":"问题一-测试环境一切正常-但是正式环境中-这几个字段全为0-不知道为什么","link":"#问题一-测试环境一切正常-但是正式环境中-这几个字段全为0-不知道为什么","children":[]},{"level":2,"title":"问题二：canal.properties中四种模式的差别","slug":"问题二-canal-properties中四种模式的差别","link":"#问题二-canal-properties中四种模式的差别","children":[]},{"level":2,"title":"问题三：如果要订阅的是mysql的从库改怎么做？","slug":"问题三-如果要订阅的是mysql的从库改怎么做","link":"#问题三-如果要订阅的是mysql的从库改怎么做","children":[]},{"level":2,"title":"问题四：部分字段没有更新","slug":"问题四-部分字段没有更新","link":"#问题四-部分字段没有更新","children":[]}],"git":{"createdTime":1707204155000,"updatedTime":1707206019000,"contributors":[{"name":"zhihuaiwen","email":"zhihuaiwen@tencent.com","commits":2}]},"readingTime":{"minutes":5.37,"words":1610},"filePathRelative":"middleware/canal/中间件——canal小记.md","localizedDate":"2024年2月6日","excerpt":"\\n<p>接到个小需求，将mysql的部分数据增量同步到es，但是不仅仅是使用canal而已，整体的流程是mysql&gt;&gt;canal&gt;&gt;flume&gt;&gt;kafka&gt;&gt;es，说难倒也不难，只是做起来碰到的坑实在太多，特别是中间套了那么多中间件，出了故障找起来真的特别麻烦。</p>","autoDesc":true}');export{p as comp,c as data};
