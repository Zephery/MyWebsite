import {navbar} from "vuepress-theme-hope";
import {others} from "./sidebar/others";

export default navbar([
    {text: "Java", icon: "java", link: "/index"},
    {text: "数据库", icon: "database", link: "/database/"},
    {text: "大数据", icon: "bigdata", link: "/bigdata/"},
    {text: "Kubernetes", icon: "Kubernetes", link: "/kubernetes/"},
    {text: "个人网站", icon: "personalWebsite.ts", link: "/personalWebsite/"},
    {text: "其他", icon: "others", link: "/others/"},
    {text: "捐赠", icon: "donate", link: "/donate/"},
    {
        text: "网站相关",
        icon: "about",
        children: [
            {text: "关于作者", icon: "zuozhe", link: "/about-the-author/"},
            {
                text: "生活",
                icon: "life",
                link: "/life/",
            },
        ],
    },
]);
