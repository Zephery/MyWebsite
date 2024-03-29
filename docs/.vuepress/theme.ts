import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar/index.js";


export default hopeTheme({
        hostname: "http://www.wenzhihuai.com/",
        logo: "https://github-images.wenzhihuai.com/images/logo.png",
        favicon: "/favicon.ico",

        // iconAssets: "//at.alicdn.com/t/c/font_2922463_o9q9dxmps9.css",

        author: {
            name: "Zephery",
            url: "https://wenzhihuai.com/article/",
        },

        repo: "https://github.com/Zephery/MyWebsite",
        docsDir: "docs",
        // 纯净模式：https://theme-hope.vuejs.press/zh/Zephery/interface/pure.html
        pure: true,
        breadcrumb: false,
        navbar,
        sidebar,
        footer:
            '<a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备17092242号-1</a><a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral"  target="_blank"><img src="https://github-images.wenzhihuai.com/images/youpailogo6.png" style="float: left;width: 6%;"/></a>',
        displayFooter: true,

        pageInfo: [
            "Author",
            "Category",
            "Tag",
            // "Date",
            "Original",
            "Word",
            "ReadingTime",
        ],


        blog: {
            intro: "/about-the-author/",
            sidebarDisplay: "mobile",
            medias: {
                Zhihu: "https://www.zhihu.com/people/javaZephery",
                Github: "https://github.com/Zephery",
                Gitee: "https://gitee.com/zephery.com.cn"
            },
        },

        plugins: {
            components: {
                rootComponents: {
                    // https://plugin-components.vuejs.press/zh/Zephery/utilities/notice.html#%E7%94%A8%E6%B3%95
                    notice: [
                        // {
                        //   path: "/",
                        //   title: "Java学习路线最新版",
                        //   showOnce: true,
                        //   content:
                        //     "花了一个月零碎的时间，我根据当下 Java 后端求职和招聘的最新要求，对之前写的 Java 后端学习路线进行了全面的优化和改进。这可能是你所见过的最用心、最全面的 Java 后端学习路线，共 4w+ 字。",
                        //   actions: [
                        //     {
                        //       text: "免费获取",
                        //       link: "https://mp.weixin.qq.com/s/6nWgi22UT5Y7nJiPfQ_XIw",
                        //       type: "primary",
                        //     },
                        //   ],
                        // },
                    ],
                },
            },
            blog: true,
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

            mdEnhance: {
                align: true,
                codetabs: true,
                figure: true,
                gfm: true,
                hint: true,
                tasklist: true,
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
