---
title: Strut2参数注入问题
category: 编程开发
tags: [Java, J2EE, Strut2]
---

很久以前的问题了，一直没记录下来。头一天晚上工作室一哥们遇到的，帮着弄了半天没解决，结果第二天晚上我也遇到了，弄了很久没终于解决了。

本以为action中的field不需要getter，所以就将其去掉了，运行的时候发现，对于Java提供的基本数据类型不会有任何问题，如果是自己新建的bean，那么从页面传回来的值，bean只有一个属性是正确的，其它全为null。找了半天，刚开始以为是配置问题，然后修改，该来该去就那样，始终没发解决。偶然发现action中没有写对应的getter，于是加上去，再次运行，一切正常。

至于为什么有待研究struts2的实现机制……