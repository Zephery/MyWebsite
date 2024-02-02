# 个人博客

不知不觉，自建站[https://www.wenzhihuai.com](https://www.wenzhihuai.com)已经接近8年了，大二的时候开启使用ssh+jsp框架来做了一个自己的网站，完全自写前后端，过程中不断进化，改用ssm，整合es做文章搜索，加kafka，加redis缓存，整体上对个人来说还是学习到了不少东西。但是随之而来的问题也不少，被挖矿攻击、服务器被黑等等。有时候因为要用服务器搞一些别的东西，直接没有备份数据库就重装，导致不少文章丢失，虽然别的平台可能零散分布。

![早年的网站截图](https://github-images.wenzhihuai.com/images/600-20240126113210252-20240131213935629.png)

总体而言，自建站对学习知识，了解整个建站的原理能够起到非常重要的作用，但是维护成本实在是太高了，每个月要支付服务器的费用，而且一旦想拿服务器来做点什么，都得提防一下会不会造成破坏。最终还是选择采用vuepress2来重构一下自建站，毕竟把markdown放到github，把图片放到cos里减少了不少的维护量。下面是使用vuepress2建站的[代码地址](https://github.com/Zephery/MyWebsite)。
## 一、博客的安装

具体[vuepress2官网](https://v2.vuepress.vuejs.org/zh/)讲解的很详细了，不用再处理什么，按照步骤创建一个项目即可，为了网站的美观，个人使用了[theme hope](https://theme-hope.vuejs.press/zh/)这款主题。




## 二、配置

导航栏、侧边栏官网也有详细的讲解，也不再阐述，需要注意的是自动目录，之前看[JavaGuide](https://github.com/Snailclimb/JavaGuide)的样式，他那边的每篇文章都需要写一次ts文件（children），后来发现官网可以把children设置为structure，即可实现根据md文件生成侧边栏目录。注意的是，这里不是根据markdown的文件名来目录名，而是取markdown文件的标题。

```json
    {
        text: "Redis",
        prefix: "redis/",
        icon: "redis",
        collapsible: false,
        children: "structure"
    },
```

## 三、为文章增加评论

[vuepress-plugin-comment2](https://plugin-comment2.vuejs.press/guide/)，使用了Giscus，Giscus绑定了github账号，所以可以从一定程度上防止被别人刷广告，需要再个人的项目Settings->General把Discussions这个选项给勾选上。

![一定要开启discussions](https://github-images.wenzhihuai.com/github/image-20240201153605099.png)

然后去config.ts配置插件。

```vue
        commentPlugin({
            provider: "Giscus",
            comment: true, //启用评论功能
            repo: "Zephery/MyWebsite", //远程仓库
            repoId: "MDEwOlJlcG9zaXRvcnkyMDM2MDIyMDQ=", //对应自己的仓库Id
            category: "General",
            categoryId: "DIC_kwDODCK5HM4Ccp32" //对应自己的分类Id
        }),
```

即可在页面上看到效果

![颜色可自定义](https://github-images.wenzhihuai.com/images/image-20240201205909384.png)



## 四、博客的部署

官网也有讲解部署的情况，具体可以看官网[Github Pages](https://v2.vuepress.vuejs.org/zh/guide/deployment.html#github-pages)，整体上看速度还是挺慢的，可以尝试去gitee上部署看一下，之后就可以在pages通过域名访问了。需要在项目下创建.github/workflows/docs.yml文件，具体配置参考[官网](https://v2.vuepress.vuejs.org/zh/guide/deployment.html#github-pages)，不需做任何改动。

## 五、Github pages自定义域名

github自带的io域名zephery.github.io，做为一名开发，肯定是用自己的域名是比较好的。需要注意下中间的红色框，前面的是分支，后面的是你项目的路径。一般默认即可，不用修改。

![pages的配置](https://github-images.wenzhihuai.com/github/image-20240201144459067.png)

购买域名->域名解析，即把我的个人域名wenzhihuai.com指向zephery.github.io(通过cname)即可，然后开启强制https。如果DNS一直没有校验通过，那么可能是CAA的原因。通过[DNS诊断工具](https://myssl.com/dns_check.html?checking=caa#dns_check)来判断。

![DNS诊断工具](https://github-images.wenzhihuai.com/github/image-20240201151253084.png)

上面的custom domain配置好了之后，但DNS一直没有校验正确，原因是CAA没有正确解析，需要加上即可。

```text
0 issue "trust-provider.com"
0 issuewild "trust-provider.com"
```



![CAA记录解析](https://github-images.wenzhihuai.com/github/image-20240201151243938.png)

之后就可以看到Github Pages的DNS校验成功，并且可以强制开启https了。

## 六、Typora图床

之前的图床使用的是七牛云和又拍云，都有免费的额度吧，不过看情况未来前景似乎经营不太好，目前改用了腾讯云。存储容量50GB，每个月外网访问流量10GB，满足个人网站使用。具体的配置过程比较简单，就不再阐述了，可以直接看[uPic](https://blog.svend.cc/upic/tutorials/tencent_cos/)的官方介绍。

## 七、为自己的内容增加收入。

有钱才有写作的动力，之前的网站开启了几年的捐赠，总共都没有收到过50块钱，只能从广告这一处想想办法，百度、腾讯广告似乎都不支持个人网站，谷歌可以。配置谷歌广告，网上的教程不少，例如: [vuepress配置谷歌广告-通过vue-google-adsense库](https://www.sofineday.com/vuepress-vue-google-adsense.html)，缺点是，大部分的文章都是需要在自己的markdown文件中新增特定的标识符。比如:

```md
# js 模板引擎 mustache 用法

<ArticleTopAd></ArticleTopAd>

## 一. 使用步骤
```

每一篇文章都要新增显然不符合懒惰的人，下面是个人尝试的解决办法，用的是vuepress2提供的slots插槽。

![谷歌广告adsense](https://github-images.wenzhihuai.com/github/image-20240201150802070.png)

上面的目的是为了获取data-ad-client和data-ad-slot，其中，data-ad-slot为广告单元，不一样。并且，配置完之后可能需要等一个小时才会生效，不要着急。

docs/.vuepress/config.ts

```vue
head: [
    [
        "script",
        {
            "data-ad-client": "ca-pub-9037099208128116",
            async: true,
            src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        }
    ],
]

...
alias: {
    "@theme-hope/components/NormalPage": path.resolve(
        __dirname,
        "./components/NormalPage.vue",
    ),
},

```

docs/.vuepress/components/NormalPage.vue

```vue
<template>
  <normal-page>
    <template #contentBefore>
      <ins class="adsbygoogle"
           style="display:block; text-align:center;width: 90%;margin: 0 auto;"
           data-ad-layout="in-article"
           data-ad-format="fluid"
           data-ad-client="ca-pub-9037099208128116"
           data-ad-slot="8206550629"></ins>
    </template>
  </normal-page>
</template>
<script>
import NormalPage from "vuepress-theme-hope/components/NormalPage.js";

export default {
  name: "adsense-inline",
  components: {
    'normal-page': NormalPage,
  },
  mounted() {
    this.adsenseAddLoad();
  },
  methods: {
    adsenseAddLoad() {
      let inlineScript = document.createElement("script");
      inlineScript.type = "text/javascript";
      inlineScript.text = '(adsbygoogle = window.adsbygoogle || []).push({});'
      document.getElementsByTagName('body')[0].appendChild(inlineScript);
    }
  }
}
</script>


<style lang="scss" scoped>
</style>

```

本地是没办法进行调试的，可以从[官网插槽演示](https://theme-hope.vuejs.press/zh/demo/slot.html)的文章中用div进行调试，等修改完毕发布之后，即可在自己的网站上看到相关的广告和收入（浏览器要把封禁广告的插件关闭）。

![出现的广告](https://github-images.wenzhihuai.com/github/image-20240201151218077.png)

![谷歌广告收入](https://github-images.wenzhihuai.com/github/image-20240201151334064.png)

收入虽然低，但是基本上个人没有成本，只需要域名的85块钱。



## 常见问题

[为什么广告不能正常显示？](https://support.google.com/adsense/thread/149452399/%E4%B8%BA%E4%BB%80%E4%B9%88%E5%B9%BF%E5%91%8A%E4%B8%8D%E8%83%BD%E6%AD%A3%E5%B8%B8%E6%98%BE%E7%A4%BA%EF%BC%9F?hl=zh-Hans)

"建议多写原创高质量的文章出来，AdSense才会匹配出合适的广告，用户感兴趣了才会浏览量增加，你才会有更多的广告收入。"

还是得多写一写优质的文章。

最后，多帮忙点一下个人网站的广告吧，感恩

网站地址：[https://www.wenzhihuai.com](https://www.wenzhihuai.com)

源码地址：[https://github.com/Zephery/MyWebsite](https://github.com/Zephery/MyWebsite)
