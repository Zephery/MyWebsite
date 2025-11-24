import {navbar} from "vuepress-theme-hope";

export default navbar([
    {text: "主页", link: "/"},
    {text: "好玩的", link: "/interesting/"},
    {text: "Java", link: "/java/"},
    {text: "中间件", link: "/middleware/"},
    {text: "数据", link: "/database/"},
    {text: "生活", link: "/life/"},
    {text: "Kubernetes", link: "/kubernetes/"},
    {text: "系统设计", link: "/system-design/"},
    // {text: "股票预测",  link: "/stock/"},
    {text: "赞赏", link: "/donate/"},
    {
        text: "网站相关",
        children: [
            {
                text: "关于作者",
                link: "/about-the-author/personal-life/wewe.md"
            },
            {
                text: "友链",
                link: "/link/main.md",
            },
        ],
    },
]);
