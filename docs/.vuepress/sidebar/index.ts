import {sidebar} from "vuepress-theme-hope";

import {aboutTheAuthor} from "./about-the-author.js";
import {books} from "./books.js";
import {highQualityTechnicalArticles} from "./high-quality-technical-articles.js";
import {database} from "./database.js";
import {donate} from "./donate.js";
import {bigdata} from "./bigdata.js";
import {personalWebsite} from "./personalWebsite.js";
import {kubernetes} from "./kubernetes.js";

export default sidebar({
    // 应该把更精确的路径放置在前边
    "/database/": database,
    "/bigdata/": bigdata,
    "/personalWebsite/": personalWebsite,
    "/kubernetes/": kubernetes,
    "/books/": books,
    "/donate/": donate,
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
            collapsible: false,
            prefix: "java/",
            children: [
                "JVM调优参数",
                "lucene搜索原理",
                "serverlog",
                "一次jvm调优过程",
                "内存屏障",
                "基于kubernetes的分布式限流",
                "锁",
            ],
        },
    ],
});
