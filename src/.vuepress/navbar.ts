import {navbar} from "vuepress-theme-hope";

export default navbar([
    {text: "主页", icon: "home", link: "/"},
    {text: "好玩的", icon: "interesting", link: "/interesting/"},
    {text: "Java", icon: "java", link: "/java/"},
    {text: "中间件", icon: "middleware", link: "/middleware/"},
    {text: "数据", icon: "database", link: "/database/"},
    {text: "生活", icon: "life", link: "/life/"},
    {text: "Kubernetes", icon: "Kubernetes", link: "/kubernetes/"},
    {text: "系统设计", icon: "system-design", link: "/system-design/"},
    // {text: "股票预测", icon: "stock", link: "/stock/"},
    {text: "赞赏", icon: "donate", link: "/donate/"},
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
