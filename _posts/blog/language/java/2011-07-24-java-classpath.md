---
title: Java CLASSPATH
category: 编程开发
tags: [Java]
---

昨天打算在命令行下执行java命令，用javac编译没得任何问题，但用java运行时却出现如下异常：

```
Exception in thread "main" java.lang.NoClassDefFoundError: t
　　　　Caused by: java.lang.ClassNotFoundException: t
　　　　at java.net.URLClassLoader$1.run(URLClassLoader.java:202)
　　　　at java.security.AccessController.doPrivileged(Native Method)
　　　　at java.net.URLClassLoader.findClass(URLClassLoader.java:190)
　　　　at java.lang.ClassLoader.loadClass(ClassLoader.java:306)
　　　　at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:301)
　　　　at java.lang.ClassLoader.loadClass(ClassLoader.java:247)
　　　　Could not find the main class: t.  Program will exit.
```

今天在网上一搜，才发现原来是CLASSPATH环境变量配置出错的原因。

众所周知Java是通过Java虚拟机来解释运行的，也就是通过java命令，javac编译生成的.class文件就是虚拟机要执行的代码，称之为字节码，虚拟机通过ClassLoader来加载这些字节码，也就是通常意义上的类。既然需要加载类，就需要有加载路径，缺省实在当前路径 `.` 加载，或者从用户给定的CLASSPATH环境变量中加载，当然也可以通过加上参数 `-classpath` 来显示指定加载路径。

所以将CLASSPATH按如下方式改后，一切正常。

```bash
# linux
CLASSPATH=.:$JAVA_HOME/lib

# windows
CLASSPATH=.;%JAVA_HOME%/lib
```
