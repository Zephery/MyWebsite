# 在 Spring 6 中使用虚拟线程

## 一、简介

在这个简短的教程中，我们将了解如何在 Spring Boot 应用程序中利用虚拟线程的强大功能。

虚拟线程是Java 19 的[预览功能](https://openjdk.org/jeps/425)，这意味着它们将在未来 12 个月内包含在官方 JDK 版本中。[Spring 6 版本](https://spring.io/blog/2022/10/11/embracing-virtual-threads)最初由 Project Loom 引入，为开发人员提供了开始尝试这一出色功能的选项。

首先，我们将看到“平台线程”和“虚拟线程”之间的主要区别。接下来，我们将使用虚拟线程从头开始构建一个 Spring-Boot 应用程序。最后，我们将创建一个小型测试套件，以查看简单 Web 应用程序吞吐量的最终改进。

## 二、 虚拟线程与平台线程

主要区别在于[虚拟线程](https://www.baeldung.com/java-virtual-thread-vs-thread)在其操作周期中不依赖于操作系统线程：它们与硬件解耦，因此有了“虚拟”这个词。这种解耦是由 JVM 提供的抽象层实现的。

对于本教程来说，必须了解虚拟线程的运行成本远低于平台线程。它们消耗的分配内存量要少得多。这就是为什么可以创建数百万个虚拟线程而不会出现内存不足问题，而不是使用标准平台（或内核）线程创建几百个虚拟线程。

从理论上讲，这赋予了开发人员一种超能力：无需依赖异步代码即可管理高度可扩展的应用程序。

## 三、在Spring 6中使用虚拟线程

从 Spring Framework 6（和 Spring Boot 3）开始，虚拟线程功能正式公开，但虚拟线程是Java 19 的[预览功能。](https://www.baeldung.com/java-preview-features)这意味着我们需要告诉 JVM 我们要在应用程序中启用它们。由于我们使用 Maven 来构建应用程序，因此我们希望确保在 pom.xml 中包含以下*代码*：

```java
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <source>19</source>
                <target>19</target>
                <compilerArgs>
                    --enable-preview
                </compilerArgs>
            </configuration>
        </plugin>
    </plugins>
</build>
```

从 Java 的角度来看，要使用 Apache Tomcat 和虚拟线程，我们需要一个带有几个 bean 的简单配置类：

```java
@EnableAsync
@Configuration
@ConditionalOnProperty(
  value = "spring.thread-executor",
  havingValue = "virtual"
)
public class ThreadConfig {
    @Bean
    public AsyncTaskExecutor applicationTaskExecutor() {
        return new TaskExecutorAdapter(Executors.newVirtualThreadPerTaskExecutor());
    }

    @Bean
    public TomcatProtocolHandlerCustomizer<?> protocolHandlerVirtualThreadExecutorCustomizer() {
        return protocolHandler -> {
            protocolHandler.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        };
    }
}
```

第一个 Spring Bean *ApplicationTaskExecutor*将取代标准的*[ApplicationTaskExecutor](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/task/TaskExecutionAutoConfiguration.html)* ，提供为每个任务启动新虚拟线程的*Executor*。第二个 bean，名为*ProtocolHandlerVirtualThreadExecutorCustomizer，*将以相同的方式 自定义标准*[TomcatProtocolHandler 。](https://tomcat.apache.org/tomcat-8.5-doc/api/org/apache/coyote/ProtocolHandler.html)*我们还添加了注释*[@ConditionalOnProperty，](https://www.baeldung.com/spring-conditionalonproperty)**以通过切换application.yaml*文件中配置属性的值来按需启用虚拟线程：

```yaml
spring:
    thread-executor: virtual
    //...
```

我们来测试一下Spring Boot应用程序是否使用虚拟线程来处理Web请求调用。为此，我们需要构建一个简单的控制器来返回所需的信息：

```java
@RestController
@RequestMapping("/thread")
public class ThreadController {
    @GetMapping("/name")
    public String getThreadName() {
        return Thread.currentThread().toString();
    }
}
```

*[Thread](https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/lang/Thread.html)*对象的toString *()*方法将返回我们需要的所有信息：线程 ID、线程名称、线程组和优先级。让我们通过一个[*curl*](https://www.baeldung.com/curl-rest)请求来访问这个端点：

```bash
$ curl -s http://localhost:8080/thread/name
$ VirtualThread[#171]/runnable@ForkJoinPool-1-worker-4
```

正如我们所看到的，响应明确表示我们正在使用虚拟线程来处理此 Web 请求。换句话说，*Thread.currentThread()*调用返回虚拟线程类的实例。现在让我们通过简单但有效的负载测试来看看虚拟线程的有效性。

## 四、性能比较

对于此负载测试，我们将使用[JMeter](https://www.baeldung.com/jmeter)。这不是虚拟线程和标准线程之间的完整性能比较，而是我们可以使用不同参数构建其他测试的起点。

*在这种特殊的场景中，我们将调用Rest Controller*中的一个端点，该端点将简单地让执行休眠一秒钟，模拟复杂的异步任务：

```java
@RestController
@RequestMapping("/load")
public class LoadTestController {

    private static final Logger LOG = LoggerFactory.getLogger(LoadTestController.class);

    @GetMapping
    public void doSomething() throws InterruptedException {
        LOG.info("hey, I'm doing something");
        Thread.sleep(1000);
    }
}
```

请记住，由于*@ConditionalOnProperty* 注释，我们只需更改 application.yaml 中变量的值即可在虚拟线程和标准线程之间*切换*。

JMeter 测试将仅包含一个线程组，模拟 1000 个并发用户访问*/load* 端点 100 秒：

![image-20230827193431807](https://github-images.wenzhihuai.com/images/755525-20230827193604936-1596575555.png)

在本例中，采用这一新功能所带来的性能提升是显而易见的。让我们比较不同实现的“响应时间图”。这是标准线程的响应图。我们可以看到，立即完成一次调用所需的时间达到 5000 毫秒：

![image-20230827193511176](https://github-images.wenzhihuai.com/images/755525-20230827193604663-146471729.png)

发生这种情况是因为平台线程是一种有限的资源，当所有计划的和池化的线程都忙时，Spring 应用程序除了将请求搁置直到一个线程空闲之外别无选择。

让我们看看虚拟线程会发生什么：

![image-20230827193533565](https://github-images.wenzhihuai.com/images/755525-20230827193609186-1264647264.png)

正如我们所看到的，响应稳定在 1000 毫秒。虚拟线程在请求后立即创建和使用，因为从资源的角度来看它们非常便宜。在本例中，**我们正在比较 spring 默认固定标准线程池（默认为 200）和 spring 默认无界虚拟线程池的使用情况。**

**这种性能提升之所以可能，是因为场景过于简单，并且没有考虑 Spring Boot 应用程序可以执行的全部操作。**从底层操作系统基础设施中采用这种抽象可能是有好处的，但并非在所有情况下都是如此。