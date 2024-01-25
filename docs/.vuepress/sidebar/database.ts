import {arraySidebar} from "vuepress-theme-hope";

export const database = arraySidebar([
    {
        text: "MySQL",
        prefix: "mysql/",
        icon: "mysql",
        collapsible: false,
        children: [
            "1mysql.md",
            "gap锁",
            "执行计划explain",
            "数据库缓存"
        ],
    },
    {
        text: "Redis",
        prefix: "redis/",
        icon: "redis",
        collapsible: false,
        children: [
            "cache-basics",
            "redis-questions-01",
            "redis-questions-02",
        ],
    },
    {
        text: "Elasticsearch",
        prefix: "elasticsearch/",
        icon: "elasticsearch",
        collapsible: false,
        children: [
            "【elasticsearch】搜索过程详解",
            "elasticsearch源码debug.md"
        ],
    },
    {
        text: "MongoDB",
        prefix: "mongodb/",
        icon: "mongodb",
        collapsible: false,
        children: ["mongodb-questions-01", "mongodb-questions-02"],
    },
]);
