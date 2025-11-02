<template>
  <Layout>
    <template #contentBefore>
      <ins class="adsbygoogle"
           style="display:block; text-align:center;width: 90%;margin: 0 auto;"
           data-ad-layout="in-article"
           data-ad-format="fluid"
           data-ad-client="ca-pub-9037099208128116"
           data-ad-slot="8206550629"></ins>
    </template>

    <template #tocAfter v-if="!isMobile">
      <div class="slot-demo-block">小站收益甚微，请帮忙点击下文章上面的广告（需关闭广告屏蔽插件）也可微信支付打赏鼓励作者
      </div>
      <img class="slot-img" src="https://github-images.wenzhihuai.com/test/image-20240901210440204.png" alt=""/>
    </template>
  </Layout>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Layout} from "vuepress-theme-hope/client";

function adsenseAddLoad(): void {
  const inlineScript = document.createElement("script");
  inlineScript.type = "text/javascript";
  inlineScript.text = "(adsbygoogle = window.adsbygoogle || []).push({});";
  document.body.appendChild(inlineScript);
}

const isMobile = ref(false);

onMounted(() => {
  adsenseAddLoad();
  isMobile.value = window.innerWidth <= 768; // 768px 以下视为手机端
});
</script>

<style lang="scss" scoped>
.slot-demo-block {
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
