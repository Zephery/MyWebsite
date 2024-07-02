import {sidebar} from "vuepress-theme-hope";

import {aboutTheAuthor} from "./about-the-author.js";
import {books} from "./books.js";
import {highQualityTechnicalArticles} from "./high-quality-technical-articles.js";
import {database} from "./database.js";
import {donate} from "./donate.js";
import {bigdata} from "./bigdata.js";
import {kubernetes} from "./kubernetes.js";
import {interesting} from "./interesting";
import {middleware} from "./middleware.js";
import {life} from "./life.js";
import {link} from "./link.js";
import {systemDesign} from "./system-design";
import {java} from "./java.js";
import {stock} from "./stock.js";

export default sidebar({
    // 必须放在最后面
    "/": [
        {
            text: "首页",
            icon: "home",
            collapsible: false,
            children: "structure"
        },
    ],
    // 应该把更精确的路径放置在前边
    "/interesting/": interesting,
    "/java/": java,
    "/database/": database,
    "/link/": link,
    "/bigdata/": bigdata,
    "/middleware/": middleware,
    "/kubernetes/": kubernetes,
    "/books/": books,
    "/stock/": stock,
    "/system-design/": systemDesign,
    "/donate/": donate,
    "/life/": life,
    "/about-the-author/": aboutTheAuthor,
    "/high-quality-technical-articles/": highQualityTechnicalArticles,
    "/zhuanlan/": [
        "java-mian-shi-zhi-bei",
        "back-end-interview-high-frequency-system-design-and-scenario-questions",
        "handwritten-rpc-framework",
        "source-code-reading",
    ],

});
