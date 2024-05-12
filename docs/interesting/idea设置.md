# Jetbrains Idea设置
## 一、类注释

想要在生成类的时候，自动带上author和时间，效果如下：

```java
/**
 * @author zhihuaiwen
 * @since 2024/5/12 00:22
 */
public class EFE {
}
```

放到File Header里统一下即可，当然，也可以去Files里定义Class File或者其他：

![image-20240512002500812](https://github-images.wenzhihuai.com/images/image-20240512002500812.png)





## 二、方法注释

想让自动给方法生成注释，以及参数的默认注释：

```java
  /**
   * 获取首页商品列表
   *
   * @param type             类型 【1 精品推荐 2 热门榜单 3首发新品 4促销单品】
   * @param pageParamRequest 分页参数
   * @return List
   */
  @Override
  public CommonPage<IndexProductResponse> findIndexProductList(Integer type, PageParamRequest pageParamRequest) {
```



去settings里面找到Live Templates，新建一个Template Group叫做user，然后再新建一个Live Template。

![image-20240512001636936](https://github-images.wenzhihuai.com/images/image-20240512001636936.png)

Abbreviation填*，Description随便填，然后再Template text填下：

```java
*
$VAR1$
 * @return $returns$
 */
```

编辑变量，Edit Variables：

![image-20240512001711420.png](https://github-images.wenzhihuai.com/images/image-20240512001711420.png)

VAR1：

```groovy
groovyScript("def result=''; def params=\"${_1}\".replaceAll('[\\\\[|\\\\]|\\\\s]', '').split(',').toList(); for(i = 0; i < params.size(); i++) {result+=' * @param ' + params[i] + ' ' + params[i] + ((i < params.size() - 1) ? '\\n' : '')}; return result", methodParameters())
```

returns：

```shell
methodReturnType()
```









## 三、关闭Annotate With Git Blame

Idea这个太烦了，总是不小心误点，想把右侧的两个都给去掉，网上查了有些比较旧，无法解决，下面特别声明下：

![image-20240512001050312](https://github-images.wenzhihuai.com/images/image-20240512001050312.png)

位置：settings直接搜Inlay Hints，把右侧的Usages、Code author给取消勾选即可

![image-20240512001010797](https://github-images.wenzhihuai.com/images/image-20240512001010797.png)

**上面的设置放到百度网盘里了，可以下载后导入到Idea**

链接: https://pan.baidu.com/s/1-3uhY1jssyMWyRbvBLQ2FQ?pwd=epw2 提取码: epw2 复制这段内容后打开百度网盘手机App，操作更方便哦


<img src="https://github-images.wenzhihuai.com/images/image-20240512115716124.png" alt="image-20240512115716124" style="zoom:50%;" />
