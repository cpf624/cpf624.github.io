---
title: MySQL远程连接
category: 数据库
tags: [MySQL]
---

1. 首先得让防火墙开放MySQL的端口，默认为3306

    ```bash
    iptables -A INPUT -p tcp --deport 3306 -j ACCEPT
    ```

2. 所使用的MySQL帐号得支持远程连接

    这个就简单多了，我们知道mysql.user这张表中有个Host字段，顾名思义，当然是指允许从哪里登录（主机名或主机IP）；比如说将某个帐号的Host设置为`%`

    ```bash
    mysql> update user set Host='%' where User='userName';
    ```

    做完这步之后还得重启MySQL或者运行：

    ```bash
    mysql> flush privileges;
    ```

    这样，更新后的用户权限才能生效，当然了，将Host设置为`%`是相当不安全的，因为这样以来任何一台主机都可以连接到你的MySQL上，所以一般是用`%`作为通配符来匹配一个IP地址段，或者满足匹配条件的主机名。


3. 成功了吗？

    作为上诉两步之后，我们运行：

    ```bash
    mysql -h 121.48.159.100 -p3306 -uuser -p -Ddatabase
    ```

    结果是什么情况呢？仍然会报错：

    ```
    ERROR 2003 (HY000): Can't connect to MySQL server on '121.48.159.100' (110)
    ```

4. 解决方案

    对于这个问题，郁闷了很久，很不容易在网上找到了一个可行的解决方案：
    
    修改配置文件/etc/mysql/my.cnf，将bind-address的值设置为0.0.0.0，然后重启MySQL

    ```bash
    /etc/init.d/mysql restart
    ```

     至此才真的可以远程连接MySQL了
