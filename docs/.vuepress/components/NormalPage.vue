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
    <template #contentAfter>
      <ins class="adsbygoogleAfter"
           style="display:block; text-align:center;width: 90%;margin: 0 auto;"
           data-ad-layout="in-article"
           data-ad-format="fluid"
           data-ad-client="ca-pub-9037099208128116"
           data-ad-slot="3248671754"></ins>
    </template>
    <template #tocAfter>
      <ins class="adsbygoogleRight"
           style="display:block"
           data-ad-client="ca-pub-9037099208128116"
           data-ad-slot="3862119113"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
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
    this.adsenseAddLoadAfter();
    this.adsenseAddLoadRight();
  },
  methods: {
    adsenseAddLoad() {
      let inlineScript = document.createElement("script");
      inlineScript.type = "text/javascript";
      inlineScript.text = '(adsbygoogle = window.adsbygoogle || []).push({});'
      document.getElementsByTagName('body')[0].appendChild(inlineScript);
    },
    adsenseAddLoadAfter() {
      let inlineScript = document.createElement("script");
      inlineScript.type = "text/javascript";
      inlineScript.text = '(adsbygoogleAfter = window.adsbygoogleAfter || []).push({});'
      document.getElementsByTagName('body')[0].appendChild(inlineScript);
    },
    adsenseAddLoadRight() {
      let inlineScript = document.createElement("script");
      inlineScript.type = "text/javascript";
      inlineScript.text = '(adsbygoogleRight = window.adsbygoogleRight || []).push({});'
      document.getElementsByTagName('body')[0].appendChild(inlineScript);
    },
  }
}
</script>


<style lang="scss" scoped>
</style>
