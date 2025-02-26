import{_ as i,c as a,d as e,o as n}from"./app-DChB4uJf.js";const l={};function t(r,s){return n(),a("div",null,s[0]||(s[0]=[e(`<h1 id="jvm调优参数" tabindex="-1"><a class="header-anchor" href="#jvm调优参数"><span>JVM调优参数</span></a></h1><h2 id="一、堆大小设置" tabindex="-1"><a class="header-anchor" href="#一、堆大小设置"><span>一、堆大小设置</span></a></h2><p>JVM 中最大堆大小有三方面限制：相关操作系统的数据模型（32-bt还是64-bit）限制；系统的可用虚拟内存限制；系统的可用物理内存限制。32位系统 下，一般限制在1.5G~2G；64为操作系统对内存无限制。我在Windows Server 2003 系统，3.5G物理内存，JDK5.0下测试，最大可设置为1478m。</p><h3 id="典型设置" tabindex="-1"><a class="header-anchor" href="#典型设置"><span>典型设置：</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">java</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmx3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xms3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmn2g</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xss128k</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>-Xmx3550m：设置JVM最大可用内存为3550M。<br> -Xms3550m：设置JVM促使内存为3550m。此值可以设置与-Xmx相同，以避免每次垃圾回收完成后JVM重新分配内存。<br> -Xmn2g：设置年轻代大小为2G。整个JVM内存大小=年轻代大小 + 年老代大小 + 持久代大小。持久代一般固定大小为64m，所以增大年轻代后，将会减小年老代大小。此值对系统性能影响较大，Sun官方推荐配置为整个堆的3/8。<br> -Xss128k： 设置每个线程的堆栈大小。JDK5.0以后每个线程堆栈大小为1M，以前每个线程堆栈大小为256K。更具应用的线程所需内存大小进行调整。在相同物理内 存下，减小这个值能生成更多的线程。但是操作系统对一个进程内的线程数还是有限制的，不能无限生成，经验值在3000~5000左右。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">java</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmx3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xms3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xss128k</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:NewRatio=4</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:SurvivorRatio=4</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:MaxPermSize=16m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:MaxTenuringThreshold=0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>-XX:NewRatio=4:设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。设置为4，则年轻代与年老代所占比值为1：4，年轻代占整个堆栈的1/5<br> -XX:SurvivorRatio=4：设置年轻代中Eden区与Survivor区的大小比值。设置为4，则两个Survivor区与一个Eden区的比值为2:4，一个Survivor区占整个年轻代的1/6<br> -XX:MaxPermSize=16m:设置持久代大小为16m。<br> -XX:MaxTenuringThreshold=0：设置垃圾最大年龄。如果设置为0的话，则年轻代对象不经过Survivor区，直接进入年老代。对于年老代比较多的应用，可以提高效率。如果将此值设置为一个较大值，则年轻代对象会在Survivor区进行多次复制，这样可以增加对象再年轻代的存活时间，增加在年轻代即被回收的概论。</p><h2 id="二、回收器选择" tabindex="-1"><a class="header-anchor" href="#二、回收器选择"><span>二、回收器选择</span></a></h2><p>JVM给了三种选择：串行收集器、并行收集器、并发收集器，但是串行收集器只适用于小数据量的情况，所以这里的选择主要针对并行收集器和并发收集器。默认情况下，JDK5.0以前都是使用串行收集器，如果想使用其他收集器需要在启动时加入相应参数。JDK5.0以后，JVM会根据当前系统配置进行判断。</p><h3 id="_2-1-吞吐量优先的并行收集器" tabindex="-1"><a class="header-anchor" href="#_2-1-吞吐量优先的并行收集器"><span>2.1 吞吐量优先的并行收集器</span></a></h3><p>如上文所述，并行收集器主要以到达一定的吞吐量为目标，适用于科学技术和后台处理等。<br> 典型配置：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">java</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmx3800m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xms3800m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmn2g</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xss128k</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:+UseParallelGC</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:ParallelGCThreads=20</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>-XX:+UseParallelGC：选择垃圾收集器为并行收集器。此配置仅对年轻代有效。即上述配置下，年轻代使用并发收集，而年老代仍旧使用串行收集。<br> -XX:ParallelGCThreads=20：配置并行收集器的线程数，即：同时多少个线程一起进行垃圾回收。此值最好配置与处理器数目相等。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">java</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmx3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xms3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmn2g</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xss128k</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:+UseParallelGC</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:ParallelGCThreads=20</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:+UseParallelOldGC</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>-XX:+UseParallelOldGC：配置年老代垃圾收集方式为并行收集。JDK6.0支持对年老代并行收集。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">java</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmx3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xms3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmn2g</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xss128k</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:+UseParallelGC </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:MaxGCPauseMillis=100</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>-XX:MaxGCPauseMillis=100:设置每次年轻代垃圾回收的最长时间，如果无法满足此时间，JVM会自动调整年轻代大小，以满足此值。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">java</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmx3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xms3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmn2g</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xss128k</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:+UseParallelGC </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:MaxGCPauseMillis=100</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:+UseAdaptiveSizePolicy</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>-XX:+UseAdaptiveSizePolicy：设置此选项后，并行收集器会自动选择年轻代区大小和相应的Survivor区比例，以达到目标系统规定的最低相应时间或者收集频率等，此值建议使用并行收集器时，一直打开。</p><h3 id="_2-2-响应时间优先的并发收集器" tabindex="-1"><a class="header-anchor" href="#_2-2-响应时间优先的并发收集器"><span>2.2 响应时间优先的并发收集器</span></a></h3><p>如上文所述，并发收集器主要是保证系统的响应时间，减少垃圾收集时的停顿时间。适用于应用服务器、电信领域等。<br> 典型配置：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">java</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmx3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xms3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmn2g</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xss128k</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:ParallelGCThreads=20</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:+UseConcMarkSweepGC</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:+UseParNewGC</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>-XX:+UseConcMarkSweepGC：设置年老代为并发收集。测试中配置这个以后，-XX:NewRatio=4的配置失效了，原因不明。所以，此时年轻代大小最好用-Xmn设置。<br> -XX:+UseParNewGC:设置年轻代为并行收集。可与CMS收集同时使用。JDK5.0以上，JVM会根据系统配置自行设置，所以无需再设置此值。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">java</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmx3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xms3550m</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xmn2g</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -Xss128k</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:+UseConcMarkSweepGC</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:CMSFullGCsBeforeCompaction=5</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -XX:+UseCMSCompactAtFullCollection</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>-XX:CMSFullGCsBeforeCompaction：由于并发收集器不对内存空间进行压缩、整理，所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行多少次GC以后对内存空间进行压缩、整理。<br> -XX:+UseCMSCompactAtFullCollection：打开对年老代的压缩。可能会影响性能，但是可以消除碎片</p><h2 id="三、辅助信息" tabindex="-1"><a class="header-anchor" href="#三、辅助信息"><span>三、辅助信息</span></a></h2><p>JVM提供了大量命令行参数，打印信息，供调试使用。主要有以下一些：<br> -XX:+PrintGC<br> 输出形式：[GC 118250K-&gt;113543K(130112K), 0.0094143 secs]<br>                 [Full GC 121376K-&gt;10414K(130112K), 0.0650971 secs]</p><p>-XX:+PrintGCDetails<br> 输出形式：[GC [DefNew: 8614K-&gt;781K(9088K), 0.0123035 secs] 118250K-&gt;113543K(130112K), 0.0124633 secs]<br>                 [GC [DefNew: 8614K-&gt;8614K(9088K), 0.0000665 secs][Tenured: 112761K-&gt;10414K(121024K), 0.0433488 secs] 121376K-&gt;10414K(130112K), 0.0436268 secs]</p><p>-XX:+PrintGCTimeStamps -XX:+PrintGC：PrintGCTimeStamps可与上面两个混合使用<br> 输出形式：11.851: [GC 98328K-&gt;93620K(130112K), 0.0082960 secs]<br> -XX:+PrintGCApplicationConcurrentTime:打印每次垃圾回收前，程序未中断的执行时间。可与上面混合使用<br> 输出形式：Application time: 0.5291524 seconds<br> -XX:+PrintGCApplicationStoppedTime：打印垃圾回收期间程序暂停的时间。可与上面混合使用<br> 输出形式：Total time for which application threads were stopped: 0.0468229 seconds<br> -XX:PrintHeapAtGC:打印GC前后的详细堆栈信息<br> 输出形式：</p><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" data-title="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>34.702: [GC {Heap before gc invocations=7:</span></span>
<span class="line"><span> def new generation   total 55296K, used 52568K [0x1ebd0000, 0x227d0000, 0x227d0000)</span></span>
<span class="line"><span>eden space 49152K,  99% used [0x1ebd0000, 0x21bce430, 0x21bd0000)</span></span>
<span class="line"><span>from space 6144K,  55% used [0x221d0000, 0x22527e10, 0x227d0000)</span></span>
<span class="line"><span>  to   space 6144K,   0% used [0x21bd0000, 0x21bd0000, 0x221d0000)</span></span>
<span class="line"><span> tenured generation   total 69632K, used 2696K [0x227d0000, 0x26bd0000, 0x26bd0000)</span></span>
<span class="line"><span>the space 69632K,   3% used [0x227d0000, 0x22a720f8, 0x22a72200, 0x26bd0000)</span></span>
<span class="line"><span> compacting perm gen  total 8192K, used 2898K [0x26bd0000, 0x273d0000, 0x2abd0000)</span></span>
<span class="line"><span>   the space 8192K,  35% used [0x26bd0000, 0x26ea4ba8, 0x26ea4c00, 0x273d0000)</span></span>
<span class="line"><span>    ro space 8192K,  66% used [0x2abd0000, 0x2b12bcc0, 0x2b12be00, 0x2b3d0000)</span></span>
<span class="line"><span>    rw space 12288K,  46% used [0x2b3d0000, 0x2b972060, 0x2b972200, 0x2bfd0000)</span></span>
<span class="line"><span>34.735: [DefNew: 52568K-&gt;3433K(55296K), 0.0072126 secs] 55264K-&gt;6615K(124928K)Heap after gc invocations=8:</span></span>
<span class="line"><span> def new generation   total 55296K, used 3433K [0x1ebd0000, 0x227d0000, 0x227d0000)</span></span>
<span class="line"><span>eden space 49152K,   0% used [0x1ebd0000, 0x1ebd0000, 0x21bd0000)</span></span>
<span class="line"><span>  from space 6144K,  55% used [0x21bd0000, 0x21f2a5e8, 0x221d0000)</span></span>
<span class="line"><span>  to   space 6144K,   0% used [0x221d0000, 0x221d0000, 0x227d0000)</span></span>
<span class="line"><span> tenured generation   total 69632K, used 3182K [0x227d0000, 0x26bd0000, 0x26bd0000)</span></span>
<span class="line"><span>the space 69632K,   4% used [0x227d0000, 0x22aeb958, 0x22aeba00, 0x26bd0000)</span></span>
<span class="line"><span> compacting perm gen  total 8192K, used 2898K [0x26bd0000, 0x273d0000, 0x2abd0000)</span></span>
<span class="line"><span>   the space 8192K,  35% used [0x26bd0000, 0x26ea4ba8, 0x26ea4c00, 0x273d0000)</span></span>
<span class="line"><span>    ro space 8192K,  66% used [0x2abd0000, 0x2b12bcc0, 0x2b12be00, 0x2b3d0000)</span></span>
<span class="line"><span>    rw space 12288K,  46% used [0x2b3d0000, 0x2b972060, 0x2b972200, 0x2bfd0000)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>, 0.0757599 secs]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>-Xloggc:filename:与上面几个配合使用，把相关日志信息记录到文件以便分析。<br><strong>常见配置汇总</strong></p><h3 id="_3-1-堆设置" tabindex="-1"><a class="header-anchor" href="#_3-1-堆设置"><span>3.1 堆设置</span></a></h3><p>-Xms:初始堆大小<br> -Xmx:最大堆大小<br> -XX:NewSize=n:设置年轻代大小<br> -XX:NewRatio=n:设置年轻代和年老代的比值。如:为3，表示年轻代与年老代比值为1：3，年轻代占整个年轻代年老代和的1/4<br> -XX:SurvivorRatio=n:年轻代中Eden区与两个Survivor区的比值。注意Survivor区有两个。如：3，表示Eden：Survivor=3：2，一个Survivor区占整个年轻代的1/5<br> -XX:MaxPermSize=n:设置持久代大小</p><h3 id="_3-2-收集器设置" tabindex="-1"><a class="header-anchor" href="#_3-2-收集器设置"><span>3.2 收集器设置</span></a></h3><p>-XX:+UseSerialGC:设置串行收集器<br> -XX:+UseParallelGC:设置并行收集器<br> -XX:+UseParalledlOldGC:设置并行年老代收集器<br> -XX:+UseConcMarkSweepGC:设置并发收集器</p><h3 id="_3-3-垃圾回收统计信息" tabindex="-1"><a class="header-anchor" href="#_3-3-垃圾回收统计信息"><span>3.3 垃圾回收统计信息</span></a></h3><p>-XX:+PrintGC<br> -XX:+PrintGCDetails<br> -XX:+PrintGCTimeStamps<br> -Xloggc:filename</p><h3 id="_3-4-并行收集器设置" tabindex="-1"><a class="header-anchor" href="#_3-4-并行收集器设置"><span>3.4 并行收集器设置</span></a></h3><p>-XX:ParallelGCThreads=n:设置并行收集器收集时使用的CPU数。并行收集线程数。<br> -XX:MaxGCPauseMillis=n:设置并行收集最大暂停时间<br> -XX:GCTimeRatio=n:设置垃圾回收时间占程序运行时间的百分比。公式为1/(1+n)</p><h3 id="_3-5-并发收集器设置" tabindex="-1"><a class="header-anchor" href="#_3-5-并发收集器设置"><span>3.5 并发收集器设置</span></a></h3><p>-XX:+CMSIncrementalMode:设置为增量模式。适用于单CPU情况。<br> -XX:ParallelGCThreads=n:设置并发收集器年轻代收集方式为并行收集时，使用的CPU数。并行收集线程数。</p><h2 id="四、调优总结" tabindex="-1"><a class="header-anchor" href="#四、调优总结"><span>四、调优总结</span></a></h2><h3 id="_4-1-年轻代大小选择" tabindex="-1"><a class="header-anchor" href="#_4-1-年轻代大小选择"><span>4.1 年轻代大小选择</span></a></h3><p>响应时间优先的应用：尽可能设大，直到接近系统的最低响应时间限制（根据实际情况选择）。在此种情况下，年轻代收集发生的频率也是最小的。同时，减少到达年老代的对象。<br> 吞吐量优先的应用：尽可能的设置大，可能到达Gbit的程度。因为对响应时间没有要求，垃圾收集可以并行进行，一般适合8CPU以上的应用。</p><h3 id="_4-2-年老代大小选择" tabindex="-1"><a class="header-anchor" href="#_4-2-年老代大小选择"><span>4.2 年老代大小选择</span></a></h3><p>响应时间优先的应用：年老代使用并发收集器，所以其大小需要小心设置，一般要考虑并发会话率和会话持续时间等一些参数。如果堆设置小了，可以会造成内存碎片、高回收频率以及应用暂停而使用传统的标记清除方式；如果堆大了，则需要较长的收集时间。最优化的方案，一般需要参考以下数据获得：<br> 并发垃圾收集信息<br> 持久代并发收集次数<br> 传统GC信息<br> 花在年轻代和年老代回收上的时间比例<br> 减少年轻代和年老代花费的时间，一般会提高应用的效率<br> 吞吐量优先的应用：一般吞吐量优先的应用都有一个很大的年轻代和一个较小的年老代。原因是，这样可以尽可能回收掉大部分短期对象，减少中期的对象，而年老代尽存放长期存活对象。</p><h3 id="_4-3-较小堆引起的碎片问题" tabindex="-1"><a class="header-anchor" href="#_4-3-较小堆引起的碎片问题"><span>4.3 较小堆引起的碎片问题</span></a></h3><p>因为年老代的并发收集器使用标记、清除算法，所以不会对堆进行压缩。当收集器回收时，他 会把相邻的空间进行合并，这样可以分配给较大的对象。但是，当堆空间较小时，运行一段时间以后，就会出现“碎片”，如果并发收集器找不到足够的空间，那么 并发收集器将会停止，然后使用传统的标记、清除方式进行回收。如果出现“碎片”，可能需要进行如下配置：<br> -XX:+UseCMSCompactAtFullCollection：使用并发收集器时，开启对年老代的压缩。<br> -XX:CMSFullGCsBeforeCompaction=0：上面配置开启的情况下，这里设置多少次Full GC后，对年老代进行压缩</p>`,49)]))}const d=i(l,[["render",t],["__file","JVM调优参数.html.vue"]]),p=JSON.parse('{"path":"/java/JVM/JVM%E8%B0%83%E4%BC%98%E5%8F%82%E6%95%B0.html","title":"JVM调优参数","lang":"zh-CN","frontmatter":{"description":"JVM调优参数 一、堆大小设置 JVM 中最大堆大小有三方面限制：相关操作系统的数据模型（32-bt还是64-bit）限制；系统的可用虚拟内存限制；系统的可用物理内存限制。32位系统 下，一般限制在1.5G~2G；64为操作系统对内存无限制。我在Windows Server 2003 系统，3.5G物理内存，JDK5.0下测试，最大可设置为1478m。...","head":[["meta",{"property":"og:url","content":"http://www.wenzhihuai.com/java/JVM/JVM%E8%B0%83%E4%BC%98%E5%8F%82%E6%95%B0.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"JVM调优参数"}],["meta",{"property":"og:description","content":"JVM调优参数 一、堆大小设置 JVM 中最大堆大小有三方面限制：相关操作系统的数据模型（32-bt还是64-bit）限制；系统的可用虚拟内存限制；系统的可用物理内存限制。32位系统 下，一般限制在1.5G~2G；64为操作系统对内存无限制。我在Windows Server 2003 系统，3.5G物理内存，JDK5.0下测试，最大可设置为1478m。..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-16T04:00:26.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-16T04:00:26.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"JVM调优参数\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-02-16T04:00:26.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Zephery\\",\\"url\\":\\"https://wenzhihuai.com/article/\\"}]}"]]},"headers":[{"level":2,"title":"一、堆大小设置","slug":"一、堆大小设置","link":"#一、堆大小设置","children":[{"level":3,"title":"典型设置：","slug":"典型设置","link":"#典型设置","children":[]}]},{"level":2,"title":"二、回收器选择","slug":"二、回收器选择","link":"#二、回收器选择","children":[{"level":3,"title":"2.1 吞吐量优先的并行收集器","slug":"_2-1-吞吐量优先的并行收集器","link":"#_2-1-吞吐量优先的并行收集器","children":[]},{"level":3,"title":"2.2 响应时间优先的并发收集器","slug":"_2-2-响应时间优先的并发收集器","link":"#_2-2-响应时间优先的并发收集器","children":[]}]},{"level":2,"title":"三、辅助信息","slug":"三、辅助信息","link":"#三、辅助信息","children":[{"level":3,"title":"3.1 堆设置","slug":"_3-1-堆设置","link":"#_3-1-堆设置","children":[]},{"level":3,"title":"3.2 收集器设置","slug":"_3-2-收集器设置","link":"#_3-2-收集器设置","children":[]},{"level":3,"title":"3.3 垃圾回收统计信息","slug":"_3-3-垃圾回收统计信息","link":"#_3-3-垃圾回收统计信息","children":[]},{"level":3,"title":"3.4 并行收集器设置","slug":"_3-4-并行收集器设置","link":"#_3-4-并行收集器设置","children":[]},{"level":3,"title":"3.5 并发收集器设置","slug":"_3-5-并发收集器设置","link":"#_3-5-并发收集器设置","children":[]}]},{"level":2,"title":"四、调优总结","slug":"四、调优总结","link":"#四、调优总结","children":[{"level":3,"title":"4.1 年轻代大小选择","slug":"_4-1-年轻代大小选择","link":"#_4-1-年轻代大小选择","children":[]},{"level":3,"title":"4.2 年老代大小选择","slug":"_4-2-年老代大小选择","link":"#_4-2-年老代大小选择","children":[]},{"level":3,"title":"4.3 较小堆引起的碎片问题","slug":"_4-3-较小堆引起的碎片问题","link":"#_4-3-较小堆引起的碎片问题","children":[]}]}],"git":{"createdTime":1579957849000,"updatedTime":1708056026000,"contributors":[{"name":"zhihuaiwen","email":"zhihuaiwen@tencent.com","commits":1}]},"readingTime":{"minutes":9.13,"words":2739},"filePathRelative":"java/JVM/JVM调优参数.md","localizedDate":"2020年1月25日","excerpt":"\\n<h2>一、堆大小设置</h2>\\n<p>JVM 中最大堆大小有三方面限制：相关操作系统的数据模型（32-bt还是64-bit）限制；系统的可用虚拟内存限制；系统的可用物理内存限制。32位系统 下，一般限制在1.5G~2G；64为操作系统对内存无限制。我在Windows Server 2003 系统，3.5G物理内存，JDK5.0下测试，最大可设置为1478m。</p>","autoDesc":true}');export{d as comp,p as data};
