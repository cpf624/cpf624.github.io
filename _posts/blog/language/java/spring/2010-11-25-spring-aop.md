---
title: Spring AOP
category: 编程开发
tags: [Java, J2EE, Spring, AOP]
---

Spring AOP编程，具体的代理类，如果只是需要在被代理的对象执行之前运行，那么只需实现 `org.springframework.aop.MethodBeforeAdvice` 接口，做相应的处理即可，而 `org.springframework.aop.AfterReturningAdvice` 和 `org.springframework.aop.ThrowsAdvice` 则分别用于实现方法调用返回后和抛出异常后的代理接口。当然，还可以通过实现 `org.aopalliance.intercept.MethodInterceptor` 接口，轻松实现上诉三个功能。但需要注意的是，用代理之后，那么被代理的对象执行完之后返回的结果不在是原有的类型，而变成了被代理对象所实现的接口类，即变成了基类的对象，所以在传参时需要额外注意。同理，若果需要给某个类加上代理，也需要将这个类进行一次抽象，让其实现某一接口。


一个AroundAdvice的实现类和Spring配置文件如下：

```java
package org.jhat.log;

import java.util.Arrays;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * @project jhat
 * @file    org.jhat.log.baseAroundAdvice.java
 * @author  Jhat
 * @email   cpf624@126.com
 * @time    2010-11-22下午10:00:02
 */
public class baseAroundAdvice implements MethodInterceptor {

    private Log log=LogFactory.getLog(this.getClass());

    public Object invoke(MethodInvocation methodInvocation) throws Throwable {
        log.info("The method " + methodInvocation.getMethod() + "() begins with "
            + Arrays.toString(methodInvocation.getArguments()));
        try{
            Object result = methodInvocation.proceed();
            log.info("The method " + methodInvocation.getMethod() + "() ends with " + result);
            return result;
        } catch(IllegalArgumentException e) {
            log.error("Illegal argument " + Arrays.toString(methodInvocation.getArguments())
                + " for method " + methodInvocation.getMethod() + "()");
        }
        return null;
    }
}
```

```xml
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
        http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-3.0.xsd">

    <!-- Spring AOP start-->
    <!--代理实现类-->
    <bean id="baseLogBeforeAdvice" class="org.jhat.log.baseLogBeforeAdvice" />
    <bean id="baseLogAfterAdvice" class="org.jhat.log.baseLogAfterAdvice" />
    <bean id="baseLogThrowAdvice" class="org.jhat.log.baseLogThrowAdvice" />
    <bean id="baseAroundAdvice" class="org.jhat.log.baseAroundAdvice" />

    <!-- 声明切入点，静态匹配方法名 -->
    <bean id="methodNamePoint" class="org.springframework.aop.support.NameMatchMethodPointcut">
        <property name="mappedNames">
            <list><value>set</value></list>
        </property>
    </bean>

    <!-- 切入点与通知关联起来声明，这样的关联成为增强器advisor -->
    <bean id="methodNameAdvisor1" class="org.springframework.aop.support.DefaultPointcutAdvisor">
        <property name="pointcut" ref="methodNamePoint" />
        <property name="advice" ref="baseAroundAdvice" />
    </bean>

    <!-- NameMatchMethodPointcutAdvisor可以将切入点声明合并到增强器,效果与 methodNameAdvisor1相同-->
    <bean id="methodNameAdvisor2" class="org.springframework.aop.support.NameMatchMethodPointcutAdvisor">
        <property name="mappedNames">
            <list><value>LoginDAO</value></list>
        </property>
        <property name="advice" ref="baseAroundAdvice" />
    </bean>

    <!-- 正则表达式切入点 -->
    <bean id="regexpAdvisor" class="org.springframework.aop.support.RegexpMethodPointcutAdvisor">
        <property name="patterns">
            <list>
                <value>org.jhat.dao.*.LoginDAO</value>
                <value>org.jhat.service.*.LoginService</value>
            </list>
        </property>
        <property name="advice" ref="baseAroundAdvice" />
    </bean>

    <!-- AspectJ切入点 -->
    <bean id="aspectjAdvisor" class="org.springframework.aop.aspectj.AspectJExpressionPointcutAdvisor">
        <property name="expression">
            <value>execution(* org.jhat.dao.*.*DAO*(..))</value>
        </property>
        <property name="advice" ref="baseAroundAdvice" />
    </bean>

    <!-- 自动为Bean创建代理 -->
    <bean class="org.springframework.aop.framework.autoproxy.BeanNameAutoProxyCreator">
        <property name="beanNames">
            <list>
                <value>*DAO</value>
                <value>*Service</value>
            </list>
        </property>
        <property name="interceptorNames">
            <list>
                <value>regexpAdvisor</value>
                <!--
                <value>methodNameAdvisor2</value>
                <value>regexpAdvisor</value>
                <value>aspectjAdvisor</value>
                -->
            </list>
        </property>
    </bean>

    <!-- 全自动代理（自动检测IoC容器里声明的每一个增强器和Bean，如果存在与增强器切入点匹配的Bean，就为之自动创建代理）慎用！！！
    <bean class="org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator" />
    -->

    <!-- Spring AOP end-->
</beans>
```

不使用自动代理的配置示例如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

    <bean id="baseDAO" class="org.jhat.dao.impl.BaseDAOImpl">
        <property name="sessionFactory" ref="sessionFactory" />
    </bean>
    <bean id="userDAO" class="org.jhat.dao.impl.UserDAOImpl" parent="baseDAO" />
    <bean id="userDAOProxy" class="org.springframework.aop.framework.ProxyFactoryBean">
        <property name="target" ref="userDAO" />
        <property name="interceptorNames">
            <list>
                <value>baseAroundAdvice</value>
            </list>
        </property>
    </bean>
</beans>
```
