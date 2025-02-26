import{_ as i,c as a,d as n,o as t}from"./app-DChB4uJf.js";const e={};function h(l,s){return t(),a("div",null,s[0]||(s[0]=[n(`<h1 id="elastic-spark" tabindex="-1"><a class="header-anchor" href="#elastic-spark"><span>elastic spark</span></a></h1><p>Hadoop允许Elasticsearch在Spark中以两种方式使用：通过自2.1以来的原生RDD支持，或者通过自2.0以来的Map/Reduce桥接器。从5.0版本开始，elasticsearch-hadoop就支持Spark 2.0。目前spark支持的数据源有：<br> （1）文件系统：LocalFS、HDFS、Hive、text、parquet、orc、json、csv<br> （2）数据RDBMS：mysql、oracle、mssql<br> （3）NOSQL数据库：HBase、ES、Redis<br> （4）消息对象：Redis</p><p>elasticsearch相对hdfs来说，容易搭建、并且有可视化kibana支持，非常方便spark的初学入门，本文主要讲解用elasticsearch-spark的入门。</p><figure><img src="https://databricks.com/wp-content/uploads/2019/02/largest-open-source-apache-spark.png" alt="Spark - Apache Spark" tabindex="0" loading="lazy"><figcaption>Spark - Apache Spark</figcaption></figure><h2 id="一、原生rdd支持" tabindex="-1"><a class="header-anchor" href="#一、原生rdd支持"><span>一、原生RDD支持</span></a></h2><h3 id="_1-1-基础配置" tabindex="-1"><a class="header-anchor" href="#_1-1-基础配置"><span>1.1 基础配置</span></a></h3><p>相关库引入：</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;org.elasticsearch&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;elasticsearch-spark-30_2.13&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;8.1.3&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>SparkConf配置，更多详细的请点击<a href="https://www.elastic.co/Zephery/en/elasticsearch/hadoop/current/configuration.html" target="_blank" rel="noopener noreferrer">这里</a>或者源码<a href="https://github.com/elastic/elasticsearch-hadoop/blob/master/mr/src/main/java/org/elasticsearch/hadoop/cfg/ConfigurationOptions.java" target="_blank" rel="noopener noreferrer">ConfigurationOptions</a>。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> SparkConf</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> getSparkConf</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">() {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    SparkConf</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> sparkConf </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> SparkConf</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">setAppName</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;elasticsearch-spark-demo&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">    sparkConf</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">set</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;es.nodes&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;host&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">set</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;es.port&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;xxxxxx&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">set</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;es.nodes.wan.only&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;true&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">set</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;es.net.http.auth.user&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;elxxxxastic&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">set</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;es.net.http.auth.pass&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;xxxx&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            .</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">setMaster</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;local[*]&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    return</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> sparkConf</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-读取es数据" tabindex="-1"><a class="header-anchor" href="#_1-2-读取es数据"><span>1.2 读取es数据</span></a></h3><p>这里用的是kibana提供的sample data里面的索引kibana_sample_data_ecommerce，也可以替换成自己的索引。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> main</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">[] args) {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    SparkConf</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> conf </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> getSparkConf</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    try</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">JavaSparkContext</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> jsc </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> JavaSparkContext</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(conf)) {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">        JavaPairRDD</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Map</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Object</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&gt;&gt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> esRDD </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">                JavaEsSpark</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">esRDD</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(jsc, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;kibana_sample_data_ecommerce&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        esRDD</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">collect</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">forEach</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">System</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">::</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">println);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>esRDD同时也支持query语句esRDD(final JavaSparkContext jsc, final String resource, final String query)，一般对es的查询都需要根据时间筛选一下，不过相对于es的官方sdk，并没有那么友好的api，只能直接使用原生的dsl语句。</p><h3 id="_1-3-写数据" tabindex="-1"><a class="header-anchor" href="#_1-3-写数据"><span>1.3 写数据</span></a></h3><p>支持序列化对象、json，并且能够使用占位符动态索引写入数据（使用较少），不过多介绍了。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> jsonWrite</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(){</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> json1 </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;{</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">reason</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> : </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">business</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">,</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">airport</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> : </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">SFO</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">}&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> json2 </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;{</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">participants</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> : 5,</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">airport</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> : </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">OTP</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">}&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    JavaRDD</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&gt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> stringRDD </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> jsc</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">parallelize</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">ImmutableList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">of</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(json1, json2));</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">    JavaEsSpark</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">saveJsonToEs</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(stringRDD, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;spark-json&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>比较常用的读写也就这些，更多可以看下官网相关介绍。</p><h2 id="二、spark-streaming" tabindex="-1"><a class="header-anchor" href="#二、spark-streaming"><span>二、Spark Streaming</span></a></h2><p>spark的实时处理，es5.0的时候开始支持，目前</p><h2 id="三、spark-sql" tabindex="-1"><a class="header-anchor" href="#三、spark-sql"><span>三、Spark SQL</span></a></h2><h2 id="四、spark-structure-streaming" tabindex="-1"><a class="header-anchor" href="#四、spark-structure-streaming"><span>四、Spark Structure Streaming</span></a></h2><h2 id="五、spark-on-kubernetes-operator" tabindex="-1"><a class="header-anchor" href="#五、spark-on-kubernetes-operator"><span>五、Spark on kubernetes Operator</span></a></h2><h1 id="参考" tabindex="-1"><a class="header-anchor" href="#参考"><span>参考：</span></a></h1><p>1.<a href="https://www.elastic.co/Zephery/en/elasticsearch/hadoop/current/spark.html" target="_blank" rel="noopener noreferrer">Apache Spark support</a></p><p>2.<a href="https://github.com/elastic/elasticsearch-hadoop" target="_blank" rel="noopener noreferrer">elasticsearch-hadoop</a></p><p>3.<a href="https://www.jianshu.com/p/996c60f0492a" target="_blank" rel="noopener noreferrer">使用SparkSQL操作Elasticsearch - Spark入门教程</a></p>`,27)]))}const p=i(e,[["render",h],["__file","elastic-spark.html.vue"]]),r=JSON.parse('{"path":"/bigdata/spark/elastic-spark.html","title":"elastic spark","lang":"zh-CN","frontmatter":{"description":"elastic spark Hadoop允许Elasticsearch在Spark中以两种方式使用：通过自2.1以来的原生RDD支持，或者通过自2.0以来的Map/Reduce桥接器。从5.0版本开始，elasticsearch-hadoop就支持Spark 2.0。目前spark支持的数据源有： （1）文件系统：LocalFS、HDFS、Hive、t...","head":[["meta",{"property":"og:url","content":"http://www.wenzhihuai.com/bigdata/spark/elastic-spark.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"elastic spark"}],["meta",{"property":"og:description","content":"elastic spark Hadoop允许Elasticsearch在Spark中以两种方式使用：通过自2.1以来的原生RDD支持，或者通过自2.0以来的Map/Reduce桥接器。从5.0版本开始，elasticsearch-hadoop就支持Spark 2.0。目前spark支持的数据源有： （1）文件系统：LocalFS、HDFS、Hive、t..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://databricks.com/wp-content/uploads/2019/02/largest-open-source-apache-spark.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-01-25T11:42:16.000Z"}],["meta",{"property":"article:modified_time","content":"2024-01-25T11:42:16.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"elastic spark\\",\\"image\\":[\\"https://databricks.com/wp-content/uploads/2019/02/largest-open-source-apache-spark.png\\"],\\"dateModified\\":\\"2024-01-25T11:42:16.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Zephery\\",\\"url\\":\\"https://wenzhihuai.com/article/\\"}]}"]]},"headers":[{"level":2,"title":"一、原生RDD支持","slug":"一、原生rdd支持","link":"#一、原生rdd支持","children":[{"level":3,"title":"1.1 基础配置","slug":"_1-1-基础配置","link":"#_1-1-基础配置","children":[]},{"level":3,"title":"1.2 读取es数据","slug":"_1-2-读取es数据","link":"#_1-2-读取es数据","children":[]},{"level":3,"title":"1.3 写数据","slug":"_1-3-写数据","link":"#_1-3-写数据","children":[]}]},{"level":2,"title":"二、Spark Streaming","slug":"二、spark-streaming","link":"#二、spark-streaming","children":[]},{"level":2,"title":"三、Spark SQL","slug":"三、spark-sql","link":"#三、spark-sql","children":[]},{"level":2,"title":"四、Spark Structure Streaming","slug":"四、spark-structure-streaming","link":"#四、spark-structure-streaming","children":[]},{"level":2,"title":"五、Spark on kubernetes Operator","slug":"五、spark-on-kubernetes-operator","link":"#五、spark-on-kubernetes-operator","children":[]}],"git":{"createdTime":1651578150000,"updatedTime":1706182936000,"contributors":[{"name":"zhihuaiwen","email":"zhihuaiwen@tencent.com","commits":1}]},"readingTime":{"minutes":1.71,"words":514},"filePathRelative":"bigdata/spark/elastic-spark.md","localizedDate":"2022年5月3日","excerpt":"\\n<p>Hadoop允许Elasticsearch在Spark中以两种方式使用：通过自2.1以来的原生RDD支持，或者通过自2.0以来的Map/Reduce桥接器。从5.0版本开始，elasticsearch-hadoop就支持Spark 2.0。目前spark支持的数据源有：<br>\\n（1）文件系统：LocalFS、HDFS、Hive、text、parquet、orc、json、csv<br>\\n（2）数据RDBMS：mysql、oracle、mssql<br>\\n（3）NOSQL数据库：HBase、ES、Redis<br>\\n（4）消息对象：Redis</p>","autoDesc":true}');export{p as comp,r as data};
