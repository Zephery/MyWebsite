import {sidebar} from "vuepress-theme-hope";

import {aboutTheAuthor} from "./about-the-author.js";
import {books} from "./books.js";
import {highQualityTechnicalArticles} from "./high-quality-technical-articles.js";
import {database} from "./database.js";
import {donate} from "./donate.js";
import {bigdata} from "./bigdata.js";
import {kubernetes} from "./kubernetes.js";
import {others} from "./others";
import {middleware} from "./middleware.js";
import {life} from "./life.js";
import {link} from "./link.js";
import {systemDesign} from "./system-design";

export default sidebar({
    // 应该把更精确的路径放置在前边
    "/database/": database,
    "/link/": link,
    "/bigdata/": bigdata,
    "/middleware/": middleware,
    "/kubernetes/": kubernetes,
    "/books/": books,
    "/system-design/": systemDesign,
    "/donate/": donate,
    "/life/": life,
    "/others/": others,
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
            children: "structure"
        },
    ],
});
