# 【elasticsearch】源码debug  

# 一、下载源代码
直接用idea下载代码https://github.com/elastic/elasticsearch.git
![image](https://github-images.wenzhihuai.com/images/755525-20220124160719006-851383635.png)



切换到特定版本的分支：比如7.17，之后idea会自己加上Run/Debug Elasitcsearch的，配置可以不用改，默认就好
![image](https://github-images.wenzhihuai.com/images/755525-20220124160709513-361605195.png)





# 二、修改设置(可选)
为了方便, 在 gradle/run.gradle 中关闭 Auth 认证:

setting 'xpack.security.enabled', 'false'

或者使用其中的用户名密码:

user username: 'elastic-admin', password: 'elastic-password', role: 'superuser'



# 三、启动
先启动上面的 remote debug, 然后用 gradlew 启动项目:

./gradlew :run --debug-jvm
打开浏览器http://localhost:9200即可看到es相关信息了
![image](https://github-images.wenzhihuai.com/images/755525-20220124160657219-1269826381.png)
