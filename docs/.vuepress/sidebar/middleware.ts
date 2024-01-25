import {arraySidebar} from "vuepress-theme-hope";

export const middleware = arraySidebar([
    {
        text: "Kafka",
        prefix: "kafka/",
        icon: "kafka",
        collapsible: false,
        children: [
            "kafka.md",
        ],
    },
    {
        text: "Zookeeper",
        prefix: "zookeeper/",
        icon: "zookeeper",
        collapsible: false,
        children: [
            "zookeeper.md",
        ],
    },
]);
