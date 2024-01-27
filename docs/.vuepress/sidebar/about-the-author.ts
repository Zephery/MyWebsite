import {arraySidebar} from "vuepress-theme-hope";

export const aboutTheAuthor = arraySidebar([
    {
        text: "个人生活",
        icon: "experience",
        prefix: "personal-life/",
        collapsible: false,
        children: "structure"
    },
    {
        text: "作品",
        icon: "works",
        prefix: "works/",
        collapsible: false,
        children: "structure"
    },
    {
        text: "杂谈",
        icon: "chat",
        prefix: "talking/",
        collapsible: false,
        children: "structure"
    },

]);
