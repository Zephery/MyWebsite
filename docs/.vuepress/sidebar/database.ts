import {arraySidebar} from "vuepress-theme-hope";

export const database = arraySidebar([
    {
        text: "MySQL",
        prefix: "mysql/",
        icon: "mysql",
        collapsible: false,
        children: "structure"
    },
    {
        text: "Redis",
        prefix: "redis/",
        icon: "redis",
        collapsible: false,
        children: "structure"
    },
    {
        text: "Elasticsearch",
        prefix: "elasticsearch/",
        icon: "elasticsearch",
        collapsible: false,
        children: "structure"
    },
    {
        text: "MongoDB",
        prefix: "mongodb/",
        icon: "mongodb",
        collapsible: false,
        children: "structure"
    },
]);
