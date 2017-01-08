---
title: Spring日志问题
category: 编程开发
tags: [Java, J2EE, Spring]
---

用Spring AOP做日志记录，给userAction加上日志之后就始终报错

```
Struts has detected an unhandled exception:
　　　　Messages:java.lang.NullPointerException
　　　　File:org/apache/struts2/components/UIBean.java
　　　　Line number:792
　　　　
　　　　Stacktraces
　　　　org.apache.jasper.JasperException: java.lang.NullPointerException
　　　　java.lang.NullPointerException
 
 2010-11-24 17:51:54,862 ERROR (com.opensymphony.xwork2.config.providers.InterceptorBuilder:38) - Actual exception
 Caught Exception while registering Interceptor class org.jhat.interceptor.BasicInterceptor - interceptor - file:/E:/Program/Tomcat/webapps/jhat/WEB-INF/classes/struts-user.xml:10:86
 Caused by: org.springframework.beans.ConversionNotSupportedException: Failed to convert property value of type '$Proxy5 implementing org.jhat.service.UserService,org.springframework.aop.SpringProxy,org.springframework.aop.framework.Advised' to required type 'org.jhat.service.impl.UserServiceImpl' for property 'userService'; nested exception is java.lang.IllegalStateException: Cannot convert value of type [$Proxy5 implementing org.jhat.service.UserService,org.springframework.aop.SpringProxy,org.springframework.aop.framework.Advised] to required type [org.jhat.service.impl.UserServiceImpl] for property 'userService': no matching editors or conversion strategy found
 Caused by: java.lang.IllegalStateException: Cannot convert value of type [$Proxy5 implementing org.jhat.service.UserService,org.springframework.aop.SpringProxy,org.springframework.aop.framework.Advised] to required type [org.jhat.service.impl.UserServiceImpl] for property 'userService': no matching editors or conversion strategy found
```

大概猜出来是因为类型转换出错，但是给userDAO加上日志却没有报错，而且还能正常记录日志，那么就不应该是类型转换的问题。最后查源代码发现，原来UserAction中的setUserService()方法接受的参数是UserServiceImple类型，我想经过日志代理之后，返回的是向上转型的UserService类型的对象，所以参数类型不一致，最终导致报错，最后将setUserService()方法接受的参数类型改为UserService，再次运行一切正常……

从这一点来看，接口编程模式的确带来了不少好处，实现该接口的类所产生的对象都可以向上转型为接口类型的对象，所以有效地降低了对象之间的耦合度。同时也该注意的是，构造对象时尽量用接口或基类，再用不同的实现类或子类实例化。
