import {arraySidebar} from "vuepress-theme-hope";

export const personalWebsite = arraySidebar([
    {
        text: "个人网站",
        icon: "bigdata",
        collapsible: false,
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
        ],
    },
]);
