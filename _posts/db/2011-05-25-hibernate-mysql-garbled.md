---
title: Hibernate连接MySQL中文乱码解决方案
category: 数据库
tags: [MySQL, Hibernate]
---

在url最后加上

```bash
?useUnicode=true&amp;characterEncoding=UTF-8
```


完整实例

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:p="http://www.springframework.org/schema/p"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="http://www.springframework.org/schema/beans
  http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
 
  <bean class="org.apache.commons.dbcp.BasicDataSource" id="dataSource">
      <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
      <property name="url" value="jdbc:mysql://121.48.159.100:3306/database?useUnicode=true&amp;characterEncoding=UTF-8"/>
      <property name="username" value="user"/>
      <property name="password" value="password"/>
      <property name="maxActive" value="100"/>
      <!-- 获得最大的连接空间byte -->
      <property name="maxIdle" value="30"/>
      <!-- 获得连接的最大等待时间 -->
      <property name="maxWait" value="500"/>
      <property name="defaultAutoCommit" value="true"/>
  </bean>
   
  <bean class="org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean" id="sessionFactory">
      <property name="dataSource">
          <ref bean="dataSource"/>
      </property>
      <property name="hibernateProperties">
          <props>
              <prop key="hibernate.dialect">org.hibernate.dialect.MySQLDialect</prop>
              <prop key="hibernate.show_sql">true</prop>
              <prop key="hibernate.format_sql">true</prop>
              <prop key="connection.useUnicode">true</prop>
              <prop key="connection.characterEncoding">UTF-8</prop>
              <prop key="query.factory_class">org.hibernate.hql.classic.ClassicQueryTranslatorFactory</prop>
           </props>
       </property>
       <property name="mappingResources">
           <list>
               <value>org/jhat/bean/Admin.hbm.xml</value>
           </list>
       </property>
   </bean>
    
   <bean id="transactionManager" class="org.springframework.orm.hibernate3.HibernateTransactionManager">
       <property name="sessionFactory" ref="sessionFactory"/>
   </bean>
</beans>
```
