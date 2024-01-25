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
        children: [
            "cache-basics",
            "redis-questions-01",
            "redis-questions-02",
            {
                text: "重要知识点",
                icon: "star",
                collapsible: true,
                children: [
                    "3-commonly-used-cache-read-and-write-strategies",
                    "redis-data-structures-01",
                    "redis-data-structures-02",
                    "redis-persistence",
                    "redis-memory-fragmentation",
                    "redis-common-blocking-problems-summary",
                    "redis-cluster",
                ],
            },
        ],
    },
    {
        text: "Elasticsearch",
        prefix: "elasticsearch/",
        icon: "elasticsearch",
        collapsible: true,
        children: ["elasticsearch-questions-01"],
    },
    {
        text: "MongoDB",
        prefix: "mongodb/",
        icon: "mongodb",
        collapsible: true,
        children: ["mongodb-questions-01", "mongodb-questions-02"],
    },
]);
