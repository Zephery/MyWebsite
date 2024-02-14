# TCP/IP、HTTP、HTTPS、HTTP2.0
HTTP，全称超文本传输协议（HTTP，HyperText Transfer Protocol)，是一个客户端和服务器端请求和应答的标准（TCP），互联网上应用最为广泛的一种网络协议。客户端是终端用户，服务器端是网站。通过使用Web浏览器、网络爬虫或者其它的工具，客户端发起一个到服务器上指定端口（默认端口为80）的HTTP请求。

HTTPS，即加密后的HTTP。HTTP协议传输的数据都是未加密的，也就是明文的，因此使用HTTP协议传输隐私信息非常不安全。HTTPS都是用的TLS协议，但是由于SSL出现的时间比较早，并且依旧被现在浏览器所支持，因此SSL依然是HTTPS的代名词，但无论是TLS还是SSL都是上个世纪的事情，SSL最后一个版本是3.0，今后TLS将会继承SSL优良血统继续为我们进行加密服务。目前TLS的版本是1.2，定义在RFC 5246中，暂时还没有被广泛的使用。

HTTP2.0，下一代的HTTP协议。相比于HTTP1.x，大幅度的提升了web性能，进一步减少了网络延时和拥塞。

![](https://github-images.wenzhihuai.com/images/20171224034237.png)

各自的RFC相关文档自己去搜吧，[https://www.rfc-editor.org/](https://www.rfc-editor.org/)。

## 一、TCP/IP
为了了解HTTP，有必要先理解一下TCP/IP。目前，存在两种划分模型的方法，OSI七层模型和TCP/IP模型，具体的区别不在阐述。HTTP是建立在TCP协议之上，所以HTTP协议的瓶颈及其优化技巧都是基于TCP协议本身的特性，例如tcp建立连接的3次握手和断开连接的4次挥手以及每次建立连接带来的RTT延迟时间。

![](https://github-images.wenzhihuai.com/images/20171221101751.png)

TCP三次握手四次挥手的原理，由于篇幅关系，具体请看[TCP协议的三次握手和四次挥手](http://uule.iteye.com/blog/2213562)，

## 二、HTTP
超文本传输协议(HyperText Transfer Protocol) 是伴随着计算机网络和浏览器而诞生，[在浏览器出现之前，人们是怎么使用网络的？](http://www.ifanr.com/550613)，不管怎么说，那个时代对于现在的我们，有点难以想象。。。之后，网景发布了Netscape Navigator浏览器，才慢慢打开了互联网的幕布。如果根据OSI来划分的话，HTML属于表示层，而HTTP属于应用层。HTTP发展至今，经过了HTTP0.9、HTTP1.0、HTTP1.1、HTTP2.0的时代，虽然2.0很久之前就正式提出标准，大多浏览器也支持了，但是网络支持HTTP2.0的却很少。
### 2.1 HTTP报文分析
报文，是网络中交换和传输的基本单元，即一次性发送的数据块。HTTP的报文是由一行一行组成的，纯文本，而且是明文，即：如果能监听你的网络，那么你发送的所有账号密码都是可以看见的，为了保障数据隐秘性，HTTPS随之而生。
#### 2.1.1 请求报文：
为了形象点，我们把报文标准和实际的结合起来看。

![](https://github-images.wenzhihuai.com/images/20171221111615.png)

下面是实际报文，以访问自己的网站([http://www.wenzhihuai.com](http://www.wenzhihuai.com))中的一个链接为例。

![](https://github-images.wenzhihuai.com/images/20171221043103.png)

##### 请求行
请求行由方法字段、URL 字段 和HTTP 协议版本字段 3 个部分组成，他们之间使用空格隔开。常用的 HTTP 请求方法有 GET、POST、HEAD、PUT、DELETE、OPTIONS、TRACE、CONNECT，这里我们使用的是GET方法，访问的是/biaoqianyun.do，协议使用的是HTTP/1.1。  
**GET**：当客户端要从服务器中读取某个资源时，使用GET 方法。如果需要加传参数的话，需要在URL之后加个"?"，然后把参数名字和值用=连接起来，传递参数长度受限制，通常IE8的为4076，Chrome的为7675。例如，/index.jsp?id=100&op=bind。  
**POST**：当客户端给服务器提供信息较多时可以使用POST 方法，POST 方法向服务器提交数据，比如完成表单数据的提交，将数据提交给服务器处理。GET 一般用于获取/查询资源信息，POST 会附带用户数据，一般用于更新资源信息。POST 方法将请求参数封装在HTTP 请求数据中，以名称/值的形式出现，可以传输大量数据;
##### 请求头部
请求头部由关键字/值对组成，每行一对，关键字和值用英文冒号“:”分隔。请求头部通知服务器有关于客户端请求的信息，典型的请求头有：  
**User-Agent**：产生请求的浏览器类型;
**Accept**：客户端可识别的响应内容类型列表;星号 “ * ” 用于按范围将类型分组，用 “ */* ” 指示可接受全部类型，用“ type/* ”指示可接受 type 类型的所有子类型;
**Accept-Language**：客户端可接受的自然语言;  
**Accept-Encoding**：客户端可接受的编码压缩格式;  
**Accept-Charset**：可接受的应答的字符集;  
**Host**：请求的主机名，允许多个域名同处一个IP 地址，即虚拟主机;  
**connection**：连接方式(close 或 keepalive)，如果是close的话就需要进行TCP四次挥手关闭连接，如果是keepalive，表明还能继续使用，这是HTTP1.1对1.0的新增，加快了网络传输，默认是keepalive;  
**Cookie**：存储于客户端扩展字段，向同一域名的服务端发送属于该域的cookie;
###### 空行
最后一个请求头之后是一个空行，发送回车符和换行符，通知服务器以下不再有请求头;
##### 请求包体
请求包体不在 GET 方法中使用，而是在POST 方法中使用。POST 方法适用于需要客户填写表单的场合。与请求包体相关的最常使用的是包体类型 Content-Type 和包体长度 Content-Length;

#### 2.1.2 响应报文
同样，先粘贴报文标准。

![](https://github-images.wenzhihuai.com/images/20171224035755.png)

抓包，以访问([http://www.wenzhihuai.com](http://www.wenzhihuai.com))为例。

![](https://github-images.wenzhihuai.com/images/20171224035850.png)

##### 状态行
状态行由 HTTP 协议版本字段、状态码和状态码的描述文本 3 个部分组成，他们之间使用空格隔开，描述文本一般不显示;  
**状态码**：由三位数字组成，第一位数字表示响应的类型，常用的状态码有五大类如下所示：  
1xx：服务器已接收，但客户端可能仍要继续发送;  
2xx：成功;  
3xx：重定向;  
4xx：请求非法，或者请求不可达;  
5xx：服务器内部错误;
##### 响应头部：响应头可能包括：
**Location**：Location响应报头域用于重定向接受者到一个新的位置。例如：客户端所请求的页面已不存在原先的位置，为了让客户端重定向到这个页面新的位置，服务器端可以发回Location响应报头后使用重定向语句，让客户端去访问新的域名所对应的服务器上的资源;    
**Server**：Server 响应报头域包含了服务器用来处理请求的软件信息及其版本。它和 User-Agent 请求报头域是相对应的，前者发送服务器端软件的信息，后者发送客户端软件(浏览器)和操作系统的信息。    
**Vary**：指示不可缓存的请求头列表;    
**Connection**：连接方式，这个跟rquest的类似。  
**空行**：最后一个响应头部之后是一个空行，发送回车符和换行符，通知服务器以下不再有响应头部。  
**响应包体**：服务器返回给客户端的文本信息;

### 2.2 HTTP特性
HTTP的主要特点主要能概括如下：
#### 2.2.1 无状态性
即，当客户端访问完一次服务器再次访问的时候，服务器是无法知道这个客户端之前是否已经访问过了。优点是不需要先前的信息，能够更快的应答，缺点是每次连接传送的数据量增大。这种做法不利于信息的交互，随后，Cookie和Session就应运而生，至于它俩有什么区别，可以看看[COOKIE和SESSION有什么区别？
](https://www.zhihu.com/question/19786827)。

#### 2.2.2 持久连接
HTTP1.1 使用持久连接keepalive，所谓持久连接，就是服务器在发送响应后仍然在一段时间内保持这条连接，允许在同一个连接中存在多次数据请求和响应，即在持久连接情况下，服务器在发送完响应后并不关闭TCP连接，客户端可以通过这个连接继续请求其他对象。
#### 2.2.3 其他
支持客户/服务器模式、简单快速（请求方法简单Get和POST）、灵活（数据对象任意）

### 2.3 影响HTTP的因素
影响HTTP请求的因素：
1. 带宽
   好像只要上网这个因素是一直都有的。。。即使再快的网络，也会有偶尔网络慢的时候。。。
2. 延迟
   （1） 浏览器阻塞  
   一个浏览器对于同一个域名，**同时**只能有4个链接（根据不同浏览器），如果超了后面的会被阻塞。  
   常用浏览器阻塞数量看下图。

![](https://github-images.wenzhihuai.com/images/20171226081508.png)

（2） DNS查询
浏览器建立连接是需要知道服务器的IP的，DNS用来将域名解析为IP地址，这个可以通过刷新DNS缓存来加快速度。
（3） 建立连接
由之前第一章的就可以看出，HTTP是基于TCP协议的，即使网络、浏览器再快也要进行TCP的三次握手，在高延迟的场景下影响比较明显，慢启动则对文件请求影响较大。


#### 2.4 缺陷
1. 耗时：传输数据每次都要建立连接；
2. 不安全：HTTP是明文传输的，只要在路由器或者交换机上截取，所有东西（账号密码）都是可见的；
3. Header内容过大：通常，客户端的请求header变化较小，但是每次都要携带大量的header信息，导致传输成本增大；
4. keepalive压力过大：持久连接虽然有一点的优点，但同时也会给服务器造成大量的性能压力，特别是传输图片的时候。

BTW：明文传输有多危险，可以去试试，下面是某个政府网站，采用wireshark抓包，身份证、电话号码、住址什么的全暴露出来，所以，，，只要在路由器做点小动作，你的信息是全部能拿得到的，毕竟政府。

![](https://github-images.wenzhihuai.com/images/20171224044825.png)

由于涉及的隐私太多，打了马赛克

## 三、HTTPS
由于HTTP报文的不安全性，网景在1994年就创建了HTTPS，并用在浏览器中。最初HTTPS是和SSL一起使用，然后演化为TLS。SSL／TLS在OSI模型中都是表示层的协议。SSL使 用40 位关键字作为RC4流加密算法，这对于商业信息的加密是合适的。
### 3.1 SSL/TLS
SSL(Secure Sockets Layer)，简称安全套接入层，最初由上世纪90年代由网景公司设计。开启 SSL 会增加内存、CPU、网络带宽的开销，后二者跟你使用的 cipher suite 密切相关，其中参数很多，很难一概而论。开启 SSL 的前提是你的 cert 和 key 必须放在 TCP endpoint，你是否信得过那台设备。
TLS(Transport Layer Security)，简称安全传输层协议，该协议由两层组成： TLS 记录协议（TLS Record）和 TLS 握手协议（TLS Handshake）。较低的层为 TLS 记录协议，位于某个可靠的传输协议（例如 TCP）上面，与具体的应用无关，所以，一般把TLS协议归为传输层安全协议。
由于本人在加密算法上面知识匮乏，就不误人子弟了，有兴趣可以看看百度百科里的资料，[SSL]([SSL]（https://baike.baidu.com/item/ssl/320778?fr=aladdin),[TLS](https://baike.baidu.com/item/TLS)

### 3.2 SPDY
2012年google提出了SPDY的方案，大家才开始从正面看待和解决老版本HTTP协议本身的问题，SPDY可以说是综合了HTTPS和HTTP两者有点于一体的传输协议，主要解决：
**降低延迟**，针对HTTP高延迟的问题，SPDY优雅的采取了多路复用（multiplexing）。多路复用通过多个请求stream共享一个tcp连接的方式，解决了HOL blocking的问题，降低了延迟同时提高了带宽的利用率。
**请求优先级（request prioritization）**。多路复用带来一个新的问题是，在连接共享的基础之上有可能会导致关键请求被阻塞。SPDY允许给每个request设置优先级，这样重要的请求就会优先得到响应。比如浏览器加载首页，首页的html内容应该优先展示，之后才是各种静态资源文件，脚本文件等加载，这样可以保证用户能第一时间看到网页内容。
**header压缩**。前面提到HTTP1.x的header很多时候都是重复多余的。选择合适的压缩算法可以减小包的大小和数量。
基于HTTPS的加密协议传输，大大提高了传输数据的可靠性。
**服务端推送（server push）**，采用了SPDY的网页，例如我的网页有一个sytle.css的请求，在客户端收到sytle.css数据的同时，服务端会将sytle.js的文件推送给客户端，当客户端再次尝试获取sytle.js时就可以直接从缓存中获取到，不用再发请求了。SPDY构成图。

![](https://github-images.wenzhihuai.com/images/20171226042016.png)


### 3.3 HTTPS报文分析

跟之前的报文分析一样，我们使用wireshark来抓包分析，以在百度上搜索点东西为例。

![](https://github-images.wenzhihuai.com/images/20171226044521.png)

192.168.1.103为本地电脑的ip地址，14.215.177.39为百度服务器地址。下面是步骤：
1. 客户端通过发送 Client Hello 报文开始 SSL 通信。报文中包含客户端支持的 SSL 的指定版本、加密组件（Cipher Suite）列表（所使用的加密算法及密钥长度等）。
2. 服务器可进行 SSL 通信时，会以 Server Hello 报文作为应答。和客户端一样，在报文中包含 SSL 版本以及加密组件。服务器的加密组件内容是从接收到的客户端加密组件内筛选出来的。之后服务器发送 Certificate 报文。报文中包含公开密钥证书。最后服务器发送 Server Hello Done 报文通知客户端，最初阶段的SSL握手协商部分结束。
3. SSL 第一次握手结束之后，客户端以 Client Key Exchange 报文作为回应。接着客户端继续发送 Change Cipher Spec 报文。该报文会提示服务器，在此报文之后的通信会采用 Pre-master secret 密钥加密。客户端发送 Finished 报文。该报文包含连接至今全部报文的整体校验值。
4. 服务器同样发送 Change Cipher Spec 报文。 服务器同样发送 Finished 报文。
5. 服务器和客户端的 Finished 报文交换完毕之后，SSL 连接就算建立完成。当然，通信会受到 SSL 的保护。从此处开始进行应用层协议的通信，即发送 HTTP请求。 应用层协议通信，即发送 HTTP 响应。  
   **当然，用一张图更容易解释**  
   简单地说就是下面。

![](https://github-images.wenzhihuai.com/images/20171226044137.png)

当我们追踪流的数据的时候，可以看到，基本上都是乱码，经过加密，数据是看不到，如果需要在wireshark上看到，则需要在wireshark中配置ssl。

![](https://github-images.wenzhihuai.com/images/20171226045845.png)

### 3.4 HTTPS全站化
现今，感觉只要和商业利益有关的，就不得不涉及到加密这类东西。淘宝、京东、唯品会这些电商可谓是最早推行全站https的，这类电商是离用户金钱最近的企业。截止今年底，基本所有商业网站也基本实现了HTTPS。。。。至于小站点，比如个人网站，玩玩还是可以的。如果一个网站需要由HTTP全部变为HTTPS，那么需要关注下面几点：
1. CA证书，大部分证书都是需要收费的，当然，自己在服务器上用openssl也可以，不过浏览器会提示当前私密连接不安全这个警告，普通人看到这种信息是不会继续浏览的，所以，想使用HTTPS，可以使用[Let's Encrypt](https://letsencrypt.org/)，由谷歌等公司推行。
2. HTTPS性能优化，SSL握手，HTTPS 对速度会有一定程度的降低，但是只要经过合理优化和部署，HTTPS 对速度的影响完全可以接受。
3. CPU计算压力，HTTPS中大量的秘钥算法计算，对CPU的压力可想而知。
   至于我自己的[个人网站](http://www.wenzhihuai.com)，之前实现了https，用的免费证书，但是由于HTTPS下的网站，所有子链都要使用HTTPS，使用了七牛云的CDN，如果要使用HTTPS加速，是要收费的，所以只能放弃。。。




## 四、HTTP2.0
HTTP2.0，相较于HTTP1.x，大幅度的提升了web性能。在与HTTP/1.1完全语义兼容的基础上，进一步减少了网络延迟和传输的安全性。HTTP2.0可以说是SPDY的升级版（基于SPDY设计的），但是依然存在一些不同点：HTTP2.0支持明文传输，而SPDY强制使用HTTPS；HTTP2.0消息头的压缩算法采用HPACK，而非SPDY采用的DEFLATE。

### 4.1 历史
HTTP 2.0在2013年8月进行首次合作共事性测试。在开放互联网上HTTP 2.0将只用于https://网址，而 http://网址将继续使用HTTP/1，目的是在开放互联网上增加使用加密技术，以提供强有力的保护去遏制主动攻击。HTTP 2.0是在SPDY（An experimental protocol for a faster web, The Chromium Projects）基础上形成的下一代互联网通信协议。HTTP/2 的目的是通过支持请求与响应的多路复用来较少延迟，通过压缩HTTPS首部字段将协议开销降低，同时增加请求优先级和服务器端推送的支持。
### 4.2 HTTP2.0新特性
相较于HTTP1.1，HTTP2.0的主要优点有采用二进制帧封装，传输变成多路复用，流量控制算法优化，服务器端推送，首部压缩，优先级等特点。
#### 4.2.1 二进制帧
HTTP1.x的解析是基于文本的，基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多。而HTTP/2会将所有传输的信息分割为更小的消息和帧，然后采用二进制的格式进行编码，HTTP1.x的头部信息会被封装到HEADER frame，而相应的Request Body则封装到DATA frame里面。不改动HTTP的语义，使用二进制编码，实现方便且健壮。

![](https://github-images.wenzhihuai.com/images/20171226103043.png)


#### 4.2.2 多路复用
所有的请求都是通过一个 TCP 连接并发完成。HTTP/1.x 虽然通过 pipeline 也能并发请求，但是多个请求之间的响应会被阻塞的，所以 pipeline 至今也没有被普及应用，而 HTTP/2 做到了真正的并发请求。同时，流还支持优先级和流量控制。当流并发时，就会涉及到流的优先级和依赖。即：HTTP2.0对于同一域名下所有请求都是基于流的，不管对于同一域名访问多少文件，也只建立一路连接。优先级高的流会被优先发送。图片请求的优先级要低于 CSS 和 SCRIPT，这个设计可以确保重要的东西可以被优先加载完。


#### 4.2.3 流量控制
TCP协议通过sliding window的算法来做流量控制。发送方有个sending window，接收方有receive window。http2.0的flow control是类似receive window的做法，数据的接收方通过告知对方自己的flow window大小表明自己还能接收多少数据。只有Data类型的frame才有flow control的功能。对于flow control，如果接收方在flow window为零的情况下依然更多的frame，则会返回block类型的frame，这张场景一般表明http2.0的部署出了问题。

#### 4.2.4 服务器端推送
服务器端的推送，就是服务器可以对一个客户端请求发送多个响应。除了对最初请求的响应外，服务器还可以额外向客户端推送资源，而无需客户端明确地请求。当浏览器请求一个html，服务器其实大概知道你是接下来要请求资源了，而不需要等待浏览器得到html后解析页面再发送资源请求。

![](https://github-images.wenzhihuai.com/images/20171226105514.png)


#### 4.2.5 首部压缩
HTTP 2.0 在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键-值对，对于相同的数据，不再通过每次请求和响应发送;通信期间几乎不会改变的通用键-值对(用户代理、可接受的媒体类型,等等)只 需发送一次。事实上,如果请求中不包含首部(例如对同一资源的轮询请求),那么 首部开销就是零字节。此时所有首部都自动使用之前请求发送的首部。
如果首部发生变化了，那么只需要发送变化了数据在Headers帧里面，新增或修改的首部帧会被追加到“首部表”。首部表在 HTTP 2.0 的连接存续期内始终存在,由客户端和服务器共同渐进地更新 。本质上，当然是为了减少请求啦，通过多个js或css合并成一个文件，多张小图片拼合成Sprite图，可以让多个HTTP请求减少为一个，减少额外的协议开销，而提升性能。当然，一个HTTP的请求的body太大也是不合理的，有个度。文件的合并也会牺牲模块化和缓存粒度，可以把“稳定”的代码or 小图 合并为一个文件or一张Sprite，让其充分地缓存起来，从而区分开迭代快的文件。

### 4.3 HTTP1.1与HTTP2.0的对比
以访问https://http2.akamai.com/demo为例。

![](https://github-images.wenzhihuai.com/images/20171226051221.png)

### 4.4 报文
访问[https://http2.akamai.com/demo](https://http2.akamai.com/demo)，谷歌浏览器的报文没有显示出协议，此处使用火狐浏览器。
响应头部分如下。

![](https://github-images.wenzhihuai.com/images/20171226071845.png)

请求头如下。

![](https://github-images.wenzhihuai.com/images/20171226075106.png)

采用淘宝网站为例，淘宝目前采用主站使用HTTP1.1，资源使用HTTP2.0，少些使用SPDY协议。目前也是业界比较流行的做法。

![](https://github-images.wenzhihuai.com/images/20171226065216.png)


## 参考
1. [HTTPS那些事](https://www.guokr.com/post/114121)
2. [如何搭建一个HTTP2.0的网站](https://zhuanlan.zhihu.com/p/25935872)
3. [HTTP/2.0 相比1.0有哪些重大改进？](https://www.zhihu.com/question/34074946)
4. [HTTP2.0 demo](https://http2.akamai.com/demo)
5. [Http、Https、Http2前身](https://www.cnblogs.com/wujiaolong/p/5172e1f7e9924644172b64cb2c41fc58.html)
6. [HTTP报文](http://network.51cto.com/art/201501/464513.htm)
7. [HTTP、HTTP2.0、SPDY、HTTPS 你应该知道的一些事](https://www.cnblogs.com/wujiaolong/p/5172e1f7e9924644172b64cb2c41fc58.html)
8. [HTTPS权威指南](http://www.ituring.com.cn/book/tupubarticle/11134)
9. [HTTP2.0的奇妙日常](http://www.alloyteam.com/2015/03/http2-0-di-qi-miao-ri-chang/)
10. [curl 支持 HTTP2](https://segmentfault.com/a/1190000004553963)
11. [淘宝HTTPS探索](http://velocity.oreilly.com.cn/2015/ppts/lizhenyu.pdf)
12. [HTTPS完全协议详解](http://blog.csdn.net/ituling/article/details/52541585)

欢迎访问我的个人网站。[https://wenzhihuai.com](https://wenzhihuai.com)