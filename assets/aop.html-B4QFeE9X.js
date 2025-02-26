import{_ as e,c as s,d as a,o as n}from"./app-DChB4uJf.js";const l={};function t(r,i){return n(),s("div",null,i[0]||(i[0]=[a(`<h1 id="aop" tabindex="-1"><a class="header-anchor" href="#aop"><span>AOP</span></a></h1><h2 id="一、概述" tabindex="-1"><a class="header-anchor" href="#一、概述"><span>一、概述</span></a></h2><p>在通常的开发过程中，我们调用的顺序通常是controller-&gt;service-dao，其中，service中包含着太多的业务逻辑，并且还要不断调用dao来实现自身的业务逻辑，经常会导致业务耗时过久，在aop出现之前，方式一般是在函数中开始写一个startTime，结尾再写一个endTime来查看执行该函数的耗时，过多的使用此类方式会导致代码的耦合性太高，不利于管理，于是，AOP（面向切面）出现了。AOP关注的是横向的，而OOP的是纵向。</p><figure><img src="https://github-images.wenzhihuai.com/images/20180118085015.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Spring自2.0版本开始采用@AspectJ注解非常容易的定义一个切面。@AspectJ注解使用AspectJ切点表达式语法进行切点定义，可以通过切点函数、运算符、通配符等高级功能进行切点定义，拥有强大的连接点描述能力。</p><h3 id="_1-1-特点" tabindex="-1"><a class="header-anchor" href="#_1-1-特点"><span>1.1 特点</span></a></h3><p>AOP（Aspect Oriented Programming）面向切面编程，通过预编译方式和运行期动态代理实现程序功能的横向多模块统一控制的一种技术。AOP是OOP的补充，是Spring框架中的一个重要内容。利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。AOP可以分为静态织入与动态织入，静态织入即在编译前将需织入内容写入目标模块中，这样成本非常高。动态织入则不需要改变目标模块。Spring框架实现了AOP，使用注解配置完成AOP比使用XML配置要更加方便与直观。</p><h3 id="_1-2-aop概述" tabindex="-1"><a class="header-anchor" href="#_1-2-aop概述"><span>1.2 AOP概述</span></a></h3><p><strong>Aspect</strong>:一个模块用来关注多个类的切面。在JAVA EE的应用中，事务是AOP的典型例子。<br><strong>Joinpoint(连接点)</strong>:所谓连接点是指那些被拦截到的点。在spring中,这些点指的是方法,因为spring只支持方法类型的连接点.<br><strong>Pointcut(切入点)</strong>:所谓切入点是指我们要对哪些Joinpoint进行拦截的定义.<br><strong>Advice(通知/增强)</strong>:所谓通知是指拦截到Joinpoint之后所要做的事情就是通知.通知分为前置通知,后置通知,异常通知,最终通知,环绕通知(切面要完成的功能)<br><strong>Introduction(引介)</strong>:引介是一种特殊的通知在不修改类代码的前提下, Introduction可以在运行期为类动态地添加一些方法或Field.<br><strong>Target(目标对象)</strong>:代理的目标对象<br><strong>Weaving(织入)</strong>:是指把增强应用到目标对象来创建新的代理对象的过程.spring采用动态代理织入，而AspectJ采用编译期织入和类装在期织入.<br><strong>Proxy（代理）</strong>:一个类被AOP织入增强后，就产生一个结果代理类Aspect(切面): 是切入点和通知（引介）的结合</p><h2 id="二、spring中的aop" tabindex="-1"><a class="header-anchor" href="#二、spring中的aop"><span>二、Spring中的AOP</span></a></h2><p>Spring实现AOP主要是由IOC容器来负责生成、管理的。其创建的方式有两种：</p><ol><li>默认使用Java动态代理来创建AOP代理；</li><li>当需要代理的类不是代理接口的时候，Spring会切换为使用CGLIB代理，也可强制使用CGLIB。高版本的Spring会自动选择是使用动态代理还是CGLIB生成代理内容，当然我们也可以强制使用CGLIB生成代理，那就是<a href="aop:config" target="_blank" rel="noopener noreferrer">aop:config</a>里面有一个&quot;proxy-target-class&quot;属性，这个属性值如果被设置为true，那么基于类的代理将起作用。</li></ol><h3 id="_2-1-aspectj支持5种类型的通知注解" tabindex="-1"><a class="header-anchor" href="#_2-1-aspectj支持5种类型的通知注解"><span>2.1 AspectJ支持5种类型的通知注解：</span></a></h3><p>[1] Before：前置通知，在方法执行之前执行<br> [2] After：后置通知，在方法执行之后执行<br> [3] AfterRunning：返回通知，在方法返回结果之后执行<br> [4] AfterThrowing：异常通知，在方法抛出异常之后执行<br> [5] Around：环绕通知，围绕着方法执行<br> 其中，环绕通知是最常见的一种通知注解，特别是在缓存的使用中，例如：Spring-Cache中的使用，在service的方法中添加一个cache的注解，通过AOP来拦截，如果缓存中已经存在，则直接返回结果，如果没有，再进行service的访问。</p><h3 id="_2-2-spring提供了4种实现aop的方式" tabindex="-1"><a class="header-anchor" href="#_2-2-spring提供了4种实现aop的方式"><span>2.2 Spring提供了4种实现AOP的方式：</span></a></h3><ol><li>经典的基于代理的AOP</li><li>@AspectJ注解驱动的切面</li><li>纯POJO切面</li><li>注入式AspectJ切面</li></ol><h2 id="三、原理概述" tabindex="-1"><a class="header-anchor" href="#三、原理概述"><span>三、原理概述</span></a></h2><p>Spring AOP的实现原理是基于动态织入的动态代理技术，而AspectJ则是静态织入，而动态代理技术又分为Java JDK动态代理和CGLIB动态代理，前者是基于反射技术的实现，后者是基于继承的机制实现。Spring AOP 在使用时机上也进行自动化调整，当有接口时会自动选择JDK动态代理技术，如果没有则选择CGLIB技术，当然Spring AOP的底层实现并没有这么简单，为更简便生成代理对象，Spring AOP 内部实现了一个专注于生成代理对象的工厂类，这样就避免了大量的手动编码，这点也是十分人性化的，但最核心的还是动态代理技术。从性能上来说，Spring AOP 虽然无需特殊编译器协助，但性能上并不优于AspectJ的静态织入，这点了解一下即可。</p><figure><img src="https://github-images.wenzhihuai.com/images/20180204060518.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>具体的原理请看<a href="http://blog.csdn.net/javazejian/article/details/56267036/" target="_blank" rel="noopener noreferrer">Spring AOP</a></p><h2 id="四、使用" tabindex="-1"><a class="header-anchor" href="#四、使用"><span>四、使用</span></a></h2><p>网上看别人写了很多入门的例子，自己就不再阐述了，毕竟自己还是菜，下面是关于AOP入门的资料：<br><a href="http://www.cnblogs.com/xrq730/p/7003082.html" target="_blank" rel="noopener noreferrer">我们为什么要使用AOP？</a><br><a href="http://blog.csdn.net/u014292162/article/details/52504633" target="_blank" rel="noopener noreferrer">Spring中AOP的实现</a><br><a href="http://blog.csdn.net/javazejian/article/details/56267036/" target="_blank" rel="noopener noreferrer">关于AOP</a></p><p>下面是自己在<a href="http://www.wenzhihuai.com" target="_blank" rel="noopener noreferrer">个人网站</a>中的使用，主要是用来统计一个方法的执行消耗了多少时间，需要引入aopalliance.jar、aspectj.weaver.jar 和 spring-aspects.jar的包。</p><h4 id="_4-1-在spring-mvc中开启aop" tabindex="-1"><a class="header-anchor" href="#_4-1-在spring-mvc中开启aop"><span>4.1 在Spring MVC中开启AOP</span></a></h4><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    &lt;!--自动扫描自定义切面--&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:white;--shiki-dark:#E06C75;">aop:aspectj-autoproxy</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">/&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-2-定义一个切面" tabindex="-1"><a class="header-anchor" href="#_4-2-定义一个切面"><span>4.2 定义一个切面</span></a></h4><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">/**</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> * 可以使用 @Order 注解指定切面的优先级, 值越小优先级越高</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> */</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">@Order(2)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">@Aspect</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">@Component</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">public class TimeInterceptor {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-3-声明一个切入点" tabindex="-1"><a class="header-anchor" href="#_4-3-声明一个切入点"><span>4.3 声明一个切入点</span></a></h4><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    @Pointcut(&quot;execution(* com.myblog.service.impl.BlogServiceImpl.*(..))&quot;)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    public void pointcut() {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-4-声明一个前置切点" tabindex="-1"><a class="header-anchor" href="#_4-4-声明一个前置切点"><span>4.4 声明一个前置切点</span></a></h4><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    @Before(&quot;pointcut()&quot;)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    public void before(JoinPoint jp) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        logger.info(jp.getSignature().getName());</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        logger.info(&quot;----------前置通知----------&quot;);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-5-声明一个后置切点" tabindex="-1"><a class="header-anchor" href="#_4-5-声明一个后置切点"><span>4.5 声明一个后置切点</span></a></h4><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    @After(&quot;pointcut()&quot;)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    public void after(JoinPoint jp) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        logger.info(&quot;----------最终通知----------&quot;);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-6-环绕通知" tabindex="-1"><a class="header-anchor" href="#_4-6-环绕通知"><span>4.6 环绕通知</span></a></h4><p>这里，特别要注意的是要抛出Throwable异常，否则方法执行报错的时候无法处理也无法查看</p><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    @Around(&quot;execution(* (com.myblog.service.impl.*+&amp;&amp;!com.myblog.service.impl.AsyncServiceImpl).*(..))&quot;)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    public Object timeAround(ProceedingJoinPoint joinPoint) throws Throwable {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        Object obj = null;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        Object[] args = joinPoint.getArgs();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        long startTime = System.currentTimeMillis();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        obj = joinPoint.proceed(args);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        // 获取执行的方法名</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        long endTime = System.currentTimeMillis();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        MethodSignature signature = (MethodSignature) joinPoint.getSignature();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        String methodName = signature.getDeclaringTypeName() + &quot;.&quot; + signature.getName();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        // 打印耗时的信息</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        this.printExecTime(methodName, startTime, endTime);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        return obj;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-7-返回结果通知" tabindex="-1"><a class="header-anchor" href="#_4-7-返回结果通知"><span>4.7 返回结果通知</span></a></h4><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    @AfterReturning(pointcut = &quot;execution(* com.myblog.service.impl.BlogServiceImpl.*(..))&quot;, returning = &quot;result&quot;)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    public void afterReturning(JoinPoint jp, Object result) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        logger.info(jp.getSignature().getName());</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        logger.info(&quot;结果是：&quot; + result);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        logger.info(&quot;----------返回结果----------&quot;);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-8-异常后通知" tabindex="-1"><a class="header-anchor" href="#_4-8-异常后通知"><span>4.8 异常后通知</span></a></h4><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    @AfterThrowing(pointcut = &quot;execution(* com.myblog.service.impl.BlogServiceImpl.*(..))&quot;, throwing = &quot;exp&quot;)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    public void afterThrowing(JoinPoint jp, Exception exp) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        logger.info(jp.getSignature().getName());</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        logger.info(&quot;异常消息：&quot; + exp.getMessage());</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        logger.info(&quot;----------异常通知----------&quot;);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-9-结果" tabindex="-1"><a class="header-anchor" href="#_4-9-结果"><span>4.9 结果</span></a></h4><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.287 [http-nio-9090-exec-3] INFO  com.myblog.aspect.TimeInterceptor - getAllBlog</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.288 [http-nio-9090-exec-3] INFO  com.myblog.aspect.TimeInterceptor - ----------前置通知----------</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.288 [http-nio-9090-exec-3] DEBUG com.myblog.dao.BlogMapper - Cache Hit Ratio [com.myblog.dao.BlogMapper]: 0.6</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.288 [http-nio-9090-exec-3] DEBUG com.myblog.dao.BlogMapper - Cache Hit Ratio [com.myblog.dao.BlogMapper]: 0.6666666666666666</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.289 [http-nio-9090-exec-3] INFO  com.myblog.cache.EhRedisCache - ===========================Cache L1 (ehcache) </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.292 [http-nio-9090-exec-3] INFO  com.myblog.aspect.TimeInterceptor - com.myblog.service.IBlogService.getAllBlog method take time: **5 ms**</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.292 [http-nio-9090-exec-3] INFO  com.myblog.aspect.TimeInterceptor - ----------最终通知----------</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.292 [http-nio-9090-exec-3] INFO  com.myblog.aspect.TimeInterceptor - getAllBlog</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.292 [http-nio-9090-exec-3] INFO  com.myblog.aspect.TimeInterceptor - 结果是：Page{count=true, pageNum=1, pageSize=15, startRow=0, endRow=15, total=462, pages=31, countSignal=false, orderBy=&#39;null&#39;, orderByOnly=false, reasonable=true, pageSizeZero=true}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.292 [http-nio-9090-exec-3] INFO  com.myblog.aspect.TimeInterceptor - ----------返回结果----------</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">2018-02-04  17:22:46.292 [http-nio-9090-exec-3] INFO  com.myblog.cache.EhRedisCache - ===========================Cache L1 (ehcache) :{myCache}{com.myblog.service.impl.BlogServiceImpl.getBanner}={[ key = com.myblog.service.impl.BlogServiceImpl.getBanner, value=[com.myblog.model.Blog@2a5de6bc, com.myblog.model.Blog@544159b3, com.myblog.model.Blog@1de1421c, com.myblog.model.Blog@6dbb79bb, com.myblog.model.Blog@28160ab6], version=1, hitCount=2, CreationTime = 1517736161430, LastAccessTime = 1517736166292 ]}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由结果可以看到，整个方法的执行耗时5ms，算是客观吧，如果太大则要对其进行优化。</p><p>主要的源码在这：</p><p><a href="https://github.com/Zephery/newblog/blob/master/src/main/java/com/myblog/aspect/TimeInterceptor.java" target="_blank" rel="noopener noreferrer">TimeInterceptor</a></p><p>也可以下载我的博客源码参考参考：<br><a href="https://github.com/Zephery/newblog" target="_blank" rel="noopener noreferrer">newblog</a></p><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考"><span>参考</span></a></h2><ol><li><a href="http://www.cnblogs.com/best/p/5736422.html" target="_blank" rel="noopener noreferrer">Spring学习总结——Spring实现AOP的多种方式</a></li><li><a href="https://www.cnblogs.com/wang-meng/p/5641549.html#top" target="_blank" rel="noopener noreferrer">Spring AOP基础入门总结一</a></li><li><a href="https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html" target="_blank" rel="noopener noreferrer">Spring AOP官方</a></li></ol>`,48)]))}const h=e(l,[["render",t],["__file","aop.html.vue"]]),o=JSON.parse('{"path":"/java/SpringBoot/aop.html","title":"AOP","lang":"zh-CN","frontmatter":{"description":"AOP 一、概述 在通常的开发过程中，我们调用的顺序通常是controller->service-dao，其中，service中包含着太多的业务逻辑，并且还要不断调用dao来实现自身的业务逻辑，经常会导致业务耗时过久，在aop出现之前，方式一般是在函数中开始写一个startTime，结尾再写一个endTime来查看执行该函数的耗时，过多的使用此类方式会...","head":[["meta",{"property":"og:url","content":"http://www.wenzhihuai.com/java/SpringBoot/aop.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"AOP"}],["meta",{"property":"og:description","content":"AOP 一、概述 在通常的开发过程中，我们调用的顺序通常是controller->service-dao，其中，service中包含着太多的业务逻辑，并且还要不断调用dao来实现自身的业务逻辑，经常会导致业务耗时过久，在aop出现之前，方式一般是在函数中开始写一个startTime，结尾再写一个endTime来查看执行该函数的耗时，过多的使用此类方式会..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://github-images.wenzhihuai.com/images/20180118085015.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-01-30T06:53:42.000Z"}],["meta",{"property":"article:modified_time","content":"2024-01-30T06:53:42.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"AOP\\",\\"image\\":[\\"https://github-images.wenzhihuai.com/images/20180118085015.png\\",\\"https://github-images.wenzhihuai.com/images/20180204060518.png\\"],\\"dateModified\\":\\"2024-01-30T06:53:42.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Zephery\\",\\"url\\":\\"https://wenzhihuai.com/article/\\"}]}"]]},"headers":[{"level":2,"title":"一、概述","slug":"一、概述","link":"#一、概述","children":[{"level":3,"title":"1.1 特点","slug":"_1-1-特点","link":"#_1-1-特点","children":[]},{"level":3,"title":"1.2 AOP概述","slug":"_1-2-aop概述","link":"#_1-2-aop概述","children":[]}]},{"level":2,"title":"二、Spring中的AOP","slug":"二、spring中的aop","link":"#二、spring中的aop","children":[{"level":3,"title":"2.1 AspectJ支持5种类型的通知注解：","slug":"_2-1-aspectj支持5种类型的通知注解","link":"#_2-1-aspectj支持5种类型的通知注解","children":[]},{"level":3,"title":"2.2 Spring提供了4种实现AOP的方式：","slug":"_2-2-spring提供了4种实现aop的方式","link":"#_2-2-spring提供了4种实现aop的方式","children":[]}]},{"level":2,"title":"三、原理概述","slug":"三、原理概述","link":"#三、原理概述","children":[]},{"level":2,"title":"四、使用","slug":"四、使用","link":"#四、使用","children":[]},{"level":2,"title":"参考","slug":"参考","link":"#参考","children":[]}],"git":{"createdTime":1706596625000,"updatedTime":1706597622000,"contributors":[{"name":"zhihuaiwen","email":"zhihuaiwen@tencent.com","commits":2}]},"readingTime":{"minutes":7.17,"words":2150},"filePathRelative":"java/SpringBoot/aop.md","localizedDate":"2024年1月30日","excerpt":"\\n<h2>一、概述</h2>\\n<p>在通常的开发过程中，我们调用的顺序通常是controller-&gt;service-dao，其中，service中包含着太多的业务逻辑，并且还要不断调用dao来实现自身的业务逻辑，经常会导致业务耗时过久，在aop出现之前，方式一般是在函数中开始写一个startTime，结尾再写一个endTime来查看执行该函数的耗时，过多的使用此类方式会导致代码的耦合性太高，不利于管理，于是，AOP（面向切面）出现了。AOP关注的是横向的，而OOP的是纵向。</p>","autoDesc":true}');export{h as comp,o as data};
