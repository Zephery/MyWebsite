import{_ as e,c as a,d as o,o as d}from"./app-ftEjETWs.js";const n={};function r(i,t){return d(),a("div",null,t[0]||(t[0]=[o('<h1 id="java-nio" tabindex="-1"><a class="header-anchor" href="#java-nio"><span>JAVA NIO</span></a></h1><h2 id="一、简介" tabindex="-1"><a class="header-anchor" href="#一、简介"><span>一、简介</span></a></h2><p>1）Java BIO ： 同步并阻塞(传统阻塞型)，服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销。</p><p>2）Java NIO ： 同步非阻塞，服务器实现模式为一个线程处理多个请求(连接)，即客户端发送的连接请求都会注册到多路复用器上，多路复用器轮询到连接有I/O请求就进行处理。</p><p>3）Java AIO：异步非阻塞，在AIO模型中，当我们发起一个I/O操作（如读或写）时，我们不需要等待它完成，我们的代码会立即返回，可以继续执行其他任务。当I/O操作完成时，我们之前注册的回调函数会被自动调用，我们可以在这个回调函数中处理I/O操作的结果。</p><h3 id="_1-1典型的多路复用io实现" tabindex="-1"><a class="header-anchor" href="#_1-1典型的多路复用io实现"><span>1.1典型的多路复用IO实现</span></a></h3><p>目前流程的多路复用IO实现主要包括四种: <code>select</code>、<code>poll</code>、<code>epoll</code>、<code>kqueue</code>。下表是他们的一些重要特性的比较:</p><table><thead><tr><th>IO模型</th><th>相对性能</th><th>数据结构</th><th>关键思路</th><th>操作系统</th><th>JAVA支持情况</th></tr></thead><tbody><tr><td>select</td><td>较高</td><td>位图</td><td>Reactor</td><td>windows/Linux</td><td>支持,Reactor模式(反应器设计模式)。Linux操作系统的 kernels 2.4内核版本之前，默认使用select；而目前windows下对同步IO的支持，都是select模型</td></tr><tr><td>poll</td><td>较高</td><td>数组或者链表</td><td>Reactor</td><td>Linux</td><td>Linux下的JAVA NIO框架，Linux kernels 2.6内核版本之前使用poll进行支持。也是使用的Reactor模式</td></tr><tr><td>epoll</td><td>高</td><td>红黑树</td><td>Reactor/Proactor</td><td>Linux</td><td>Linux kernels 2.6内核版本及以后使用epoll进行支持；Linux kernels 2.6内核版本之前使用poll进行支持；另外一定注意，由于Linux下没有Windows下的IOCP技术提供真正的 异步IO 支持，所以Linux下使用epoll模拟异步IO</td></tr><tr><td>kqueue</td><td>高</td><td></td><td>Proactor</td><td>Linux</td><td>目前JAVA的版本不支持</td></tr></tbody></table><p>多路复用IO技术最适用的是“高并发”场景，所谓高并发是指1毫秒内至少同时有上千个连接请求准备好。其他情况下多路复用IO技术发挥不出</p><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考"><span>参考</span></a></h2><p>1.<a href="https://www.ydlclass.com/doc21xnv/java/first/javase/15%E3%80%81nio/" target="_blank" rel="noopener noreferrer">元动力</a></p>',11)]))}const c=e(n,[["render",r],["__file","nio.html.vue"]]),p=JSON.parse('{"path":"/java/io/nio.html","title":"JAVA NIO","lang":"zh-CN","frontmatter":{"description":"JAVA NIO 一、简介 1）Java BIO ： 同步并阻塞(传统阻塞型)，服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销。 2）Java NIO ： 同步非阻塞，服务器实现模式为一个线程处理多个请求(连接)，即客户端发送的连接请求都会注册到多路复用器上，多路...","head":[["meta",{"property":"og:url","content":"http://www.wenzhihuai.com/java/io/nio.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"JAVA NIO"}],["meta",{"property":"og:description","content":"JAVA NIO 一、简介 1）Java BIO ： 同步并阻塞(传统阻塞型)，服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销。 2）Java NIO ： 同步非阻塞，服务器实现模式为一个线程处理多个请求(连接)，即客户端发送的连接请求都会注册到多路复用器上，多路..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-10T14:39:30.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-10T14:39:30.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"JAVA NIO\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-03-10T14:39:30.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Zephery\\",\\"url\\":\\"https://wenzhihuai.com/article/\\"}]}"]]},"headers":[{"level":2,"title":"一、简介","slug":"一、简介","link":"#一、简介","children":[{"level":3,"title":"1.1典型的多路复用IO实现","slug":"_1-1典型的多路复用io实现","link":"#_1-1典型的多路复用io实现","children":[]}]},{"level":2,"title":"参考","slug":"参考","link":"#参考","children":[]}],"git":{"createdTime":1710081570000,"updatedTime":1710081570000,"contributors":[{"name":"zhihuaiwen","email":"zhihuaiwen@tencent.com","commits":1}]},"readingTime":{"minutes":1.96,"words":587},"filePathRelative":"java/io/nio.md","localizedDate":"2024年3月10日","excerpt":"\\n<h2>一、简介</h2>\\n<p>1）Java BIO ： 同步并阻塞(传统阻塞型)，服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销。</p>","autoDesc":true}');export{c as comp,p as data};