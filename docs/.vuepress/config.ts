import {defineUserConfig} from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
    dest: "./dist",
    title: "个人博客",
    description: "个人博客",
    lang: "zh-CN",
    head: [
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
