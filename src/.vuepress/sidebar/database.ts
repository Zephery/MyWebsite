import {arraySidebar} from "vuepress-theme-hope";

export const database = arraySidebar([
    {
        text: "MySQL",
        prefix: "mysql/",
        collapsible: true,
        children: "structure"
    },
    {
        text: "Redis",
        prefix: "redis/",
        collapsible: true,
        children: "structure"
    },
    {
        text: "Elasticsearch",
        prefix: "elasticsearch/",
        collapsible: true,
        expanded: true,
        children: "structure"
    }
]);
