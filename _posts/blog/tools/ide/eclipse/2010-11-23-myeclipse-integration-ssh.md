---
title: MyEclipse整合SSH
category: 编程工具
tags: [Eclipse, Hibernate, J2EE, Java, MySQL, Spring, Struts2, Tomcat]
---

## 1. 准备工作

#### 1.1. 软件准备及安装

```
JDK1.6.0_20 (>1.5)
Apache Tomcat/6.0.26 (>5.x)
MySQL 5.1.51-community (>5.x)
MyEclipse 8.6 for Spring (版本关系不大，版本越高，只是开发越方便)
```


#### 1.2. 环境变量

配置在系统变量中，如果不存在新建即可

```
JAVA_HOME=E:\Program\Java #此为JDK安装路径
CATALINA_HOME=E:\Program\Tomcat #此为Tomcat安装路径，如果不是下载的安装包，也可以是解压后的存放位置
# 配置环境， .; 开头需要这样如果不是开头，那么就在原有环境变量的基础上接着写即可，不过记住每个环境变量需以 ;  结尾
PATH=.;%JAVA_HOME%\bin;%JAVA_HOME%\lib;%CATALINA_HOME%\bin;E:\Program\MySQL\bin;
CLASSPATH=.;%JAVA_HOME%\lib;%CATALINA_HOME%\lib
```

配置完成后在dos下运行如下命令以检验JDK环境是否配置成功。

```bash
java -version
```

其实CLASSPATH配置为:

```
CLASSPATH=.;%JAVA_HOME%\lib\tools.jar;%JAVA_HOME%\lib\dt.jar;
```

也可以，但是更高级的一些功能无法满足，所以按上述配置，那么lib文件夹下的jar都可以被加载。

## 2. 打开MyEclipse先配置好Tomcat服务器和JDK

***操作如下图所示***

#### 2.1. Window -> Preferences -> Java: Installed JREs

在这里可以不使用MyEclipse自带的JDK，得`Add…`自己安装好的JDK ：

![Add Installed JDK]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/add_installed_jdk.jpg)

#### 2.2. Window -> Preferences -> MyEclipse -> Servers: Tomcat 6.x

在这里配置Tomcat服务器，我们这里是选择`6.x` 。`Browse…`自己将Tomcat解压放的目录，再选择`Enable`将它启用，然后`Apply`应用一下就Ok了。

![Enable Tomcat 6.x]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/enable_tomcat_6x.jpg)

#### 2.3. Window -> Preferences: Tomcat 6.x -> JDK 选择前面我们配好的JDK版本。

![Select JDK for Tomcat]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/select_jdk_for_tomcat.jpg)

#### 2.4. 现在我们来启动Tomcat服务器，打开内部的浏览器测试Tomcat有没有配置成功

***如下图所示：则表示Tomcat服务器配置成功。***

![Test Tomcat Config]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/test_tomcat_config.jpg)

#### 2.5. Window -> Preferences -> Java -> Build Path: User Libraries

在这里配置用户自己要用jar包的Libraries 。

***PS: 这一步可以到后面需要添加自己的jar包时，再做也可以的。***

![Build Path User Libraries]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/build_path_user_libraries.jpg)

#### 2.6. 右键项目 -> Build Path -> Add Liberies

在这里将自己上面配置好的Libraries添加到编译请求的路径里。

***PS: 这一步可以到后面需要添加自己的jar包时，再做也可以的。***

![Build Path Add Libraries]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/build_path_add_libraries.jpg)

![Add Library Select Type]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/add_library_select_type.jpg)

![Add Library Select Libraries]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/add_library_select_libraries.jpg)

## 3. 创建好Web项目

***最先Add Spring如下图所示***

#### 3.1. 选择项目名，右击 ->MyEclipse ->Add Spring Capabilities…

![Add Spring Capabilities]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/add_spring_capablilities.jpg)

#### 3.2. 勾选好`Spring3.0`的五个核心Libraries，注意将它们Copy到`/WebRoot/WEB-INF/lib`目录下，再点击Next

![Add Spring Capabilities Select Spring]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/add_spring_capablilities_select_spring.jpg)

![Add Spring Capabilities Config Spring]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/add_spring_capablilities_config_spring.jpg)

#### 3.3. 完成后，项目中将会出现Spring添加的东西，有时候可能会出现不名的错误，现在暂时不需管它(推荐刷新项目) ，有些原因是因为Spring的Xml配置文件里引入的东西有冲突。

![Finish and Refresh]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/finish_and_refresh.jpg)

## 4. 创建数据源，切换到MyEclipse Database Explorer窗口

![MyEclipse Database Explorer]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/myeclipse_database_explorer.jpg)

#### 4.1. 在左边`DB Browser`的窗口里， 右击选择`New…`新建一个数据源，出如下图所示的窗口 ：

根据自己项目所建的数据库来选择配置，引入连接驱动JARs包。

![Config Database Driver]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/config_database_driver.jpg)

#### 4.2. 配好后，点击`Test Driver`来测试配置连接是否成功。

下图所示则表示成功了， 再进行下一步操作。

![Test Database Driver]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/test_database_driver.jpg)

#### 4.3. Schema Details 选择连接映射的数据库， 没必要将全部的数据库连接进来。

![Selection Needed]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/selection_needed.jpg)

#### 4.4. 配置好以后，然后选择它将它`Open connection…`打开看一看，能否将数据连接过来：

![Open Connection]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/open_connection.jpg)

## 5. 再将窗口切换回来， 现在添加 Hibernate 3.3

#### 5.1. 选择项目名，右击 ->MyEclipse ->Add Hibernate Capabilities…

这里可以选择支持`Annotations`注解方式来进行SSH的集成。注意将Library Copy到`/WebRoot/WEB-INF/lib`目录下

![Add Hibernate Capabilities]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/add_hibernate_capabilities.jpg)

#### 5.2. 在对话框中选择Spring configuration file，表示我们希望将Hibernate托管给Spring进行管理，这是将Hibernate与Spring进行整合的基础。
然后点击 Next

![Hibernate Config Spring Config]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/hibernate_config_spring_config.jpg)

#### 5.3. 在出现的对话框中选择Existing Spring configuration file 。

因为我们已经添加了Spring的配置文件，所以这里选择的是已存在的配置文件。MyEclipse会自动找到存在的那个文件。

然后在SessionFactory Id中输入Hibernate的SessionFactory在Spring中的名字，这里我们输入`sessionFactory`即可。

然后点击Next ：

![Hibernate Config Exists Spring]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/hibernate_config_exists_spring.jpg)

#### 5.4. 在出现的对话框中的Bean Id里面输入数据源在Spring中的Bean Id的名字，这里我们输入`dataSource`。

然后在DB Driver里面选择我们刚刚配置好的ssh，MyEclipse会将其余的信息自动填写到表格里面。

然后点击Next ：

![Hibernate Config Select DB Driver]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/hibernate_config_select_db_driver.jpg)

#### 5.5. 在出现的对话框中取消 Create SessionFactory class 。点击 Finish 即可。

![Hibernate Config Finish]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/hibernate_config_finish.jpg)

## 6. 集成Struts

通过实践发现用MyEclipse自动添加的方式很不好，所以建议手动添加

#### 6.1. 首先进入：`WEB-INF/lib`下将一些多余的jar包删除

```
com.springsource.net.sf.cglib-2.2.0.jar
com.springsource.org.apache.commons.fileupload-1.2.0.jar
com.springsource.org.apache.commons.lang-2.4.0.jar
com.springsource.org.apache.commons.logging-1.1.1.jar
com.springsource.org.apache.commons.pool-1.5.3.jar
com.springsource.org.apache.log4j-1.2.15.jar
```

#### 6.2. 再添加如下Jar包

```
commons-fileupload-1.2.1.jar
commons-io-1.3.2.jar
commons-logging-1.0.4.jar
commons-logging-adapters-1.1.jar
commons-logging-api-1.1.jar
commons-pool-1.5.5.jar
freemarker-2.3.16.jar
jboss-archive-browsing.jar
jdbc2_0-stdext.jar
struts2-core-2.2.1.jar
struts2-spring-plugin-2.2.1.jar
xml-apis.jar
xwork-core-2.2.1.jar
```

到这里，我们整个项目的框架就算初步成形了，下面我们可以到MyEclipse Java Enterprise 视图下查看一下整个项目的结构，再进行后续操作。
如下图所示：

![MyEclipse Java Enterprise]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/myeclipse_java_enterprise.jpg)

## 7. Hibernate Reverse Engineering反向生成Pojo类，自动生成映射关系

#### 7.1. 再进入到MyEclipse Database Explorer视图，全选中所有的表，右击选择`Hibernate Reverse Engineering…`操作，如下图所示：

![Hibernate Reverse Engineering]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/hibernate_reverse_engineering.jpg)

#### 7.2. Java src folder: 选项`Browse…`到自己新建好的包下面，我这里是放到 Model(或者DTO) 层，如下图所示：

![Select Java Source Folder]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/select_java_source_folder.jpg)

#### 7.3. 再选择*.hbm.xml和POJO映射，注意我们不需选择：`Create abstract class`，再Next:

![Hibernate Mapping Config]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/hibernate_mapping_config.jpg)

#### 7.4. 下一步再选择`Id Generator`的生成策略，我们选`native`，再点Next，如下图所示 :

![Hibernate Mapping Id Generator]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/hibernate_mapping_id_generator.jpg)

#### 7.5. 接下来，默认选项，直接点击Finish完成这项操作，如下图所示：

![Hibernate Mapping Finish]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/hibernate_mapping_finish.jpg)

#### 7.6. 最后回到MyEclipse Java Enterprise视图，查看是否已成功生成映射文件，如下图所示 ：

![Hibernate Config Verify]({{ site.assetsurl }}/assets/images/blog/tools/ide/eclipse/myeclipse-integration-ssh/hibernate_config_verify.jpg)

到这里我们就将SSH整合的所有操作都做好了，接下来就是进行编码工作，修改相应的XML配置文件，最后到完成项目，发布web项目，启动web服务器，运行测试项目。

祝君马到成功！ ~

## 8. 添加在web.xml文件里的配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="2.5" xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">
    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>

    <!-- 配置FilterDispatcher拦截器，以便加Spring容器 -->
    <filter>
        <filter-name>struts2</filter-name>
        <filter-class>org.apache.struts2.dispatcher.FilterDispatcher</filter-class>
        <!--
        <filter-class>org.apache.struts2.dispatcher.ng.filter.StrutsPrepareAndExecuteFilter</filter-class>
        <filter-class>org.apache.struts2.dispatcher.FilterDispatcher</filter-class>
        -->
    </filter>
    <filter-mapping>
        <filter-name>struts2</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <filter>
        <filter-name>struts-cleanup</filter-name>
        <filter-class>org.apache.struts2.dispatcher.ActionContextCleanUp</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>struts-cleanup</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!-- 配置Spring容器，让Spring知道事务管理的bean所在 -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath*:/application/applicationContext-*.xml</param-value>
    </context-param>

    <!-- 在Struts2感知下配置Spring容器 -->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!-- 添加事务配置Hibernate使用Session的关闭与开启由spring 来管理，针对Hivernate懒加载；
        把一个Hibernate Session和一次完整的请求过程对应的线程相绑定：
            配置 OpenSessionInViewFilter或OpenSessionInViewInterceptor
        singleSession默认为true,若设为false则等于没用OpenSessionInView
    -->
    <!--
    <filter>
        <filter-name>hibernateFilter</filter-name>
        <filter-class>org.springframework.orm.hibernate3.support.OpenSessionInViewFilter</filter-class>
        <init-param>
            <param-name>singleSession</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>hibernateFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    -->

    <!-- 添加字符编码过滤器 Character Encoding 配置 -->
    <filter>
        <filter-name>Spring character encoding filter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>Spring character encoding filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!-- 引入DWR框架，做Ajax应用： -->
    <!--
    <servlet>
        <servlet-name>DWRServlet</servlet-name>
        <servlet-class>>org.directwebremoting.servlet.DwrServlet</servlet-class>
        <init-param>
            <param-name>debug</param-name>
            <param-value>true</param-value>
        </init-param>
        <init-param>
            <param-name>classes</param-name>
            <param-value>java.lang.Object</param-value>
        </init-param>
        <load-on-startup>2</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>DWRServlet</servlet-name>
        <url-pattern>/dwr/*</url-pattern>
    </servlet-mapping>
    -->
</web-app>
```

## 9. 添加在Spring的配置文件

#### 9.1. 连接池`dataSource`的配置：applicationContext-dataSource.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver" />
        <property name="url" value="jdbc:mysql://localhost/jhat" />
        <property name="username" value="Jhat" />
        <property name="password" value="Jhat" />
        <property name="maxActive" value="100" />
        <!-- 获得最大的连接空间byte -->
        <property name="maxIdle" value="30" />
        <!-- 获得连接的最大等待时间 -->
        <property name="maxWait" value="500" />
        <property name="defaultAutoCommit" value="true" />
    </bean>

    <bean id="sessionFactory" class="org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean">
        <property name="dataSource" ref="dataSource" />
        <property name="hibernateProperties">
            <props>
                <prop key="hibernate.dialect">org.hibernate.dialect.MySQLDialect</prop>
                <prop key="hibernate.show_sql">false</prop>
                <prop key="hibernate.format_sql">true</prop>
                <prop key="connection.useUnicode">true</prop>
                <prop key="connection.characterEncoding">UTF-8</prop>
                <prop key="query.factory_class">org.hibernate.hql.classic.ClassicQueryTranslatorFactory</prop>
                <!-- 避免Hibernate生产HQL是产生乱码 -->
            </props>
        </property>
        <property name="mappingResources">
        <list>
            <value>org/jhat/bean/User.hbm.xml</value>
            <value>org/jhat/bean/Major.hbm.xml</value>
            <value>org/jhat/bean/Academy.hbm.xml</value>
            <value>org/jhat/bean/Group.hbm.xml</value></list>
        </property>
    </bean>
</beans>
```

#### 9.2. 添加处理业服务层的 Beans ，applicationContext-service.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
        http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-3.0.xsd">
    <bean id="userService" class="org.jhat.service.impl.UserServiceImpl">
        <property name="userDAO" ref="userDAO" />
    </bean>

    <bean id="userServiceProxy" class="org.springframework.aop.framework.ProxyFactoryBean">
        <property name="target" ref="userService"/>
        <property name="interceptorNames">
            <list>
                <value>baseLogBeforeAdvice</value>
                <value>baseLogAfterAdvice</value>
                <value>baseLogThrowAdvice</value>
                <!--
                <value>baseAroundAdvice</value>
                -->
            </list>
        </property>
    </bean>
</beans>
```

#### 9.3. 配置事务管理(相当于Spring AOP面向切面的配置)

9.3.1. 配置spring提供的事务管理的bean: HibernateTransactionManager对象。

```xml
<-- spring 提供的事务管理的 bean -->
<bean id="transactionManager" class="org.springframework.orm.hibernate3.HibernateTransactionManager">
    <property name="sessionFactory" ref="sessionFactory" />
</bean>
```

9.3.2. 配置spring提供的将事务管理作为切面的作用于目标对象的代理bean: TransactionProxyFactoryBean对象。

```xml
<bean id="proxyObj" abstract="true"
    class="org.springframework.transaction.interceptor.TransactionProxyFactoryBean">
    <!— 这是一个抽象类 , 只供类 (target 对象 ) 继承 -->
    <property name="transactionManager" ref="transactionManager" />
    <property name="transactionAttributes">
        <props>
            <prop key="up*">PROPAGATION_REQUIRED</prop>
        </props>
    </property>
</bean>
```

9.3.3. 现在可以配置target目标对象(Dao)。[这里与普通的Dao配置不同]

```xml
<bean id="accountDao" parent="proxyObj">
    <!— 这里指明其父类为以上代理 bean -->
    <property name="target">
        <bean class="com.***.daoimp.AccountDaoImp">
            <property name="sessionFactory" ref="sessionFactory" />
        </bean>
    </property>
</bean>


<import resource= "applicationContext_basd.xml" />
```

## 10. 添加在Struts2.x中struts.xml文件的配置

+ **struts.xml**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE struts PUBLIC "-//Apache Software Foundation//DTD Struts Configuration 2.1//EN" "http://struts.apache.org/dtds/struts-2.1.dtd">
<struts>
    <include file="struts-user.xml"/>
    <package name="default" extends="struts-default">
        <global-results>
            <result name="">/index.jsp</result>
            <result name="error">/error.jsp</result>
        </global-results>
        <global-exception-mappings>
            <exception-mapping exception="java.lang.Exception" result="error"/>
        </global-exception-mappings>
    </package>
</struts>
```

+ **struts.properties**

```
# Integration spring and struts
struts.i18n.encoding=UTF-8
struts.devMode=true
struts.configuration.xml.reload=true
struts.custom.i18n.resources=globalMessages
struts.i18n.reload=true
# struts.objectFactory=org.apache.struts2.spring.StrutsSpringObjectFactory
struts.objectFactory=spring
struts.ui.theme=simple
struts.ui.templateDir=template
struts.ui.templateSuffix=ftl
```

## 11. Log4j

+ **log4j.properties**

```
log4j.rootLogger=info,stdout
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout

# Pattern to output the caller's file name and line number.
log4j.appender.stdout.layout.ConversionPattern=%d %5p (%c:%L) - %m%n

# Print only messages of level ERROR or above in the package noModule.
log4j.logger.noModule=FATAL

# OpenSymphony Stuff
log4j.logger.com.opensymphony=ERROR
log4j.logger.org.apache.struts2=ERROR
# Spring Stuff
log4j.logger.org.springframework=ERROR

# EHCache
# log4j.logger.net.sf.hibernate.cache=debug
log4j.logger.org.hibernate=ERROR
```
