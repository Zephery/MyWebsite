import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";
import {dateSorter} from "@vuepress/helper";
import sidebar from "./sidebar/index.js";


export default hopeTheme({
        hostname: "https://www.wenzhihuai.com/",
        logo: "https://github-images.wenzhihuai.com/images/logo.png",
        favicon: "/favicon.ico",
        sidebarSorter: ["readme", "order", "date-desc", "title", "filename"],
        markdown: {
            align: true,
            mermaid: true,
            imgSize: true,
            imgLazyload: true,
        },
        author: {
            name: "Zephery",
            url: "https://wenzhihuai.com/article/",
        },

        repo: "https://github.com/Zephery/MyWebsite",
        docsDir: "src",
        // 纯净模式：https://theme-hope.vuejs.press/zh/Zephery/interface/pure.html
        // pure: true,
        breadcrumb: false,
        navbar,
        sidebar,
        footer:
            '<a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备17092242号-1</a>',
        displayFooter: true,

        pageInfo: [
            "Author",
            "Category",
            "Tag",
            "Date",
            "Original",
            "Word",
            "ReadingTime",
        ],

        blog: {
            intro: "/about-the-author/",
            medias: {
                Zhihu: "https://www.zhihu.com/people/wen-zhi-huai-83",
                Github: "https://github.com/Zephery",
                Gitee: "https://gitee.com/zephery.com.cn",
                BiliBili: "https://space.bilibili.com/3118581",
                WechatPay: "https://wenzhihuai.com/donate",
                VuePressThemeHope: {
                    icon: "https://theme-hope-assets.vuejs.press/logo.svg",
                    link: "https://theme-hope.vuejs.press",
                },
            },
        },
        plugins: {
            comment: {
                provider: "Giscus",
                comment: true, //启用评论功能
                repo: "Zephery/MyWebsite", //远程仓库
                repoId: "MDEwOlJlcG9zaXRvcnkyMDM2MDIyMDQ=", //对应自己的仓库Id
                category: "General",
                categoryId: "DIC_kwDODCK5HM4Ccp32" //对应自己的分类Id
            },
            components: {
                components: [
                    "SiteInfo",
                    "BiliBili"
                ]
            },
            icon: {
                prefix: "fa6-solid:",
            },
            blog: {
                excerptLength: 50,
                type: [
                    {
                        key: "slide",
                        filter: (page) => page.frontmatter.layout === "Slide",
                    },
                    {
                        key: "original",
                        filter: (page) => !!page.frontmatter.original,
                        sorter: (pageA, pageB) =>
                            -dateSorter(pageA.frontmatter.date, pageB.frontmatter.date),
                    },
                ],
            },
            copyright: {
                author: "wenzhihuai.com",
                license: "MIT",
                triggerLength: 100,
                maxLength: 700,
                canonical: "https://wenzhihuai.com/",
                global: true,
            },

            feed: {
                atom: true,
                json: true,
                rss: true,
            },


            search: {
                isSearchable: (page) => page.path !== "/",
                maxSuggestions: 10,
            },
        },
    },
    {
        custom: true
    }
);
