import {defineUserConfig} from "vuepress";
import theme from "./theme.js";
import {commentPlugin} from "vuepress-plugin-comment2";
import {mdEnhancePlugin} from "vuepress-plugin-md-enhance";

export default defineUserConfig({
    dest: "./dist",
    title: "个人博客",
    description: "个人博客",
    lang: "zh-CN",
    plugins: [
        mdEnhancePlugin({
            // 启用 figure
            figure: true,
            // 启用图片懒加载
            imgLazyload: true,
            // 启用图片标记
            imgMark: true,
            // 启用图片大小
            imgSize: true,
        }),
        // https://plugin-comment2.vuejs.press/zh/config/giscus.html#darktheme
        commentPlugin({
            provider: "Giscus",
            comment: true, //启用评论功能
            repo: "Zephery/MyWebsite", //远程仓库
            repoId: "MDEwOlJlcG9zaXRvcnkyMDM2MDIyMDQ=", //对应自己的仓库Id
            category: "General",
            categoryId: "DIC_kwDODCK5HM4Ccp32" //对应自己的分类Id
        }),
    ],
    head: [
        [
            "script",
            {
                "data-ad-client": "ca-pub-9037099208128116",
                async: true,
                src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            }
        ],
        // meta
        ["meta", {name: "robots", content: "all"}],
        ["meta", {name: "author", content: "个人博客"}],
        [
            "meta",
            {
                "http-equiv": "Cache-Control",
                content: "no-cache, no-store, must-revalidate",
            },
        ],
        ["meta", {"http-equiv": "Pragma", content: "no-cache"}],
        ["meta", {"http-equiv": "Expires", content: "0"}],
        [
            "meta",
            {
                name: "keywords",
                content:
                    "Java基础, 多线程, JVM, 虚拟机, 数据库, MySQL, Spring, Redis, MyBatis, 系统设计, 分布式, RPC, 高可用, 高并发",
            },
        ],
        [
            "meta",
            {
                name: "description",
                content:
                    "Java基础, 多线程, JVM, 虚拟机, 数据库, MySQL, Spring, Redis, MyBatis, 系统设计, 分布式, RPC, 高可用, 高并发",
            },
        ],
        ["meta", {name: "apple-mobile-web-app-capable", content: "yes"}],
        // 添加百度统计
        [
            "script",
            {},
            `var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?e580b8db831811a4aaf4a8f3e30034dc";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();`,
        ],
    ],

    theme,

    pagePatterns: ["**/*.md", "!**/*.snippet.md", "!.vuepress", "!node_modules"],

    shouldPrefetch: false,
});
