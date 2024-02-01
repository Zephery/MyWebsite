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
      <UnionAd id="u6953633"></UnionAd>
    </template>
  </normal-page>
</template>
<script>
import NormalPage from "vuepress-theme-hope/components/NormalPage.js";
import {createUnionAdComponent} from 'union-ad-vue';
import {h} from 'vue';

export default {
  name: "adsense-inline",
  components: {
    'normal-page': NormalPage,
    UnionAd: createUnionAdComponent(h)

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
