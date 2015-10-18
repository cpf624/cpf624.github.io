---
title: Spring管理Strust2 Action
category: 编程开发
tags: [Java, J2EE, Spring, Strust2]
---

将Spring和Struts2整合之后，完全可以将action交由Spring管理，而且推荐用这种方式，要实现这种方式，配置文件得做适当的修改。

首先在Spring的配置文件中添加action的bean实例

```xml
<bean id="userAction" class="org.jhat.action.UserAction" scope="prototype">
    <property name="userService" ref="userService" />
</bean>
```

需要注意的是， scope 一定要设置为 prototype 默认是 singleton。只有设置为prototype之后，每建立一个访问连接时，Spring才会写new一个action实例出来，这样才能正常访问，否则无论谁访问，都是用的Spring最开始加载时创建的action实例，这样当然就没法正常访问了。

Spring中配置好后，struts的配置文件中修改如下

```xml
<action name="login" class="userAction" method="Login">
    <result name="success">/user/welcome.jsp</result>
</action>
```

注意class属性，原来是完整的路径，由于将action交给Spring管理了，所以就只需要配置为Spring配置文件中同名的bean即可。
