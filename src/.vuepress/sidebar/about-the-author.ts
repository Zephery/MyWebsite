import {arraySidebar} from "vuepress-theme-hope";

export const aboutTheAuthor = arraySidebar([
    {
        text: "个人生活",
        prefix: "personal-life/",
        collapsible: false,
        children: "structure"
    },
    {
        text: "作品",
        prefix: "works/",
        collapsible: false,
        children: "structure"
    },
    {
        text: "杂谈",
        prefix: "talking/",
        collapsible: false,
        children: "structure"
    },

]);
