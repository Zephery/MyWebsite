import{_ as e,c as o,d as a,o as n}from"./app-ftEjETWs.js";const r={};function p(c,t){return n(),o("div",null,t[0]||(t[0]=[a('<h1 id="cms" tabindex="-1"><a class="header-anchor" href="#cms"><span>CMS</span></a></h1><p>JDK14已经将CMS回收器完全移除，这里只需要记住它的缺点即可。</p><p><strong>CPU资源消耗</strong>：CMS垃圾回收器在运行过程中会与应用线程并发执行，这可能会导致较高的CPU资源消耗。</p><p><strong>内存碎片问题</strong>：CMS垃圾回收器在进行垃圾回收时，不会对对象进行压缩和整理，这可能会导致内存碎片问题。当内存碎片过多时，可能会导致无法找到足够大的连续内存空间来分配大对象，从而提前触发Full GC。</p><p><strong>预测性差</strong>：CMS垃圾回收器的暂停时间和CPU资源消耗都很难预测，这可能会对系统的性能造成影响。</p><p><strong>维护复杂</strong>：CMS垃圾回收器的代码相对复杂，需要更多的维护工作。</p>',6)]))}const s=e(r,[["render",p],["__file","cms.html.vue"]]),m=JSON.parse('{"path":"/java/JVM/cms.html","title":"CMS","lang":"zh-CN","frontmatter":{"description":"CMS JDK14已经将CMS回收器完全移除，这里只需要记住它的缺点即可。 CPU资源消耗：CMS垃圾回收器在运行过程中会与应用线程并发执行，这可能会导致较高的CPU资源消耗。 内存碎片问题：CMS垃圾回收器在进行垃圾回收时，不会对对象进行压缩和整理，这可能会导致内存碎片问题。当内存碎片过多时，可能会导致无法找到足够大的连续内存空间来分配大对象，从而提...","head":[["meta",{"property":"og:url","content":"http://www.wenzhihuai.com/java/JVM/cms.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"CMS"}],["meta",{"property":"og:description","content":"CMS JDK14已经将CMS回收器完全移除，这里只需要记住它的缺点即可。 CPU资源消耗：CMS垃圾回收器在运行过程中会与应用线程并发执行，这可能会导致较高的CPU资源消耗。 内存碎片问题：CMS垃圾回收器在进行垃圾回收时，不会对对象进行压缩和整理，这可能会导致内存碎片问题。当内存碎片过多时，可能会导致无法找到足够大的连续内存空间来分配大对象，从而提..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-16T09:22:35.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-16T09:22:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"CMS\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-02-16T09:22:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Zephery\\",\\"url\\":\\"https://wenzhihuai.com/article/\\"}]}"]]},"headers":[],"git":{"createdTime":1708056026000,"updatedTime":1708075355000,"contributors":[{"name":"zhihuaiwen","email":"zhihuaiwen@tencent.com","commits":2}]},"readingTime":{"minutes":0.73,"words":218},"filePathRelative":"java/JVM/cms.md","localizedDate":"2024年2月16日","excerpt":"\\n<p>JDK14已经将CMS回收器完全移除，这里只需要记住它的缺点即可。</p>\\n<p><strong>CPU资源消耗</strong>：CMS垃圾回收器在运行过程中会与应用线程并发执行，这可能会导致较高的CPU资源消耗。</p>","autoDesc":true}');export{s as comp,m as data};