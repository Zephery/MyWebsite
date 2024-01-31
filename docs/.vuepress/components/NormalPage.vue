<template>
  <normal-page>
    <template #contentBefore>
      <div class="slot-demo-block">
        <ins class="adsbygoogle"
             style="display:block; text-align:center;"
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-9037099208128116"
             data-ad-slot="8206550629"></ins>
      </div>
    </template>
    <template #tocAfter>
      <div class="slot-demo-block">
        <ins class="adsbygoogle"
             style="display:block; text-align:center;"
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-9037099208128116"
             data-ad-slot="8206550629"></ins>
      </div>
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
.slot-demo-inline {
  display: inline-block;
  background-color: var(--bg-color-tertiary);
  border-radius: 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  width: 2rem;
  height: 2rem;
  margin: 0.25em;
}

.slot-demo-block {
  background-color: var(--bg-color-tertiary);
  border-radius: 0.5rem;
  padding: 1rem 2rem;
  margin: 0.5rem 1rem;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: var(--text-color-light);
}
</style>
