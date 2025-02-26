import{_ as e,c as r,d as n,o as i}from"./app-DChB4uJf.js";const t={};function o(s,a){return i(),r("div",null,a[0]||(a[0]=[n(`<h2 id="一、了解jvm" tabindex="-1"><a class="header-anchor" href="#一、了解jvm"><span>一、了解JVM</span></a></h2><h4 id="_1、什么是jvm" tabindex="-1"><a class="header-anchor" href="#_1、什么是jvm"><span>1、什么是JVM</span></a></h4><p>JVM是Java Virtual Machine（Java虚拟机）的缩写，是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟计算机功能来实现的，JVM屏蔽了与具体操作系统平台相关的信息，Java程序只需生成在Java虚拟机上运行的字节码，就可以在多种平台上不加修改的运行。JVM在执行字节码时，实际上最终还是把字节码解释成具体平台上的机器指令执行。</p><figure><img src="https://github-images.wenzhihuai.com/images/31584f04c69f4fdaa922c5bd1517cc97.png" alt="微信图片_20220522232432.png" tabindex="0" loading="lazy"><figcaption>微信图片_20220522232432.png</figcaption></figure><h4 id="_2、jre-jdk-jvm是什么关系" tabindex="-1"><a class="header-anchor" href="#_2、jre-jdk-jvm是什么关系"><span>2、JRE/JDK/JVM是什么关系</span></a></h4><p>JRE（Java Runtime Environment）：是Java运行环境，所有的Java程序都要在JRE下才能运行。<br> JDK（Java Development Kit）：是Java开发工具包，它是程序开发者用来编译、调试Java程序，它也是Java程序，也需要JRE才能运行。<br> JVM（Java Virual Machine）：是Java虚拟机，它是JRE的一部分，一个虚构出来的计算机，它支持跨平台。</p><h4 id="_3、jvm体系结构" tabindex="-1"><a class="header-anchor" href="#_3、jvm体系结构"><span>3、JVM体系结构：</span></a></h4><p>类加载器：加载class文件；<br> 运行时数据区：包括方法区、堆、Java栈、程序计数器、本地方法栈<br> 执行引擎：执行字节码或者执行本地方法</p><figure><img src="https://github-images.wenzhihuai.com/images/1a14ee042cfa45999fa30c5f14f930e0.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><h2 id="二、运行时数据区" tabindex="-1"><a class="header-anchor" href="#二、运行时数据区"><span>二、运行时数据区</span></a></h2><p><strong>方法区</strong>：属于共享内存区域，存储已被虚拟机加载的类信息、常量、静态变量、即时编译器编译后的代码等数据。从 JDK 8 开始，HotSpot 虚拟机移除了方法区，取而代之的是元空间（Metaspace）。元空间并不在 Java 虚拟机内存中，而是使用了本地（即操作系统）的内存。这个改变主要是为了解决方法区可能出现的内存溢出问题。<br><strong>堆</strong>：Java虚拟机所管理的内存中最大的一块，唯一的目的是存放对象实例。由于是垃圾收集器管理的主要区域，因此有时候也被称作GC堆。<br><strong>栈</strong>：用于描述Java方法执行的模型。每个方法在执行的同时都会创建一个栈帧，用于存储局部变量表、操作数栈、动态链接、方法出口等信息。每一个方法从调用至执行完成，对应于一个栈帧在虚拟机栈中从入栈到出栈。<br><strong>程序计数器</strong>：当前线程所执行字节码的行号指示器。每一个线程都有一个独立的程序计数器，线程的阻塞、恢复、挂起等一系列操作都需要程序计数器的参与，因此必须是线程私有的。<br><strong>本地方法栈</strong>：与虚拟机栈作用相似，只不过虚拟机栈为执行Java方法服务，而本地方法栈为执行Native方法服务，比如在Java中调用C/C++。</p><p><strong>元空间</strong>：</p><h2 id="三、类加载机制" tabindex="-1"><a class="header-anchor" href="#三、类加载机制"><span>三、类加载机制</span></a></h2><p>类加载器通过一个类的全限定名来获取描述此类的二进制文件流的代码模块。</p><h3 id="_1、类的生命周期-7个" tabindex="-1"><a class="header-anchor" href="#_1、类的生命周期-7个"><span>1、类的生命周期(7个)</span></a></h3><p>加载、验证、准备、解析、初始化、使用、卸载</p><h3 id="_2、类加载的五个过程" tabindex="-1"><a class="header-anchor" href="#_2、类加载的五个过程"><span>2、类加载的五个过程</span></a></h3><p>虚拟机把描述类的数据从 Class 文件加载到内存，并对数据进行校验、装换解析和初始化，最终形成可以被虚拟机直接使用的 Java 类型。</p><p>加载：类加载器获取二进制字节流，将静态存储结构转化为方法区的运行时数据结构，并生成此类的Class对象。<br> 验证：验证文件格式、元数据、字节码、符号引用，确保Class的字节流中包含的信息符合当前虚拟机的要求。<br> 准备：为类变量分配内存并设置其初始值，这些变量使用的内存都将在方法区中进行分配。<br> 解析：将常量池内的符号引用替换为直接引用，包括类或接口的解析、字段解析、类方法解析、接口方法解析。<br> 初始化：前面过程都是以虚拟机主导，而初始化阶段开始执行类中的 Java 代码。</p><h3 id="_3、类加载器" tabindex="-1"><a class="header-anchor" href="#_3、类加载器"><span>3、类加载器</span></a></h3><p>启动类加载器(BootStrap ClassLoader)：主要负责加载jre/lib/rt.jar相关的字节码文件的。<br> 扩展类加载器(Extension Class Loader)：主要负载加载 jre/lib/ext/*.jar 这些jar包的。<br> 应用程序类加载器(Application Class Loader)：主要负责加载用户自定义的类以及classpath环境变量所配置的jar包的。<br> 自定义类加载器(User Class Loader)：负责加载程序员指定的特殊目录下的字节码文件的。大多数情况下，自定义类加载器只需要继承ClassLoader这个抽象类，重写findClass()和loadClass()两个方法即可。</p><h3 id="_4、类加载机制-双亲委派" tabindex="-1"><a class="header-anchor" href="#_4、类加载机制-双亲委派"><span>4、类加载机制（双亲委派）</span></a></h3><p>类的加载是通过双亲委派模型来完成的，双亲委派模型即为下图所示的类加载器之间的层次关系。</p><figure><img src="https://github-images.wenzhihuai.com/images/3fa489e7f78042da8d9aa8a4bd1fd2a4.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>工作过程：如果一个类加载器接收到类加载的请求，它会先把这个请求委派给父加载器去完成，只有当父加载器反馈自己无法完成加载请求时，子加载器才会尝试自己去加载。可以得知，所有的加载请求最终都会传送到启动类加载器中。</p><h2 id="四、垃圾回收" tabindex="-1"><a class="header-anchor" href="#四、垃圾回收"><span>四、垃圾回收</span></a></h2><p>程序计数器、虚拟机栈、本地方法栈是线程私有的，所以会随着线程结束而消亡。 Java 堆和方法区是线程共享的，在程序处于运行期才知道哪些对象会创建，这部分内存的分配和回收都是动态的，垃圾回收所关注的就是这部分内存。</p><h3 id="_1、判断对象已死" tabindex="-1"><a class="header-anchor" href="#_1、判断对象已死"><span>1、判断对象已死</span></a></h3><p>在进行内存回收之前要做的事情就是判断那些对象是‘死’的，哪些是‘活’的。</p><p><strong>引用计数法</strong>：给对象中添加一个引用计数器，当一个地方引用了对象，计数加1；当引用失效，计数器减1；当计数器为0表示该对象已死、可回收；</p><figure><img src="https://github-images.wenzhihuai.com/images/c30fea6ea6e048289ea3e754919cb2a8.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><pre><code>    注意：如果不下小心直接把 Obj1-reference 和 Obj2-reference 置 null。则在 Java 堆当中的            两块内存依然保持着互相引用无法回收。引用计数法很难解决循环引用问题； 
</code></pre><p><strong>可达性分析</strong>：通过一系列的 ‘GC Roots’ 的对象作为起始点，从这些节点出发所走过的路径称为引用链。当一个对象到 GC Roots 没有任何引用链相连的时候说明对象不可用。</p><figure><img src="https://github-images.wenzhihuai.com/images/cb3d4fadc552626ae0aaabc46d59b357.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><pre><code>    可作为 GC Roots 的对象：
    1）虚拟机栈中引用的对象
    2）方法区中类静态属性引用的对象
    3）方法区中常量引用的对象
    4）本地方法栈中native方法引用的对象 
</code></pre><p><strong>引用</strong>：下面四种引用强度依次减弱<br><strong>强引用</strong>：默认情况下，对象采用的均为强引用；<br><strong>软引用</strong>：SoftReference 类实现软引用。在系统要发生内存溢出异常之前，将会把这些对象列进回收范围之中进行二次回收。<br><strong>弱引用</strong>：WeakReference 类实现弱引用。对象只能生存到下一次垃圾收集之前。在垃圾收集器工作时，无论内存是否足够都会回收掉只被弱引用关联的对象。<br><strong>虚引用</strong>：PhantomReference 类实现虚引用。无法通过虚引用获取一个对象的实例，为一个对象设置虚引用关联的唯一目的就是能在这个对象被收集器回收时收到一个系统通知。</p><h3 id="_2、垃圾收集算法" tabindex="-1"><a class="header-anchor" href="#_2、垃圾收集算法"><span>2、垃圾收集算法</span></a></h3><p><strong>标记清除算法</strong>：先标记出所有需要回收的对象，标记完成后统一回收所有被标记的对象。<br><strong>复制算法</strong>：将可用内存分为大小相等的两块，每次只使用其中一块，当这一块内存用完了，就将存活的对象复制到另一块，最后将此块内存一次性清理掉。<br><strong>标记整理算法</strong>：先标记所有需要回收的对象，然后让所有存活的对象向一端移动，最后直接清理掉边界以外的另一端内存。<br><strong>分代收集算法</strong>：把Java堆分为新生代和老年代。新生代中只有少量对象会存活，就选用复制算法；老年代中对象存活率较高，选用标记清除算法。</p><h3 id="_3、垃圾收集器" tabindex="-1"><a class="header-anchor" href="#_3、垃圾收集器"><span>3、垃圾收集器</span></a></h3><p><strong>Serial收集器</strong>：单线程收集器。收集垃圾时必须暂停其他所有工作线程，直到它收集结束。<br><strong>Parnew收集器</strong>：Serial收集器多线程版本。<br><strong>Parallel Scavenge收集器</strong>：使用复制算法的新生代收集器。<br><strong>Serial Old收集器</strong>：使用标记-整理算法的老年代单线程收集器。<br><strong>Parallel Old收集器</strong>：使用标记-整理算法的老年代多线程收集器。<br><strong>CMS收集器</strong>：基于标记-清除算法的低停顿并发收集器。运作步骤为①初始标记②并发标记③重新标记④并发清除。<br><strong>G1收集器</strong>：最前沿的面向服务端应用的垃圾收集器。运作步骤为①初始标记②并发标记③最终标记④筛选回收。<br> G1收集器有以下特点<br> 1）并行与并发：无需停顿Java线程来执行GC动作。<br> 2）分代收集：可独立管理整个GC堆。<br> 3）空间整合：运行期间不会产生内存空间碎片。<br> 4）可预测的停顿：除了低停顿，还能建立可预测的停顿时间模型。</p><h3 id="_4、jvm内存分代机制" tabindex="-1"><a class="header-anchor" href="#_4、jvm内存分代机制"><span>4、JVM内存分代机制</span></a></h3><p>方法区即被称为永久代，而堆中存放的是对象实例，为了回收的时候对不同的对象采用不同的方法，又将堆分为新生代和老年代，默认情况下新生代占堆的1/3，老年代占堆的2/3。</p><p><strong>新生代（Young）</strong>：HotSpot将新生代划分为三块，一块较大的Eden空间和两块较小的Survivor空间，默认比例为8：1：1。<br><strong>老年代（Old）</strong>：在新生代中经历了多次GC后仍然存活下来的对象会进入老年代中。老年代中的对象生命周期较长，存活率比较高，在老年代中进行GC的频率相对而言较低，而且回收的速度也比较慢。<br><strong>永久代（Permanent）</strong>：永久代存储类信息、常量、静态变量、即时编译器编译后的代码等数据，对这一区域而言，一般而言不会进行垃圾回收。<br><strong>元空间（metaspace）</strong>：从JDK 8开始，Java开始使用元空间取代永久代，元空间并不在虚拟机中，而是直接使用本地内存。那么，默认情况下，元空间的大小仅受本地内存限制。当然，也可以对元空间的大小手动的配置。<br> GC 过程：新生成的对象在Eden区分配（大对象除外，大对象直接进入老年代），当Eden区 没有足够的空间进行分配时，虚拟机将发起一次Minor GC。GC开始时，对象只会存在于 Eden区和Survivor From区，Survivor To区是空的（作为保留区域）。GC进行时，Eden区中 所有存活的对象都会被复制到Survivor To区，而在Survivor From区中，仍存活的对象会根据 它们的年龄值决定去向，年龄值达到年龄阀值（默认为15，新生代中的对象每熬过一轮垃圾 回收，年龄值就加1，GC分代年龄存储在对象的Header中）的对象会被移到老年代中，没有 达到阀值的对象会被复制到Survivor To区。接着清空Eden区和Survivor From区，新生代中存 活的对象都在Survivor To区。接着，Survivor From区和Survivor To区会交换它们的角色，也 就是新的Survivor To区就是上次GC清空的Survivor From区，新的Survivor From区就是上次 GC的Survivor To区，总之，不管怎样都会保证Survivor To区在一轮GC后是空的。GC时当 Survivor To区没有足够的空间存放上一次新生代收集下来的存活对象时，需要依赖老年代进 行分配担保，将这些对象存放在老年代中。</p><h3 id="_5、minor-gc、major-gc、full-gc之间的区别" tabindex="-1"><a class="header-anchor" href="#_5、minor-gc、major-gc、full-gc之间的区别"><span>5、Minor GC、Major GC、Full GC之间的区别</span></a></h3><p><strong>Minor GC</strong>：Minor GC指新生代GC，即发生在新生代（包括Eden区和Survivor区）的垃圾回收操作，当新生代无法为新生对象分配内存空间的时候，会触发Minor GC。因为新生代中大多数对象的生命周期都很短，所以发生Minor GC的频率很高，虽然它会触发stop-the-world，但是它的回收速度很快。<br><strong>Major GC</strong>：指发生在老年代的垃圾收集动作，出现了 Major GC，经常会伴随至少一次 Minor GC（非绝对），MajorGC 的速度一般会比 Minor GC 慢10倍以上。<br><strong>Full GC</strong>：Full GC是针对整个新生代、老生代、元空间（metaspace，java8以上版本取代perm gen）的全局范围的GC。Full GC不等于Major GC，也不等于Minor GC+Major GC，发生Full GC需要看使用了什么垃圾收集器组合，才能解释是什么样的垃圾回收。</p><h3 id="_6、minor-gc、major-gc、full-gc触发条件" tabindex="-1"><a class="header-anchor" href="#_6、minor-gc、major-gc、full-gc触发条件"><span>6、Minor GC、Major GC、Full GC触发条件</span></a></h3><p><strong>Minor GC触发条件</strong>：<br> 虚拟机在进行minorGC之前会判断老年代最大的可用连续空间是否大于新生代的所有对象总 空间<br> 1）如果大于的话，直接执行minorGC<br> 2）如果小于，判断是否开启HandlerPromotionFailure，没有开启直接FullGC<br> 3）如果开启了HanlerPromotionFailure, JVM会判断老年代的最大连续内存空间是否大于历 次晋升（晋级老年代对象的平均大小）平均值的大小，如果小于直接执行FullGC<br> 4）如果大于的话，执行minorGC</p><p><strong>Full GC触发条件</strong>：<br> 1）老年代空间不足：如果创建一个大对象，Eden区域当中放不下这个大对象，会直接保存 在老年代当中，如果老年代空间也不足，就会触发Full GC。为了避免这种情况，最好就是 不要创建太大的对象。<br> 2）方法区空间不足：系统当中需要加载的类，调用的方法很多，同时方法区当中没有足够的 空间，就出触发一次Full GC<br> 3）老年代最大可用连续空间小于Minor GC历次晋升到老年代对象的平均大小<br> 4）调用System.gc()时（系统建议执行Full GC，但是不必然执行）</p>`,48)]))}const g=e(t,[["render",o],["__file","jvm(java虚拟机).html.vue"]]),c=JSON.parse('{"path":"/java/JVM/jvm(java%E8%99%9A%E6%8B%9F%E6%9C%BA).html","title":"JVM(java虚拟机)","lang":"zh-CN","frontmatter":{"title":"JVM(java虚拟机)","icon":"pen","dir":{"collapsible":true,"order":100},"index":false,"description":"一、了解JVM 1、什么是JVM JVM是Java Virtual Machine（Java虚拟机）的缩写，是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟计算机功能来实现的，JVM屏蔽了与具体操作系统平台相关的信息，Java程序只需生成在Java虚拟机上运行的字节码，就可以在多种平台上不加修改的运行。JVM在执行字节码时，实际上最终还是把字节码...","head":[["meta",{"property":"og:url","content":"http://www.wenzhihuai.com/java/JVM/jvm(java%E8%99%9A%E6%8B%9F%E6%9C%BA).html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"JVM(java虚拟机)"}],["meta",{"property":"og:description","content":"一、了解JVM 1、什么是JVM JVM是Java Virtual Machine（Java虚拟机）的缩写，是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟计算机功能来实现的，JVM屏蔽了与具体操作系统平台相关的信息，Java程序只需生成在Java虚拟机上运行的字节码，就可以在多种平台上不加修改的运行。JVM在执行字节码时，实际上最终还是把字节码..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://github-images.wenzhihuai.com/images/31584f04c69f4fdaa922c5bd1517cc97.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-10T14:39:30.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-10T14:39:30.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"JVM(java虚拟机)\\",\\"image\\":[\\"https://github-images.wenzhihuai.com/images/31584f04c69f4fdaa922c5bd1517cc97.png\\",\\"https://github-images.wenzhihuai.com/images/1a14ee042cfa45999fa30c5f14f930e0.png\\",\\"https://github-images.wenzhihuai.com/images/3fa489e7f78042da8d9aa8a4bd1fd2a4.png\\",\\"https://github-images.wenzhihuai.com/images/c30fea6ea6e048289ea3e754919cb2a8.png\\",\\"https://github-images.wenzhihuai.com/images/cb3d4fadc552626ae0aaabc46d59b357.png\\"],\\"dateModified\\":\\"2024-03-10T14:39:30.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Zephery\\",\\"url\\":\\"https://wenzhihuai.com/article/\\"}]}"]]},"headers":[{"level":2,"title":"一、了解JVM","slug":"一、了解jvm","link":"#一、了解jvm","children":[]},{"level":2,"title":"二、运行时数据区","slug":"二、运行时数据区","link":"#二、运行时数据区","children":[]},{"level":2,"title":"三、类加载机制","slug":"三、类加载机制","link":"#三、类加载机制","children":[{"level":3,"title":"1、类的生命周期(7个)","slug":"_1、类的生命周期-7个","link":"#_1、类的生命周期-7个","children":[]},{"level":3,"title":"2、类加载的五个过程","slug":"_2、类加载的五个过程","link":"#_2、类加载的五个过程","children":[]},{"level":3,"title":"3、类加载器","slug":"_3、类加载器","link":"#_3、类加载器","children":[]},{"level":3,"title":"4、类加载机制（双亲委派）","slug":"_4、类加载机制-双亲委派","link":"#_4、类加载机制-双亲委派","children":[]}]},{"level":2,"title":"四、垃圾回收","slug":"四、垃圾回收","link":"#四、垃圾回收","children":[{"level":3,"title":"1、判断对象已死","slug":"_1、判断对象已死","link":"#_1、判断对象已死","children":[]},{"level":3,"title":"2、垃圾收集算法","slug":"_2、垃圾收集算法","link":"#_2、垃圾收集算法","children":[]},{"level":3,"title":"3、垃圾收集器","slug":"_3、垃圾收集器","link":"#_3、垃圾收集器","children":[]},{"level":3,"title":"4、JVM内存分代机制","slug":"_4、jvm内存分代机制","link":"#_4、jvm内存分代机制","children":[]},{"level":3,"title":"5、Minor GC、Major GC、Full GC之间的区别","slug":"_5、minor-gc、major-gc、full-gc之间的区别","link":"#_5、minor-gc、major-gc、full-gc之间的区别","children":[]},{"level":3,"title":"6、Minor GC、Major GC、Full GC触发条件","slug":"_6、minor-gc、major-gc、full-gc触发条件","link":"#_6、minor-gc、major-gc、full-gc触发条件","children":[]}]}],"git":{"createdTime":1710081570000,"updatedTime":1710081570000,"contributors":[{"name":"zhihuaiwen","email":"zhihuaiwen@tencent.com","commits":1}]},"readingTime":{"minutes":12.39,"words":3717},"filePathRelative":"java/JVM/jvm(java虚拟机).md","localizedDate":"2024年3月10日","excerpt":"<h2>一、了解JVM</h2>\\n<h4>1、什么是JVM</h4>\\n<p>JVM是Java Virtual Machine（Java虚拟机）的缩写，是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟计算机功能来实现的，JVM屏蔽了与具体操作系统平台相关的信息，Java程序只需生成在Java虚拟机上运行的字节码，就可以在多种平台上不加修改的运行。JVM在执行字节码时，实际上最终还是把字节码解释成具体平台上的机器指令执行。</p>","autoDesc":true}');export{g as comp,c as data};
