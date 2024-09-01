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
    <template #tocAfter>
      <div class="slot-demo-block">小站收益甚微，请帮忙点击下文章上面的广告（需关闭广告屏蔽插件）也可微信支付打赏鼓励作者
      </div>
      <img class="slot-img" src="https://github-images.wenzhihuai.com/test/image-20240901210440204.png" alt=""/>
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
    // this.loadBaiduAdAsync();
  },
  methods: {
    adsenseAddLoad() {
      let inlineScript = document.createElement("script");
      inlineScript.type = "text/javascript";
      inlineScript.text = '(adsbygoogle = window.adsbygoogle || []).push({});'
      document.getElementsByTagName('body')[0].appendChild(inlineScript);
    },
    loadBaiduAdAsync() {
      (window.slotbydup = window.slotbydup || []).push({
        id: "u6953633",
        container: "_vyps37o7ou",
        async: true
      });
    }
  }
}
</script>


<style lang="scss" scoped>
#iframeu6953633_0 {
  width: 100% !important;
}

.slot-demo-block {
  //background-color: var(--bg-color-tertiary);
  //border-radius: 0.5rem;
  //padding: 1rem 2rem;
  margin: 1rem 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: var(--text-color-light);
}

.slot-img {
  margin: 1rem 1rem;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
