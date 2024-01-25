import {arraySidebar} from "vuepress-theme-hope";

export const kubernetes = arraySidebar([
    {
        text: "Kubernetes",
        icon: "kubernetes",
        collapsible: false,
        children: [
            "spark on k8s operator.md",
        ],
    },
]);
