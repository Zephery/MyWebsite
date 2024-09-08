# 流程编排LiteFlow

LiteFlow真的是相见恨晚啊，之前做过的很多系统，都会用各种if else，switch这些来解决不同业务方提出的问题，有时候还要“切一个分支”来搞这些额外的事情，把代码搞得一团糟，毫无可读性而言。如何打破僵局？LiteFlow为解耦逻辑而生，为编排而生，在使用LiteFlow之后，你会发现打造一个低耦合，灵活的系统会变得易如反掌！

## 背景

之前做过一个数据分发系统，需要消费kafka的数据，下游有不同的业务，每个业务可能有共同的地方，也有不同的地方，在经过各类的处理之后，最后数据分发到下游里面去，真个流程如下。

![image-20240907004837664](https://github-images.wenzhihuai.com/images/image-20240907004837664.png)

如果要在一个代码实现上诉功能，我们第一反应可能是**责任链设计模式**，每个业务一条链路，

![QQ_1725641741023](https://github-images.wenzhihuai.com/images/QQ_1725641741023.png)

在Spring中，类似下面的代码：
```java
public abstract class Handler {
    abstract void handler(Request request);
}

@Component
@Slf4j
public class HandlerA extends Handler{
    @Override
    public void handler(Request request) {
        log.info("处理器1");
    }
}

@Component
@Slf4j
public class HandlerB extends Handler {
    @Override
    public void handler(Request request) {
        log.info("处理器2");
    }
}

@Component
@Slf4j
public class HandlerC extends Handler{
    @Override
    public void handler(Request request) {
        log.info("处理器3");
    }
}
@Component
@Slf4j
public class HandlerD extends Handler{
    @Override
    public void handler(Request request) {
        log.info("处理器4");
    }
}

//然后我们定义一个枚举类，用来配置不同业务需要经历过的处理器。
public enum HandleBuz {
    Business_1(HandlerA,HandlerB),
    Business_2(HandlerB,HandlerC),
    Business_3(HandlerA,HandlerD);
    public final Class<? extends Handler>[] processors;
    public HandleBuz(Class<? extends Handler>[] processors){
        this.processors=processors;
    }    
    public void handle(){
        for (Handler handler : processors) {
            handler.handler(xxx);
        }
    }

}
```
通过配置责任链，可以灵活地组合处理对象，实现不同的处理流程，并且可以在运行时动态地改变处理的顺序，由于责任链模式遵循[开闭原则](https://zhida.zhihu.com/search?q=开闭原则&zhida_source=entity&is_preview=1)，新的处理者可以随时被加入到责任链中，不需要修改已有代码，提供了良好的扩展性。但实际上面对各种需求的时候，没法做到完全的解耦，比如对于HandlerA，如果业务1和业务2都有定制化的需求，此时是应该再HandlerA中用if else解决，还是再额外开个HandlerA_1和HandlerA_2。这类特性需求会非常多，最终把代码可读性变得越来越低。


## 一、为什么需要流程编排

LiteFlow由Baidu开源，专注于逻辑驱动流程编排，通过组件化方式快速构建和执行业务流程，有效解耦复杂业务逻辑。它以其轻量级、快速、稳定且可编排的特性，在业务流程管理、规则引擎、工作流、订单处理、数据处理、微服务编排以及智能化流程管理等领域都有广泛的应用前景。

![img](https://github-images.wenzhihuai.com/images/1.svg)




## 二、它可以解决什么问题



![QQ_1725642537116](https://github-images.wenzhihuai.com/images/QQ_1725642537116.png)

```xml
<chain name="chain4">
    THEN(
        SWTICH(分业务).to(
  )
        A, B,
        WHEN(
            THEN(C, WHEN(J, K)),
            D,
            THEN(H, I)
        ),
        SWITCH(X).to(
            M,
            N,
            WHEN(Q, THEN(P, R)).id("w01")
        ),
        Z
    );
</chain>
```



## 三、LiteFlow改造之后

```java
@Slf4j
@LiteflowComponent("a")
public class HandlerA extends NodeComponent {
    @Override
    public void process() throws Exception {
        Customizer contextBean = this.getContextBean(Customizer.class);
    }
}

@Slf4j
@LiteflowComponent("b")
public class HandlerB extends NodeComponent {
    @Override
    public void process() throws Exception {
        Customizer contextBean = this.getContextBean(Customizer.class);
    }
}

@Slf4j
@LiteflowComponent("c")
public class HandlerC extends NodeComponent {
    @Override
    public void process() throws Exception {
        Customizer contextBean = this.getContextBean(Customizer.class);
    }
}

@Slf4j
@LiteflowComponent("d")
public class HandlerD extends NodeComponent {
    @Override
    public void process() throws Exception {
        Customizer contextBean = this.getContextBean(Customizer.class);
    }
}

```



再配合LiteFlow的EL表达式使用









## 文档

1.【腾讯文档】业务处理复杂 https://docs.qq.com/flowchart/DZVFURmhCb0JFUHFD

2.【腾讯文档】业务处理复杂2 https://docs.qq.com/flowchart/DZXVOaUV5VGRtc3ZD

3.[一文搞懂设计模式—责任链模式](https://zhuanlan.zhihu.com/p/680508137)