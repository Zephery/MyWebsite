# Jenkins的一些笔记
公司主要要开发自己的paas平台，集成了Jenkins，真的是遇到了很多很多困难，特别是在api调用的权限这一块，这里，把自己遇到的一些坑的解决方法做一下笔记吧。当然，首先要讲的，就是如何在开启安全的情况下进行API调用。

## 一、在全局安全配置中
#### 1.1 启用安全
如果勾选不对，那么Jenkins有可能崩溃掉，亲身经历，之前一直没有勾选安全域，然后授权策略为登录用户可以做任何事，之后权限这一块就彻底崩溃了，重装了又重装，才知道，需要勾选安全域。
<div align="center">

![](https://github-images.wenzhihuai.com/images/20181027023132911846860.png)

</div>

#### 1.2 跨域
同时开启跨站请求伪造保护，Jenkins的一些API需要用到的。
<div align="center">

![](https://github-images.wenzhihuai.com/images/201810270231471528136147.png)

</div>

## 二、获取TOKEN
#### 2.1 TOKEN
Jenkins的用户token可以在用户的设置下面获得，但是这种方式如果需要重装Jenkins的话，就得重新修改一次配置文件
<div align="center">

![](https://github-images.wenzhihuai.com/images/20181027023526539361439.png)

</div>

经过对[Jenkins-client](https://github.com/jenkinsci/java-client-api)的抓包分析，token可以由username+":"+password，然后进行base64加密组成，之后在token前面加上"Basic "即可，代码如下：
<div align="center">

![](https://github-images.wenzhihuai.com/images/20181027024305570167743.png)

</div>

## 三、获取Jenkins-Crumb
在远程API调用的时候，Jenkins对于某些接口的要求不仅限于Authorization，还必须要有Jenkins-Crumb，这个东西之前在进行获取的时候，有时候会变来变去，比如用curl命令和f12查看的时候发现不一致，实在受不了，感觉毫无规律可言，之后才发现上面的Authorization来直接调用接口获取的才是正确的，再然后想想，可能是之前调用api的时候，没有开启启用安全，再或者是有没有勾选上使用碎片算法。
<div align="center">

![](https://github-images.wenzhihuai.com/images/201810270251031329488332.png)

</div>

另，附上curl查询Jenkins-Crumb的命令：
```shell
curl -s 'http://admin:yourtoken@jenkins-url/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)'
```

替换掉yourtoken和jenkins-url即可。

## 四、值得注意的事

#### 4.1 API设计
Jenkins的API设计可谓是独领风骚，能把一个提交设计成这样真实佩服测试之后才发现只要提交个表单，key为json，value为值即可，其他的都不需要，这个设计我也不知道怎么来的，感觉超级坑。
<div align="center">

![](https://github-images.wenzhihuai.com/images/20181027030059348201424.png)

</div>


#### 4.2 生成构建job
由于我们是将Jenkins集成在我们自己的平台里面，并不暴露Jenkins给用户，所以，创建一个job的时候，必须由我们平台的参数往Jenkins里面提交，这一提交，发现的问题不少。
一是Jenkins的整个job的提交是由两步组成的，先是创建job，再提交配置。即：/createItem?name=xxx接口。
二是提交的配置参数，提交的是整个xml，而不是由一个一个参数组成的。对于java来说，就得使用xstream或者其他来转化，甚是折腾，如图这种转化。
<div align="center">

![](https://github-images.wenzhihuai.com/images/20181029112422597829257.png)

</div>



#### 4.3 构建的队列
在点击立即构建的时候，Jenkins是没有返回任何信息，但是在Jenkins的内部，它是通过放到队列里等待的，如果有空闲，就开始构建，否则等待，这个队列是可以获取得到的，我们从里面可以获取上一次构建的信息，是成功还是失败。这种情况下，假设我们多个人同时点击，这下子就有点慌了，如何获取到具体某个人的构建结果，有点虐心。想了半天，最终得出的事：代码相同，意味着每次构建的结果相同，为什么要允许多个人同时点击？就这么解决了：从一个job的构建队列中获取最后一次构建的信息，如果是正在构建，那么不允许构建了，直到构建结果出来。

#### 4.4 构建进度的查看
需要将Jenkins中的构建进度移植到我们自有的平台，Jenkins的构建进度时通过ajax轮询实现的，获取文本的规则主要从response header里面的两个字段获取  
（1）X-More-Data：是否有更多的数据  
（2）X-Text-Size：从开始到该次调用的文本大小  
我们是通过websocket来将文本内容推送到前端，使用的stomp协议，部分代码如下：
```java
        while (true) {
            ...
            String string = response.body().string();
            String header = response.header("X-More-Data");
            if (!Strings.isNullOrEmpty(header) || start == 0) {
                template.convertAndSend("/topic/" + uuid, string);
                String textSize = response.header("X-Text-Size");
                if (!Strings.isNullOrEmpty(textSize)) {
                    start = Integer.parseInt(textSize);
                }
                TimeUnit.SECONDS.sleep(5);
            } else {
                template.convertAndSend("/topic/" + uuid, string);
                return;
            }
        }
```


参考：  
1.[通过jenkins API去build一个job](https://www.cnblogs.com/jwentest/p/8204421.html)  
2.[Jenkins Remote API](https://wiki.jenkins.io/display/JENKINS/Remote+access+API)