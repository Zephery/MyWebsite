import {navbar} from "vuepress-theme-hope";
import {others} from "./sidebar/others";

export default navbar([
    {text: "Java", icon: "java", link: "/index"},
    {text: "中间件", icon: "middleware", link: "/middleware/"},
    {text: "数据库", icon: "database", link: "/database/"},
    {text: "大数据", icon: "bigdata", link: "/bigdata/"},
    {text: "Kubernetes", icon: "Kubernetes", link: "/kubernetes/"},
    {text: "系统设计", icon: "system-design", link: "/system-design/"},
    {text: "好玩的", icon: "others", link: "/others/"},
    {text: "捐赠", icon: "donate", link: "/donate/"},
    {
        text: "网站相关",
        icon: "about",
        children: [
            {
                text: "关于作者",
                icon: "zuozhe",
                link: "/about-the-author/personal-life/wewe.md"
            },
            {
                text: "友链",
                icon: "link",
                link: "/link/main.md",
            },
        ],
    },
]);
