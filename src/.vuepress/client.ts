import {defineClientConfig} from "vuepress/client";
import Layout from "./layouts/NormalPage.vue";
import {setupRunningTimeFooter} from "vuepress-theme-hope/presets/footerRunningTime.js";

export default defineClientConfig({
    setup() {
        const startDate = new Date("2017-04-01");
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - startDate.getTime());
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
        const diffDays = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));


        setupRunningTimeFooter(
            startDate,
            {
                "/": "已运行 " + diffYears + "年 " + diffDays + " 天 :hour 小时 :minute 分钟 :second 秒"
            },
            true,
        );
    },
    // 你可以在这里添加或覆盖布局
    layouts: {
        // 一个主页布局，带有自定义的 Hero 标志
        // 例如，在这里我们将 vuepress-theme-hope 的默认布局更改为 layouts/Layout.vue
        Layout,
    },
});