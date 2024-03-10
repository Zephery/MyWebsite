import{_ as a,r as l,o as r,c as d,a as i,d as e,b as s,e as t}from"./app-BUhiAgtU.js";const m={},c=t(`<h1 id="_6-数据库备份" tabindex="-1"><a class="header-anchor" href="#_6-数据库备份" aria-hidden="true">#</a> 6.数据库备份</h1><p>先来回顾一下上一篇的小集群架构，tomcat集群，nginx进行反向代理，服务器异地：</p><figure><img src="https://github-images.wenzhihuai.com/images/20171018051437-20240126113709561.png" alt="" tabindex="0"><figcaption></figcaption></figure><p>由上一篇讲到，部署的时候，将war部署在不同的服务器里，通过spring-session实现了session共享，基本的分布式部署还算是完善了点，但是想了想数据库的访问会不会延迟太大，毕竟一个服务器在北京，一个在深圳，然后试着ping了一下：</p><figure><img src="https://github-images.wenzhihuai.com/images/20171118033130.png" alt="" tabindex="0"><figcaption></figcaption></figure><p>果然，36ms。。。看起来挺小的，但是对比一下sql执行语句的时间：</p><figure><img src="https://github-images.wenzhihuai.com/images/20171118034129.png" alt="" tabindex="0"><figcaption></figcaption></figure><p>大部分都能在10ms内完成，而最长的语句是insert语句，可见，由于异地导致的36ms延时还是比较大的，捣鼓了一下，最后还是选择换个架构，每个服务器读取自己的数据库，然后数据库底层做一下主主复制，让数据同步。最终架构如下：</p><figure><img src="https://github-images.wenzhihuai.com/images/20171118035150.png" alt="" tabindex="0"><figcaption></figcaption></figure><h1 id="一、mysql的复制" tabindex="-1"><a class="header-anchor" href="#一、mysql的复制" aria-hidden="true">#</a> 一、MySql的复制</h1><p>数据库复制的基本问题就是让一台服务器的数据与其他服务器保持同步。MySql目前支持两种复制方式：基于行的复制和基于语句的复制，这两者的基本过程都是在主库上记录二进制的日志、在备库上重放日志的方式来实现异步的数据复制。其过程分为三步：<br> (1)master将改变记录到二进制日志(binary log)中（这些记录叫做二进制日志事件，binary log events）；<br> (2)slave将master的binary log events拷贝到它的中继日志(relay log)；<br> (3)slave重做中继日志中的事件，将改变反映它自己的数据。</p><figure><img src="https://github-images.wenzhihuai.com/images/20171118040843.png" alt="" tabindex="0"><figcaption></figcaption></figure><p>该过程的第一部分就是master记录二进制日志。在每个事务更新数据完成之前，master在二日志记录这些改变。MySQL将事务串行的写入二进制日志，即使事务中的语句都是交叉执行的。在事件写入二进制日志完成后，master通知存储引擎提交事务。<br> 下一步就是slave将master的binary log拷贝到它自己的中继日志。首先，slave开始一个工作线程——I/O线程。I/O线程在master上打开一个普通的连接，然后开始binlog dump process。Binlog dump process从master的二进制日志中读取事件，如果已经跟上master，它会睡眠并等待master产生新的事件。I/O线程将这些事件写入中继日志。<br> SQL slave thread处理该过程的最后一步。SQL线程从中继日志读取事件，更新slave的数据，使其与master中的数据一致。只要该线程与I/O线程保持一致，中继日志通常会位于OS的缓存中，所以中继日志的开销很小。<br> 此外，在master中也有一个工作线程：和其它MySQL的连接一样，slave在master中打开一个连接也会使得master开始一个线程。复制过程有一个很重要的限制——复制在slave上是串行化的，也就是说master上的并行更新操作不能在slave上并行操作。<br> MySql的基本复制方式有主从复制、主主复制，主主复制即把主从复制的配置倒过来再配置一遍即可，下面的配置则是主从复制的过程，到时候可自行改为主主复制。其他的架构如：一主库多备库、环形复制、树或者金字塔型都是基于这两种方式，可参考《高性能MySql》。</p><h1 id="二、配置过程" tabindex="-1"><a class="header-anchor" href="#二、配置过程" aria-hidden="true">#</a> 二、配置过程</h1><h3 id="_2-1-创建所用的复制账号" tabindex="-1"><a class="header-anchor" href="#_2-1-创建所用的复制账号" aria-hidden="true">#</a> 2.1 创建所用的复制账号</h3><p>由于是个自己的小网站，就不做过多的操作了，直接使用root账号</p><h3 id="_2-2-配置master" tabindex="-1"><a class="header-anchor" href="#_2-2-配置master" aria-hidden="true">#</a> 2.2 配置master</h3><p>接下来要对mysql的serverID，日志位置，复制方式等进行操作，使用vim打开my.cnf。</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>[client]
default-character-set=utf8

[mysqld]
character_set_server=utf8
init_connect= SET NAMES utf8

datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock

symbolic-links=0

log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

# master
log-bin=mysql-bin
# 设为基于行的复制
binlog-format=ROW
# 设置server的唯一id
server-id=2
# 忽略的数据库，不使用备份
binlog-ignore-db=information_schema
binlog-ignore-db=cluster
binlog-ignore-db=mysql
# 要进行备份的数据库
binlog-do-db=myblog
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重启Mysql之后，查看主库状态，show master status。</p><figure><img src="https://github-images.wenzhihuai.com/images/20171118050128.png" alt="" tabindex="0"><figcaption></figcaption></figure><p>其中，File为日志文件，指定Slave从哪个日志文件开始读复制数据，Position为偏移，从哪个POSITION号开始读，Binlog_Do_DB为要备份的数据库。</p><h3 id="_2-3-配置slave" tabindex="-1"><a class="header-anchor" href="#_2-3-配置slave" aria-hidden="true">#</a> 2.3 配置slave</h3><p>从库的配置跟主库类似，vim /etc/my.cnf配置从库信息。</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>
[client]
default-character-set=utf8

[mysqld]
character_set_server=utf8
init_connect= SET NAMES utf8

datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock

symbolic-links=0

log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

# slave
log-bin=mysql-bin
# 服务器唯一id
server-id=3
# 不备份的数据库
binlog-ignore-db=information_schema
binlog-ignore-db=cluster
binlog-ignore-db=mysql
# 需要备份的数据库
replicate-do-db=myblog
# 其他相关信息
slave-skip-errors=all
slave-net-timeout=60
# 开启中继日志
relay_log         = mysql-relay-bin
# 
log_slave_updates = 1
# 防止改变数据
read_only         = 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重启slave，同时启动复制，还需要调整一下命令。</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>mysql&gt; CHANGE MASTER TO MASTER_HOST = &#39;119.23.46.71&#39;, MASTER_USER = &#39;root&#39;, MASTER_PASSWORD = &#39;helloroot&#39;, MASTER_PORT = 3306, MASTER_LOG_FILE = &#39;mysql-bin.000009&#39;, MASTER_LOG_POS = 346180; 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看见slave已经开始进行同步了。我们使用show slave status\\G来查看slave的状态。</p><figure><img src="https://github-images.wenzhihuai.com/images/20171118051031.png" alt="" tabindex="0"><figcaption></figcaption></figure><p>其中日志文件和POSITION不一致是合理的，配置好了的话，即使重启，也不会影响到主从复制的配置。</p><p>某天在Github上漂游，发现了阿里的canal，同时才知道上面这个业务是叫异地跨机房同步，早期，阿里巴巴B2B公司因为存在杭州和美国双机房部署，存在跨机房同步的业务需求。不过早期的数据库同步业务，主要是基于trigger的方式获取增量变更，不过从2010年开始，阿里系公司开始逐步的尝试基于数据库的日志解析，获取增量变更进行同步，由此衍生出了增量订阅&amp;消费的业务。下面是基本的原理：</p><figure><img src="https://github-images.wenzhihuai.com/images/20171120094405.png" alt="" tabindex="0"><figcaption></figcaption></figure><p>原理相对比较简单：</p><p>1.canal模拟mysql slave的交互协议，伪装自己为mysql slave，向mysql master发送dump协议<br> 2.mysql master收到dump请求，开始推送binary log给slave(也就是canal)<br> 3.canal解析binary log对象(原始为byte流)</p>`,34),v={href:"https://github.com/alibaba/canal",target:"_blank",rel:"noopener noreferrer"},o=i("figure",null,[i("img",{src:"https://github-images.wenzhihuai.com/images/20171120100237.png",alt:"",tabindex:"0"}),i("figcaption")],-1),b={href:"https://github.com/alibaba/otter",target:"_blank",rel:"noopener noreferrer"},u=i("p",null,"公司又要996了，实在是忙不过来，感觉自己写的还是急躁了点，困==",-1);function g(h,p){const n=l("ExternalLinkIcon");return r(),d("div",null,[c,i("p",null,[e("其中，配置过程如下："),i("a",v,[e("https://github.com/alibaba/canal"),s(n)]),e("，可以搭配Zookeeper使用。在ZKUI中能够查看到节点：")]),o,i("p",null,[e("一般情况下，还要配合阿里的另一个开源产品使用"),i("a",b,[e("otter"),s(n)]),e("，相关文档还是找找GitHub吧，个人搭建完了之后，用起来还是不如直接使用mysql的主主复制，而且异地机房同步这种大企业才有的业务。")]),u])}const _=a(m,[["render",g],["__file","6.数据库备份.html.vue"]]);export{_ as default};
