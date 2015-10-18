---
title: Spring Transaction的三种配置方式
category: 编程开发
tags: [Java, J2EE, Spring, Transation]
---

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop" xmlns:tx="http://www.springframework.org/schema/tx"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
        http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-3.0.xsd
        http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-3.0.xsd">

    <!-- 如果使用@Transactional方式管理事务，虚做如下声明。
        transaction-manager可以省略，前提是有id为transactionManager的Bean
        同时，需要在需要用到事务管理方法的上面做如下声明：
        @Transactional(propagation=Propagation.REQUIRED, //事务传播
            isolation=Isolation.READ_COMMITTED, //事务隔离
            rollbackFor=IOException.class, //回滚事务
            noRollbackFor=IllegalStateException.class,
            timeout=30, //设置超时
            readOnly=false) //设置只读属性
     -->
    <tx:annotation-driven transaction-manager="transactionManager"/>
    <!-- Transaction manager for a single hibernate SessionFactory -->
    <bean id="transactionManager" class="org.springframework.orm.hibernate3.HibernateTransactionManager">
        <property name="sessionFactory" ref="sessionFactory"/>
    </bean>
    <!--
    事务传播行为(propagation)：
    REQUIRED 如果有事务在运行，当前的方法就在这个事务内部运行，否则，就启动一个新的事务，并让他在自己的事务内运行
    REQUIRED_NEW 当前的方法必须开启新事务，并在他自己的事务中运行，如果有事务在运行，应将他挂起（suspend）
    SUPPORTS 如果有事务在运行，当前的方法就运行在这个事务中，否则，他可以不运行在事务中
    NOT_SUPPORTED 当前的方法不应该在事务内运行，如果有运行中的事务，就挂起他
    MANDATORY 当前的方法必须运行在事务中，如果没有正在运行的事务，就抛出异常
    NEVER 当前的方法不应该在事务中运行，如果当前存在事务，就抛出异常
    NESTED 如果有事务在运行，当前的方法就应该在这个事务的嵌套事务内运行。否则，他就启动一个新的事务，并在他自己的事务内部运行
     -->
    <!--
    事务的隔离级别(isolation)
    DEFAULT 使用底层数据库的默认隔离级别，对于大多数数据库来说默认隔离级别都是READ_COMMITTED
    READ_UMCOMMITTED 允许事务读取未被其他事务提交的变更。脏读、不可重复读和幻读都有可能发生
    READ_COMMITTED 只允许事务读取已经被其他事务提交的变更。可以避免脏读问题，但不可重复读和幻读仍可能出现
    REPEATABLE——READ 确保事务可以多次从一个字段中读取相同的值。
    在这个事务持续期间，禁止其他事务对这个字段进行更新。可以避免脏读和不可重复读，但仍可能出现幻读
    SERIALIZABLE 确保事务可以多次从一个表中读取相同的行。
    在这个事务执行期间，禁止其他事务对该表执行插入、更新和删除操作。所有并发性问题都可以避免，但是性能十分低下
     -->

    <!-- 事务通知模式
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="*DAO" propagation="REQUIRED" isolation="DEFAULT"
                rollback-for="java.io.IOException" no-rollback-for="java.lang.IllegalStateException"
                timeout="30" read-only="false" />
            <tx:method name="insert" propagation="REQUIRED" />
        </tx:attributes>
    </tx:advice>
     -->
    <!-- 用事务通知声明式的管理事务 -->
    <!--
    <aop:config>
        <aop:pointcut id="baseService" expression="execution(* org.jhat.dao.*.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="baseService" order="1"/>
    </aop:config>
     -->
    <!-- Spring AOP 模式
    <bean id="userDAOProxy" class="org.springframework.transaction.interceptor.TransactionProxyFactoryBean">
        <property name="target" ref="userDAO" />
        <property name="transactionManager" ref="transactionManager" />
        <property name="transactionAttributes">
            <props>
                <prop key="insert">
                    PROPAGATION_REQUIRED,
                    ISOLATION_DEFAULT,
                    -java.io.IOException,+java.lang.IllegalStateException,
                    timeout_30,readOnly
                </prop>
            </props>
        </property>
    </bean>
     -->

</beans>
```
