import {arraySidebar} from "vuepress-theme-hope";

export const middleware = arraySidebar([
    {
        text: "Kafka",
        prefix: "kafka/",
        collapsible: false,
        children: "structure"
    },
    {
        text: "Zookeeper",
        prefix: "zookeeper/",
        collapsible: false,
        children: "structure"
    },
    {
        text: "Canal",
        prefix: "canal/",
        collapsible: false,
        children: "structure"
    },
]);
