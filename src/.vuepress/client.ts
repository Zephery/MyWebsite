import { defineClientConfig } from "vuepress/client";
import Layout from "./layouts/NormalPage.vue";

export default defineClientConfig({
    // 你可以在这里添加或覆盖布局
    layouts: {
        // 一个主页布局，带有自定义的 Hero 标志
        // 例如，在这里我们将 vuepress-theme-hope 的默认布局更改为 layouts/Layout.vue
        Layout,
    },
});