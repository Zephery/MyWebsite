import {sidebar} from "vuepress-theme-hope";

import {aboutTheAuthor} from "./about-the-author.js";
import {books} from "./books.js";
import {highQualityTechnicalArticles} from "./high-quality-technical-articles.js";
import {database} from "./database.js";

export default sidebar({
    // 应该把更精确的路径放置在前边
    "/database/": database,
    "/books/": books,
    "/about-the-author/": aboutTheAuthor,
    "/high-quality-technical-articles/": highQualityTechnicalArticles,
    "/zhuanlan/": [
        "java-mian-shi-zhi-bei",
        "back-end-interview-high-frequency-system-design-and-scenario-questions",
        "handwritten-rpc-framework",
        "source-code-reading",
    ],
    // 必须放在最后面
    "/": [
        {
            text: "Java",
            icon: "java",
            collapsible: true,
            prefix: "java/",
            children: [
                "JVM调优参数",
                "lucene搜索原理",
                "es8.0练习",
                "serverlog",
                "一次jvm调优过程",
                "内存屏障",
                "基于kubernetes的分布式限流",
                "锁",
            ],
        },
        {
            text: "个人网站",
            icon: "computer",
            prefix: "personalwebsite/",
            collapsible: true,
            children: [
                "1.历史与架构",
                "2.Lucene的使用",
                "3.定时任务",
                "4.日志系统",
                "5.小集群部署",
                "6.数据库备份",
                "7.那些牛逼的插件",
                "8.基于贝叶斯的情感分析",
                "9.网站性能优化"
            ]
        }
    ],
});
