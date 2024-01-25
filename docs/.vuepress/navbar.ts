import {navbar} from "vuepress-theme-hope";

export default navbar([
    {text: "Java", icon: "java", link: "/index"},
    {text: "数据库", icon: "database", link: "/database/"},
    {text: "技术书籍", icon: "book", link: "/books/"},
    {
        text: "网站相关",
        icon: "about",
        children: [
            {text: "关于作者", icon: "zuozhe", link: "/about-the-author/"},
            {
                text: "更新历史",
                icon: "history",
                link: "/timeline/",
            },
        ],
    },
    {text: "捐赠", icon: "donate", link: "/donate/"},
]);
