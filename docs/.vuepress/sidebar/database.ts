import {arraySidebar} from "vuepress-theme-hope";

export const database = arraySidebar([
    {
        text: "数据库",
        icon: "database",
        collapsible: true,
        children: [
            {
                text: "基础",
                icon: "basic",
                children: [
                    "basis",
                    "nosql",
                    "character-set",
                    {
                        text: "SQL",
                        icon: "SQL",
                        prefix: "sql/",
                        collapsible: true,
                        children: [
                            "sql-syntax-summary",
                            "sql-questions-01",
                            "sql-questions-02",
                            "sql-questions-03",
                            "sql-questions-04",
                            "sql-questions-05",
                        ],
                    },
                ],
            },
            {
                text: "MySQL",
                prefix: "mysql/",
                icon: "mysql",
                children: [
                    "1mysql",
                    "gap锁",
                    "mysql-high-performance-optimization-specification-recommendations",
                    {
                        text: "重要知识点",
                        icon: "star",
                        collapsible: true,
                        children: [
                            "mysql-index",
                            {
                                text: "MySQL三大日志详解",
                                link: "mysql-logs",
                            },
                            "transaction-isolation-level",
                            "innodb-implementation-of-mvcc",
                            "how-sql-executed-in-mysql",
                            "mysql-query-cache",
                            "mysql-query-execution-plan",
                            "mysql-auto-increment-primary-key-continuous",
                            "some-thoughts-on-database-storage-time",
                            "index-invalidation-caused-by-implicit-conversion",
                        ],
                    },
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
        ],
    },
]);
