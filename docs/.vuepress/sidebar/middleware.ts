import {arraySidebar} from "vuepress-theme-hope";

export const middleware = arraySidebar([
    {
        text: "Kafka",
        prefix: "kafka/",
        icon: "kafka",
        collapsible: false,
        children: "structure"
    },
    {
        text: "Zookeeper",
        prefix: "zookeeper/",
        icon: "zookeeper",
        collapsible: false,
        children: "structure"
    },
    {
        text: "Canal",
        prefix: "canal/",
        icon: "canal",
        collapsible: false,
        children: "structure"
    },
]);
