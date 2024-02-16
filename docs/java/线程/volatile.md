# volatile

Volatile是Java中的一种[轻量级同步机制](https://www.zhihu.com/search?q=轻量级同步机制&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2978976437})，用于保证变量的可见性和禁止[指令重排](https://www.zhihu.com/search?q=指令重排&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2978976437})。当一个变量被声明为Volatile类型时，任何修改该变量的操作都会立即被所有线程看到。也就是说，Volatile修饰的变量在每次修改时都会强制将修改刷新到主内存中，具有很好的可见性和线程安全性。

![image-20240217004404932](https://github-images.wenzhihuai.com/images/image-20240217004404932.png)

## 可见性


## 有序性

