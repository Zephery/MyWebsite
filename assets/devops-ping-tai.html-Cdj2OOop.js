import{_ as i,r as l,o as p,c,a as n,d as s,b as e,e as t}from"./app-BUhiAgtU.js";const o={},u={id:"devops平台-md",tabindex:"-1"},d=n("a",{class:"header-anchor",href:"#devops平台-md","aria-hidden":"true"},"#",-1),r={href:"http://xn--DevOps-gc6jn80e.md",target:"_blank",rel:"noopener noreferrer"},v=n("p",null,"DevOps定义（来自维基百科）： DevOps（Development和Operations的组合词）是一种重视“软件开发人员（Dev）”和“IT运维技术人员（Ops）”之间沟通合作的文化、运动或惯例。透过自动化“软件交付”和“架构变更”的流程，来使得构建、测试、发布软件能够更加地快捷、频繁和可靠。",-1),g=n("p",null,"公司技术部目前几百人左右吧，但是整个技术栈还是比较落后的，尤其是DevOps、容器这一块，需要将全线打通，当时进来也主要是负责DevOps这一块的工作，应该说也是没怎么做好，其中也走了不少弯路，下面主要是自己踩过的坑吧。",-1),m=n("h2",{id:"一、自由风格的软件项目",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#一、自由风格的软件项目","aria-hidden":"true"},"#"),s(" 一、自由风格的软件项目")],-1),k={href:"https://www.cnblogs.com/w1570631036/p/9861473.html",target:"_blank",rel:"noopener noreferrer"},b=t(`<p>完成了以上的东西，不过由于太过于简单，导致只能进行单条线的CICD，而且CI仅仅实现了打包，没有将CD的过程一同串行起来。简单来说就是，用户点击了构建只是能够打出一个镜像，但是如果要部署到kubernetes，还是需要在应用里手动更换一下镜像版本。总体而言，这个版本的jenkins我们使用的还是单点的，不足以支撑构建量比较大的情况，甚至如果当前服务挂了，断网了，整一块的构建功能都不能用。</p><div class="language-markup line-numbers-mode" data-ext="markup"><pre class="language-markup"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>project</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>actions</span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>description</span><span class="token punctuation">&gt;</span></span>xxx<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>description</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>properties</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hudson.model.ParametersDefinitionProperty</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>parameterDefinitions</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hudson.model.TextParameterDefinition</span><span class="token punctuation">&gt;</span></span>
                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>name</span><span class="token punctuation">&gt;</span></span>buildParam<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>name</span><span class="token punctuation">&gt;</span></span>
                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>defaultValue</span><span class="token punctuation">&gt;</span></span>v1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>defaultValue</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>hudson.model.TextParameterDefinition</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hudson.model.TextParameterDefinition</span><span class="token punctuation">&gt;</span></span>
                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>name</span><span class="token punctuation">&gt;</span></span>codeBranch<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>name</span><span class="token punctuation">&gt;</span></span>
                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>defaultValue</span><span class="token punctuation">&gt;</span></span>master<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>defaultValue</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>hudson.model.TextParameterDefinition</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>parameterDefinitions</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>hudson.model.ParametersDefinitionProperty</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>properties</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>scm</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>hudson.plugins.git.GitSCM<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>configVersion</span><span class="token punctuation">&gt;</span></span>2<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>configVersion</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>userRemoteConfigs</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hudson.plugins.git.UserRemoteConfig</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>url</span><span class="token punctuation">&gt;</span></span>http://xxxxx.git<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>url</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>credentialsId</span><span class="token punctuation">&gt;</span></span>002367566a4eb4bb016a4eb723550054<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>credentialsId</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>hudson.plugins.git.UserRemoteConfig</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>userRemoteConfigs</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>branches</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hudson.plugins.git.BranchSpec</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>name</span><span class="token punctuation">&gt;</span></span>\${codeBranch}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>name</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>hudson.plugins.git.BranchSpec</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>branches</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>doGenerateSubmoduleConfigurations</span><span class="token punctuation">&gt;</span></span>false<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>doGenerateSubmoduleConfigurations</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>extensions</span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>scm</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>builders</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hudson.tasks.Shell</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>command</span><span class="token punctuation">&gt;</span></span>ls<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>command</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>hudson.tasks.Shell</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hudson.tasks.Maven</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>targets</span><span class="token punctuation">&gt;</span></span>clean package install -Dmaven.test.skip=true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>targets</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>mavenName</span><span class="token punctuation">&gt;</span></span>mvn3.5.4<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>mavenName</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>hudson.tasks.Maven</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>com.cloudbees.dockerpublish.DockerBuilder</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>server</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>uri</span><span class="token punctuation">&gt;</span></span>unix:///var/run/docker.sock<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>uri</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>server</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>registry</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>url</span><span class="token punctuation">&gt;</span></span>http://xxxx<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>url</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>registry</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>repoName</span><span class="token punctuation">&gt;</span></span>xxx/xx<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>repoName</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>forcePull</span><span class="token punctuation">&gt;</span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>forcePull</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dockerfilePath</span><span class="token punctuation">&gt;</span></span>Dockerfile<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dockerfilePath</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>repoTag</span><span class="token punctuation">&gt;</span></span>\${buildParam}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>repoTag</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>skipTagLatest</span><span class="token punctuation">&gt;</span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>skipTagLatest</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>com.cloudbees.dockerpublish.DockerBuilder</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>builders</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>publishers</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>com.xxxx.notifications.Notifier</span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>publishers</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>project</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、优化之后的cicd" tabindex="-1"><a class="header-anchor" href="#二、优化之后的cicd" aria-hidden="true">#</a> 二、优化之后的CICD</h2><p>上面的过程也仍然没有没住DevOps的流程，人工干预的东西依旧很多，由于上级急需产出，所以只能将就着继续下去。我们将构建、部署每个当做一个小块，一个CICD的过程可以选择构建、部署，花了很大的精力，完成了串行化的别样的CICD。 以下图为例，整个流程的底层为：paas平台-jenkins-kakfa-管理平台（选择cicd的下一步）-kafka-cicd组件调用管理平台触发构建-jenkins-kafka-管理平台（选择cicd的下一步）-kafka-cicd组件调用管理平台触发部署。</p><figure><img src="https://github-images.wenzhihuai.com/images/201908111044201770944400.png" alt="" tabindex="0"><figcaption></figcaption></figure><p>目前实现了串行化的CICD构建部署，之后考虑实现多个CICD并行，并且一个CICD能够调用另一个CICD，实际运行中，出现了一大堆问题。由于经过的组件太多，一次cicd的运行报错，却很难排查到问题出现的原因，业务方的投诉也开始慢慢多了起来，只能说劝导他们不要用这个功能。</p><p>没有CICD，就无法帮助公司上容器云，无法合理的利用容器云的特性，更无法走上云原生的道路。于是，我们决定另谋出路。</p><h2 id="三、调研期" tabindex="-1"><a class="header-anchor" href="#三、调研期" aria-hidden="true">#</a> 三、调研期</h2><p>由于之前的CICD问题太多，特别是经过的组件太多了，导致出现问题的时候无法正常排查，为了能够更加稳定可靠，还是决定了要更换一下底层。 我们重新审视了下pipeline，觉得这才是正确的做法，可惜不知道如果做成一个产品样子的东西，用户方Dockerfile都不怎么会写，你让他写一个Jenkinsfile？不合理！在此之外，我们看到了serverless jenkins、谷歌的tekton。 <strong>GitLab-CICD</strong> Gitlab中自带了cicd的工具，需要配置一下runner，然后配置一下.gitlab-ci.yml写一下程序的cicd过程即可，构建镜像的时候我们使用的是kaniko，整个gitlab的cicd在我们公司小项目中大范围使用，但是学习成本过高，尤其是引入了kaniko之后，还是寻找一个产品化的CICD方案。</p>`,9),h=n("strong",null,"分布式构建jenkins x",-1),x={href:"https://github.com/jenkins-x/jenkins-x-image",target:"_blank",rel:"noopener noreferrer"},f=n("figure",null,[n("img",{src:"https://github-images.wenzhihuai.com/images/201908170612301464716259.png",alt:"",tabindex:"0"}),n("figcaption")],-1),q=n("p",null,[n("strong",null,"serverless jenkins"),s(" 好像跟谷歌的tekton相关，用了下，没调通，只能用于GitHub。感觉还不如直接使用tekton。")],-1),_=n("p",null,[n("strong",null,"阿里云云效"),s(" 提供了图形化配置DevOps流程，支持定时触发，可惜没有跟gitlab触发结合，如果需要个公司级的DevOps，需要将公司的jira、gitlab、jenkins等集合起来，但是图形化jenkins pipeline是个特别好的参考方向，可以结合阿里云云效来做一个自己的DevOps产品。")],-1),D=n("p",null,[n("strong",null,"微软Pipeline"),s(" 微软也是提供了DevOps解决方案的，也是提供了yaml格式的写法，即：在右边填写完之后会转化成yaml。如果想把DevOps打造成一款产品，这样的设计显然不是最好的。")],-1),j=n("figure",null,[n("img",{src:"https://github-images.wenzhihuai.com/images/201908100346011648784131.png",alt:"",tabindex:"0"}),n("figcaption")],-1),C=n("strong",null,"谷歌tekton",-1),w={href:"https://www.jianshu.com/p/8871b7ea7d6e",target:"_blank",rel:"noopener noreferrer"},y=t(`<h2 id="四、产品化后的devops平台" tabindex="-1"><a class="header-anchor" href="#四、产品化后的devops平台" aria-hidden="true">#</a> 四、产品化后的DevOps平台</h2><p>在调研DockOne以及各个产商的DevOps产品时，发现，真的只有阿里云的云效才是真正比较完美的DevOps产品，用户不需要知道pipeline的语法，也不需要掌握kubernetes的相关知识，甚至不用写yaml文件，对于开发、测试来说简直就是神一样的存在了。云效对小公司（创业公司）免费，但是有一定的量之后，就要开始收费了。在调研了一番云效的东西之后，发现云效也是基于jenkins x改造的，不过阿里毕竟人多，虽然能约莫看出是pipeline的语法，但是阿里彻底改造成了能够使用yaml来与后台交互。 下面是以阿里云的云效界面以及配合jenkins的pipeline语法来讲解：</p><h3 id="_4-1-java代码扫描" tabindex="-1"><a class="header-anchor" href="#_4-1-java代码扫描" aria-hidden="true">#</a> 4.1 Java代码扫描</h3><p>PMD是一款可拓展的静态代码分析器它不仅可以对代码分析器，它不仅可以对代码风格进行检查，还可以检查设计、多线程、性能等方面的问题。阿里云的是简单的集成了一下而已，对于我们来说，底层使用了sonar来接入，所有的代码扫描结果都接入了sonar。</p><figure><img src="https://github-images.wenzhihuai.com/images/201908100429061448084424.png" alt="" tabindex="0"><figcaption></figcaption></figure><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>stage(&#39;Clone&#39;) {
    steps{
        git branch: &#39;master&#39;, credentialsId: &#39;xxxx&#39;, url: &quot;xxx&quot;
    }
}
stage(&#39;check&#39;) {
    steps{
        container(&#39;maven&#39;) {
            echo &quot;mvn pmd:pmd&quot;
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-java单元测试" tabindex="-1"><a class="header-anchor" href="#_4-2-java单元测试" aria-hidden="true">#</a> 4.2 Java单元测试</h3><p>Java的单元测试一般用的是Junit，在阿里云中，使用了surefire插件，用来在maven构建生命周期的test phase执行一个应用的单元测试。它会产生两种不同形式的测试结果报告。我这里就简单的过一下，使用&quot;mvn test&quot;命令来代替。</p><figure><img src="https://github-images.wenzhihuai.com/images/20190915082632234251996.png" alt="" tabindex="0"><figcaption></figcaption></figure><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
stage(&#39;Clone&#39;) {
    steps{
        echo &quot;1.Clone Stage&quot;
        git branch: &#39;master&#39;, credentialsId: &#39;xxxxx&#39;, url: &quot;xxxxxx&quot;
    }
}
stage(&#39;test&#39;) {
    steps{
        container(&#39;maven&#39;) {
            sh &quot;mvn test&quot;
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-java构建并上传镜像" tabindex="-1"><a class="header-anchor" href="#_4-3-java构建并上传镜像" aria-hidden="true">#</a> 4.3 Java构建并上传镜像</h3><p>镜像的构建比较想使用kaniko，尝试找了不少方法，到最后还是只能使用dind(docker in docker)，挂载宿主机的docker来进行构建，如果能有其他方案，希望能提醒下。目前jenkins x使用的是dind，挂载的时候需要配置一下config.json，然后挂载到容器的/root/.docker目录，才能在容器中使用docker。</p><blockquote><blockquote><p>为什么不推荐dind：挂载了宿主机的docker，就可以使用docker ps查看正在运行的容器，也就意味着可以使用docker stop、docker rm来控制宿主机的容器，虽然kubernetes会重新调度起来，但是这一段的重启时间极大的影响业务。</p></blockquote></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
stage(&#39;下载代码&#39;) {
    steps{
        echo &quot;1.Clone Stage&quot;
        git branch: &#39;master&#39;, credentialsId: &#39;xxxxx&#39;, url: &quot;xxxxxx&quot;
        script {
            build_tag = sh(returnStdout: true, script: &#39;git rev-parse --short HEAD&#39;).trim()
        }
    }
}
stage(&#39;打包并构建镜像&#39;) {
    steps{
        container(&#39;maven&#39;) {
            echo &quot;3.Build Docker Image Stage&quot;
            sh &quot;mvn clean install -Dmaven.test.skip=true&quot;
            sh &quot;docker build -f xxx/Dockerfile -t xxxxxx:\${build_tag} .&quot;
            sh &quot;docker push xxxxxx:\${build_tag}&quot;
        }
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-部署到阿里云k8s" tabindex="-1"><a class="header-anchor" href="#_4-4-部署到阿里云k8s" aria-hidden="true">#</a> 4.4 部署到阿里云k8s</h3><p>CD过程有点困难，由于我们的kubernetes平台是图形化的，类似于阿里云，用户根本不需要自己写deployment，只需要在图形化界面做一下操作即可部署。对于CD过程来说，如果应用存在的话，就可以直接替换掉镜像版本即可，如果没有应用，就提供个简单的界面让用户新建应用。当然，在容器最初推行的时候，对于用户来说，一下子需要接受docker、kubernetes、helm等概念是十分困难的，不能一个一个帮他们写deployment这些yaml文件，只能用helm创建一个通用的spring boot或者其他的模板，然后让业务方修改自己的配置，每次构建的时候只需要替换镜像即可。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>def tmp = sh (
    returnStdout: true,
    script: &quot;kubectl get deployment -n \${namespace} | grep \${JOB_NAME} | awk &#39;{print \\$1}&#39;&quot;
)
//如果是第一次，则使用helm模板创建，创建完后需要去epaas修改pod的配置
if(tmp.equals(&#39;&#39;)){
    sh &quot;helm init --client-only&quot;
    sh &quot;&quot;&quot;helm repo add mychartmuseum http://xxxxxx \\
                       --username myuser \\
                       --password=mypass&quot;&quot;&quot;
    sh &quot;&quot;&quot;helm install --set name=\${JOB_NAME} \\
                       --set namespace=\${namespace} \\
                       --set deployment.image=\${image} \\
                       --set deployment.imagePullSecrets=\${harborProject} \\
                       --name \${namespace}-\${JOB_NAME} \\
                       mychartmuseum/soa-template&quot;&quot;&quot;
}else{
    println &quot;已经存在，替换镜像&quot;
    //epaas中一个pod的容器名称需要带上&quot;-0&quot;来区分
    sh &quot;kubectl set image deployment/\${JOB_NAME} \${JOB_NAME}-0=\${image} -n \${namespace}&quot;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-5-整体流程" tabindex="-1"><a class="header-anchor" href="#_4-5-整体流程" aria-hidden="true">#</a> 4.5 整体流程</h3><p>代码扫描，单元测试，构建镜像三个并行运行，等三个完成之后，在进行部署</p><figure><img src="https://github-images.wenzhihuai.com/images/201908100428501805517052.png" alt="" tabindex="0"><figcaption></figcaption></figure><p>pipeline：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>pipeline {
    agent {
        label &quot;jenkins-maven&quot;
    }
    stages{
        stage(&#39;代码扫描，单元测试，镜像构建&#39;){
            parallel {
                stage(&#39;并行任务一&#39;) {
                    agent {
                        label &quot;jenkins-maven&quot;
                    }
                    stages(&#39;Java代码扫描&#39;) {
                        stage(&#39;Clone&#39;) {
                            steps{
                                git branch: &#39;master&#39;, credentialsId: &#39;xxxxxxx&#39;, url: &quot;xxxxxxx&quot;
                            }
                        }
                        stage(&#39;check&#39;) {
                            steps{
                                container(&#39;maven&#39;) {
                                    echo &quot;$BUILD_NUMBER&quot;
                                }
                            }
                        }
                    }
                }
                stage(&#39;并行任务二&#39;) {
                    agent {
                        label &quot;jenkins-maven&quot;
                    }
                    stages(&#39;Java单元测试&#39;) {
                        stage(&#39;Clone&#39;) {
                            steps{
                                echo &quot;1.Clone Stage&quot;
                                git branch: &#39;master&#39;, credentialsId: &#39;xxxxxxx&#39;, url: &quot;xxxxxxx&quot;
                            }
                        }
                        stage(&#39;test&#39;) {
                            steps{
                                container(&#39;maven&#39;) {
                                    echo &quot;3.Build Docker Image Stage&quot;
                                    sh &quot;mvn -v&quot;
                                }
                            }
                        }
                    }
                }
                stage(&#39;并行任务三&#39;) {
                    agent {
                        label &quot;jenkins-maven&quot;
                    }
                    stages(&#39;java构建镜像&#39;) {
                        stage(&#39;Clone&#39;) {
                            steps{
                                echo &quot;1.Clone Stage&quot;
                                git branch: &#39;master&#39;, credentialsId: &#39;xxxxxxx&#39;, url: &quot;xxxxxxx&quot;
                                script {
                                    build_tag = sh(returnStdout: true, script: &#39;git rev-parse --short HEAD&#39;).trim()
                                }
                            }
                        }
                        stage(&#39;Build&#39;) {
                            steps{
                                container(&#39;maven&#39;) {
                                    echo &quot;3.Build Docker Image Stage&quot;
                                    sh &quot;mvn clean install -Dmaven.test.skip=true&quot;
                                    sh &quot;docker build -f epaas-portal/Dockerfile -t hub.gcloud.lab/rongqiyun/epaas:\${build_tag} .&quot;
                                    sh &quot;docker push hub.gcloud.lab/rongqiyun/epaas:\${build_tag}&quot;
                                }
                            }
                        }
                    }
                }
            }
        }
        stage(&#39;部署&#39;){
            stages(&#39;部署到容器云&#39;) {
                stage(&#39;check&#39;) {
                    steps{
                        container(&#39;maven&#39;) {
                            script{
                                if (deploy_app == &quot;true&quot;){
                                    def tmp = sh (
                                        returnStdout: true,
                                        script: &quot;kubectl get deployment -n \${namespace} | grep \${JOB_NAME} | awk &#39;{print \\$1}&#39;&quot;
                                    )
                                    //如果是第一次，则使用helm模板创建，创建完后需要去epaas修改pod的配置
                                    if(tmp.equals(&#39;&#39;)){
                                        sh &quot;helm init --client-only&quot;
                                        sh &quot;&quot;&quot;helm repo add mychartmuseum http://xxxxxx \\
                                                           --username myuser \\
                                                           --password=mypass&quot;&quot;&quot;
                                        sh &quot;&quot;&quot;helm install --set name=\${JOB_NAME} \\
                                                           --set namespace=\${namespace} \\
                                                           --set deployment.image=\${image} \\
                                                           --set deployment.imagePullSecrets=\${harborProject} \\
                                                           --name \${namespace}-\${JOB_NAME} \\
                                                           mychartmuseum/soa-template&quot;&quot;&quot;
                                    }else{
                                        println &quot;已经存在，替换镜像&quot;
                                        //epaas中一个pod的容器名称需要带上&quot;-0&quot;来区分
                                        sh &quot;kubectl set image deployment/\${JOB_NAME} \${JOB_NAME}-0=\${image} -n \${namespace}&quot;
                                    }
                                }else{
                                    println &quot;用户选择不部署代码&quot;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在jenkins x中查看：</p><figure><img src="https://github-images.wenzhihuai.com/images/20190810043129475121819.png" alt="" tabindex="0"><figcaption></figcaption></figure><h3 id="_4-4-日志" tabindex="-1"><a class="header-anchor" href="#_4-4-日志" aria-hidden="true">#</a> 4.4 日志</h3><p>jenkins blue ocean步骤日志：</p><figure><img src="https://github-images.wenzhihuai.com/images/201908100431461365428934.png" alt="" tabindex="0"><figcaption></figcaption></figure><p>云效中的日志：</p><figure><img src="https://github-images.wenzhihuai.com/images/2019081004491578636427.png" alt="" tabindex="0"><figcaption></figcaption></figure><h3 id="_4-5-定时触发" tabindex="-1"><a class="header-anchor" href="#_4-5-定时触发" aria-hidden="true">#</a> 4.5 定时触发</h3><figure><img src="https://github-images.wenzhihuai.com/images/201908100524291184838290.png" alt="" tabindex="0"><figcaption></figcaption></figure><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    triggers {
        cron(&#39;H H * * *&#39;) //每天
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、其他" tabindex="-1"><a class="header-anchor" href="#五、其他" aria-hidden="true">#</a> 五、其他</h2><h3 id="_5-1-gitlab触发" tabindex="-1"><a class="header-anchor" href="#_5-1-gitlab触发" aria-hidden="true">#</a> 5.1 Gitlab触发</h3><p>pipeline中除了有对于时间的trigger，还支持了gitlab的触发，需要各种配置，不过如果真的对于gitlab的cicd有要求，直接使用gitlab-ci会更好，我们同时也对gitlab进行了runner的配置来支持gitlab的cicd。gitlab的cicd也提供了构建完后即销毁的过程。</p><h2 id="六、总结" tabindex="-1"><a class="header-anchor" href="#六、总结" aria-hidden="true">#</a> 六、总结</h2><p>功能最强大的过程莫过于自己使用pipeline脚本实现，选取最适合自己的，但是对于一个公司来说，如果要求业务方来掌握这些，特别是IT流动性大的时候，既需要重新培训，同个问题又会被问多遍，所以，只能将DevOps实现成一个图形化的东西，方便，简单，相对来说功能还算强大。</p><p>DevOps最难的可能都不是以上这些，关键是让用户接受，容器云最初推行时，公司原本传统的很多发版方式都需要进行改变，有些业务方不愿意改，或者有些代码把持久化的东西存到了代码中而不是分布式存储里，甚至有些用户方都不愿意维护老代码，看都不想看然后想上容器，一个公司在做技术架构的时候，过于混乱到最后填坑要么需要耗费太多精力甚至大换血。</p><p>最后，DevOps是云原生的必经之路！！！</p>`,39),$=n("br",null,null,-1),O={href:"https://www.cnblogs.com/w1570631036/p/11524673.html",target:"_blank",rel:"noopener noreferrer"},I=n("br",null,null,-1),B={href:"http://www.wenzhihuai.com/getblogdetail.html?blogid=663",target:"_blank",rel:"noopener noreferrer"},P=n("br",null,null,-1),S={href:"https://gitbook.wenzhihuai.com/devops/devops-ping-tai",target:"_blank",rel:"noopener noreferrer"};function N(J,E){const a=l("ExternalLinkIcon");return p(),c("div",null,[n("h1",u,[d,s(),n("a",r,[s("DevOps平台.md"),e(a)])]),v,g,m,n("p",null,[s("主要还是基于jenkins里面构建一个自由风格的软件项目，当时参考的是阿里的codepipeline，就是对jenkins封装一层，包括创建job、立即构建、获取构建进度等都进行封装，并将需要的东西进行存库，没有想到码代码的时候，一堆的坑，比如： 1.连续点击立即构建，jenkins是不按顺序返回的，（分布式锁解决） 2.跨域调用，csrf，这个还好，不过容易把jenkins搞的无法登录（注意配置，具体可以点击"),n("a",k,[s("这里"),e(a)]),s("） 3.创建job的时候只支持xml格式，还要转换一下，超级坑（xstream强行转换） 4.docker构建的时候，需要挂载宿主机的docker（想过用远程的，但效率不高） 5.数据库与jenkins的job一致性问题，任务创建失败，批量删除太慢（目前没想好怎么解决） 6.由于使用了数据库，需要检测job是否构建完成，为了自定义参数，我们自写了个通知插件，将构建状态返回到kafka，然后管理平台在进行消息处理。")]),b,n("p",null,[h,s(" 首先要解决的是多个构建同时运行的问题，很久之前就调研过jenkins x，它必须要使用在kubernetes上，由于当时官方文档不全，而且我们的DevOps项目处于初始期，所有没有使用。jenkins的master slave结构就不多说了。jenkins x应该说是个全家桶，包含了helm仓库、nexus仓库、docker registry等，代码是"),n("a",x,[s("jenkins-x-image"),e(a)]),s("。")]),f,q,_,D,j,n("p",null,[C,s(" kubernetes的官方cicd，目前已用于kubernetes的release发版过程，目前也仅仅是与GitHub相结合，gitlab无法使用，全过程可使用yaml文件来创建，跑起来就是类似kubernetes的job一样，用完即销毁，可惜目前比较新，依旧处于alpha版本，无法用于生产。有兴趣可以参考下："),n("a",w,[s("Knative 初体验：CICD 极速入门 "),e(a)])]),y,n("p",null,[s("文章同步："),$,s(" 博客园："),n("a",O,[s("https://www.cnblogs.com/w1570631036/p/11524673.html"),e(a)]),I,s(" 个人网站："),n("a",B,[s("http://www.wenzhihuai.com/getblogdetail.html?blogid=663"),e(a)]),P,s(" gitbook："),n("a",S,[s("https://gitbook.wenzhihuai.com/devops/devops-ping-tai"),e(a)])])])}const z=i(o,[["render",N],["__file","devops-ping-tai.html.vue"]]);export{z as default};
