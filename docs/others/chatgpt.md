# 微信公众号-chatgpt智能客服搭建
想体验的可以去微信上搜索【旅行的树】公众号。

## 一、ChatGPT注册

### 1.1 短信手机号申请

openai提供服务的区域，美国最好，这个解决办法是搞个翻墙，或者买一台美国的服务器更好。

国外邮箱，hotmail或者google最好，qq邮箱可能会对这些平台进行邮件过滤。

国外手机号，没有的话也可以去https://sms-activate.org，费用大概需要1美元，这个网站记得也用国外邮箱注册，需要先充值，使用支付宝支付。

<img src="https://p.ipic.vip/vfh7kn.png" alt="image-20230220172107296" style="zoom:30%;" />

之后再搜索框填openai进行下单购买即可。

<img src="https://ask.qcloudimg.com/http-save/6854995/ee59335a8cc5662585f2be689213a0d7.png?imageView2/2/w/1620" alt="img" style="zoom:67%;" />



### 1.2 云服务器申请

openai在国内不提供服务的，而且也通过ip识别是不是在国内，解决办法用vpn也行，或者，自己去买一台国外的服务器也行。我这里使用的是腾讯云轻量服务器，最低配置54元/月，选择windows的主要原因毕竟需要注册openai，需要看页面，同时也可以搭建nginx，当然，用ubuntu如果能自己搞界面也行。

<img src="https://p.ipic.vip/4yrkq1.png" alt="image-20230221193455384" style="zoom:50%;" />

### 1.3 ChatGPT注册

购买完之后，就可以直接打开openai的官网了，然后去https://platform.openai.com/signup官网里注册，注册过程具体就不讲了，讲下核心问题——短信验证码

<img src="https://p.ipic.vip/oz1r8x.png" alt="image-20230222104357230" style="zoom:80%;" />

然后回sms查看验证码。



<img src="https://p.ipic.vip/28gfhn.png" alt="image-20230222104225722" style="zoom:50%;" />

注册成功之后就可以在chatgpt里聊天啦，能够识别各种语言，发起多轮会话的时候，可能回出现访问超过限制什么的。

<img src="https://p.ipic.vip/mrw3cz.png" alt="image-20230220173335691" style="zoom:50%;" />

通过chatgpt聊天不是我们最终想要的，我们需要的是在微信公众号也提供智能客服的聊天回复，所以我们需要在通过openai的api来进行调用。

<img src="https://p.ipic.vip/ykhrvs.png" alt="image-20230222104316514" style="zoom:30%;" />


## 二、搭建nginx服务器

跟页面一样，OpenAI的调用也是不能再国内访问的，这里，我们使用同一台服务器来搭建nginx，还是保留使用windows吧，主要还是得注意下面这段话，如果API key被泄露了，OpenAI可能会自动重新更新你的API key，这个规则似乎是API key如果被多个ip使用，就会触发这个规则，调试阶段还是尽量使用windows的服务器吧，万一被更新了，还能去页面上重新找到。

```text
Do not share your API key with others, or expose it in the browser or other client-side code. In order to protect the security of your account, OpenAI may also automatically rotate any API key that we've found has leaked publicly.
```

windows的安装过程参考网上的来，我们只需要添加下面这个配置即可，原理主要是将调用OpenAI的接口全部往官网转发。

```nginx
    location /v1/completions {
      proxy_pass https://api.openai.com/v1/completions;
    }
```

然后使用下面的方法进行调试即可：

```http
POST http://YOUR IP/v1/completions
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "model": "text-davinci-003",
  "prompt": "Say this is a test",
  "max_tokens": 7,
  "temperature": 0
}
```


## 三、公众号开发

网上有很多关于微信通过chatgpt回复的文章，有些使用自己微信号直接做为载体，因为要扫码网页登陆，而且是网页端在国外，很容易被封；有些是使用公众号，相对来说，公众号被封也不至于导致个人微信号出问题。

### 3.1 微信云托管

微信公众平台提供了微信云托管，无需鉴权，比其他方式都方便不少，可以免费试用3个月，继续薅羊毛，当然，如果自己开发能力足够，也可以自己从0开始开发。

<img src="https://p.ipic.vip/svjm7s.png" alt="image-20230220192603751" style="zoom:30%;" />

提供了各种语言的模版，方便快速开发，OpenAI官方提供的sdk是node和python，这里我们选择express（node）。

<img src="https://p.ipic.vip/kkjdna.png" alt="image-20230220201004069" style="zoom:30%;" />



### 3.2 一个简单ChatGPT简单回复

微信官方的源码在这，https://github.com/WeixinCloud/wxcloudrun-express，我们直接fork一份自己来开发。

一个简单的消息回复功能（无db），直接在我们的index.js里添加如下代码。

```javascript
const configuration = new Configuration({
    apiKey: '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',
    basePath: 'http://43.153.15.174/v1'
});
const openai = new OpenAIApi(configuration);

async function simpleResponse(prompt) {
    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 1024,
        temperature: 0.1,
    });
    const response = (completion?.data?.choices?.[0].text || 'AI 挂了').trim();
    return strip(response, ['\n', 'A: ']);
}

app.post("/message/simple", async (req, res) => {
    console.log('消息推送', req.body)
    // 从 header 中取appid，如果 from-appid 不存在，则不是资源复用场景，可以直接传空字符串，使用环境所属账号发起云调用
    const appid = req.headers['x-wx-from-appid'] || ''
    const {ToUserName, FromUserName, MsgType, Content, CreateTime} = req.body
    console.log('推送接收的账号', ToUserName, '创建时间', CreateTime)
    if (MsgType === 'text') {
        message = await simpleResponse(Content)
        res.send({
            ToUserName: FromUserName,
            FromUserName: ToUserName,
            CreateTime: CreateTime,
            MsgType: 'text',
            Content: message,
        })
    } else {
        res.send('success')
    }
})
```

本地可以直接使用http请求测试，成功调用之后直接提交发布即可，在微信云托管上需要先授权代码库，即可使用云托管的流水线，一键发布。注意，api_base和api_key可以填写在服务设置-基础信息那里，一个是OPENAI_API_BASE，一个是OPENAI_API_KEY，服务会自动从环境变量里取。

### 3.3 服务部署

提交代码只github或者gitee都可以，值得注意的是，OpenAI判断key泄露的规则，不知道是不是判断调用的ip地址不一样，还是github的提交记录里含有这块，有点玄学，同样的key本地调用一次，然后在云托管也调用的话，OpenAI就很容易把key给重新更新。

<img src="https://p.ipic.vip/wfekdb.png" alt="image-20230220203313790" style="zoom:50%;" />

部署完之后，云托管也提供了云端调试功能，相当于在服务里发送了http请求。这一步很重要，如果没有调用成功，则无法进行云托管消息推送。

<img src="https://p.ipic.vip/129qih.png" alt="image-20230220203711436" style="zoom:30%;" />

这里填上你自己的url，我们这里配置的是/meesage/simple，如果没有成功，需要进行下面步骤进行排查：

（1）服务有没有正常启动，看日志

（2）端口有没有设置错误，这个很多次没有注意到

<img src="https://p.ipic.vip/dn1f67.png" alt="image-20230220203445297" style="zoom:50%;" />

保存成功之后，就可以在微信公众号里测试了。

<img src="https://p.ipic.vip/p82i06.png" alt="image-20230221134250689" style="zoom:50%;" />

体验还可以

## 四、没有回复（超时回复问题）

很多OpenAI的回答都要几十秒，有的甚至更久，比如对chatgpt问“写一篇1000字关于深圳的文章”，就需要几十秒，而微信的主动回复接口，是需要我们3s内返回给用户。

订阅号的消息推送分几种：

1. **被动消息回复**：指用户给公众号发一条消息，系统接收到后，可以回复一条消息。
2. **主动回复/客服消息**：可以脱离被动消息的5秒超时权限，在48小时内可以主动回复。但需要公众号完成微信认证。

根据微信官方文档，没有认证的公众号是没有调用主动回复接口权限的，https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Explanation_of_interface_privileges.html

<img src="https://p.ipic.vip/eeogjb.png" alt="image-20230221100251825" style="zoom:40%;" />

对于有微信认证的订阅号或者服务号，可以调用微信官方的/cgi-bin/message/custom/send接口来实现主动回复，但是对于个人的公众号，没有权限调用，只能尝试别的办法。想来想去，只能在3s内返回让用户重新复制发送的信息，同时后台里保存记录异步调用，用户重新发送的时候再从数据库里提取回复。

1.先往数据库存一条 回复记录，把用户的提问存下来，以便后续查询。设置回复的内容为空，设置状态为 回复中（thinking）。

```javascript
  // 因为AI响应比较慢，容易超时，先插入一条记录，维持状态，待后续更新记录。
  await Message.create({
    fromUser: FromUserName,
    response: '',
    request: Content,
    aiType: AI_TYPE_TEXT, // 为其他AI回复拓展，比如AI作画
  });
```

2.抽象一个 chatGPT 请求方法 `getAIMessage`，函数内部得到 GPT 响应后，会更新之前那条记录（通过用户id & 用户提问 查询），把状态更新为 已回答（answered），并把回复内容更新上。

```javascript
 // 成功后，更新记录
  await Message.update(
    {
      response: response,
      status: MESSAGE_STATUS_ANSWERED,
    },
    {
      where: {
        fromUser: FromUserName,
        request: Content,
      },
    },
  );
```

3.前置增加一些判断，当用户在请求时，如果 AI 还没完成响应，直接回复用户 AI 还在响应，让用户过一会儿再重试。如果 AI 此时已响应完成，则直接把 内容返回给用户。

```javascript
  // 找一下，是否已有记录
  const message = await Message.findOne({
    where: {
      fromUser: FromUserName,
      request: Content,
    },
  });

  // 已回答，直接返回消息
  if (message?.status === MESSAGE_STATUS_ANSWERED) {
    return `[GPT]: ${message?.response}`;
  }

  // 在回答中
  if (message?.status === MESSAGE_STATUS_THINKING) {
    return AI_THINKING_MESSAGE;
  }
```

4.最后就是一个 `Promise.race`

```javascript
  const message = await Promise.race([
    // 3秒微信服务器就会超时，超过2.9秒要提示用户重试
    sleep(2900).then(() => AI_THINKING_MESSAGE),
    getAIMessage({ Content, FromUserName }),
  ]);
```  
这样子大概就能实现超时之前返回了。


## 五、会话保存

掉接口是一次性的，一次接口调用完之后怎么做到下一次通话的时候，还能继续保持会话，是不是应该类似客户端与服务端那种有个session这种，但是实际上在openai里是没有session这种东西的，令人震惊的是，chatgpt里是通过前几次会话拼接起来一起发送给chatgpt里的，需要通过回车符来拼接。

```javascript
async function buildCtxPrompt({ FromUserName }) {
  // 获取最近10条对话
  const messages = await Message.findAll({
    where: {
      fromUser: FromUserName,
      aiType: AI_TYPE_TEXT,
    },
    limit: 10,
    order: [['updatedAt', 'ASC']],
  });
  // 只有一条的时候，就不用封装上下文了
  return messages.length === 1
    ? messages[0].request
    : messages
        .map(({ response, request }) => `Q: ${request}\n A: ${response}`)
        .join('\n');
}
```

之后就可以实现会话之间的保存通信了。

<img src="https://p.ipic.vip/52pp5f.png" alt="image-20230218203309437" style="zoom:33%;" />

## 六、其他问题

### 6.1 限频

chatgpt毕竟也是新上线的，火热是肯定的，聊天窗口只能开几个，api调用的话，也是有限频的，但是规则具体没有找到，只是在调用次数过多的时候会报429的错误，出现之后就需要等待一个小时左右。

对于这个的解决办法只能是多开几个账号，一旦429就只能换个账号重试了。

### 6.2 秘钥key被更新

没有找到详细的规则，凭个人经验的话，可能github提交的代码会被扫描，可能ip调用的来源不一样，最好还是开发一个秘钥，生产一个秘钥吧。

### 6.3 为啥和官网的回复不一样

我们这里用的模型算法是text-davinci-003，具体可以参考：https://platform.openai.com/docs/models/overview，也算是一个比较老的样本了吧

<img src="https://p.ipic.vip/qh4efq.png" alt="image-20230221192417900" style="zoom:50%;" />

从官方文档来看，官方服务版的 ChatGPT 的模型并非基础版的`text-davinci-003`，而是经过了「微调：fine-tunes」。文档地址在这：[platform.openai.com/docs/guides…](https://link.juejin.cn/?target=https%3A%2F%2Fplatform.openai.com%2Fdocs%2Fguides%2Ffine-tuning)

### 6.4 玄学挂掉

有时候消息没有回复，真的不是我们的问题，chatgpt毕竟太火了，官网的这个能力都经常挂掉，也可以订阅官网修复的通知，一旦修复则会发邮件告知你。

<img src="https://p.ipic.vip/4hod0s.png" alt="image-20230221175150025" style="zoom:50%;" />

参考：https://juejin.cn/post/7200769439335546935



## 最后
记得去微信关注【旅行的树】公众号体验  
代码地址：https://github.com/Zephery/wechat-gpt
