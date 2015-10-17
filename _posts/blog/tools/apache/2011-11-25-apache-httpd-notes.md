---
title: Apache Httpd学习笔记
category: 编程工具
tags: [Linux, Ubuntu, Apache, SSL]
---

1. 常用管理命令

    ```bash
    a2enmod mods_name   # enable mod
    a2ensite site_name  # enable site
    a2dismod mods_name  # disable mod
    a2dissite site_name # disable site
    ```


2. URL跳转

    启用`rewrite`模块 ：

    ```bash
    a2enmod rewrite
    ```
    
    在VirtualHost中加入： 

    ```apache
    # 匹配所有非https协议的访问
    RewriteEngine On 
    RewriteCond %{SERVER_PROTOCOL} !^https$ 
    # 将RewriteCond匹配的URL跳转至https协议
    RewriteRule ^(.*) https://%{SERVER_NAME}$1 [L,R]
    ```

3. 正则表达式匹配

    这个太有用了！如`AliasMatch`, `ScriptAliasMatch`, `DirectoryMatch`等，慎用`(.*)`

4. 启用SSL
    - 启用SSL模块：

        ```bash
        a2enmod ssl
        ```
    - 生成证书文件：

        ```bash
        openssl genrsa -des3 -out server .key 1024
        openssl req -new -key server .key -out server .csr
        openssl x509 -req -days 365 -in server .csr -signkey server .key -out server .crt
        ```
    - 在default-ssl中加入如下配置： 

        ```apache
        SSLEngine on 
        SSLCertificateFile    /etc/apache2/ssl/server.crt 
        SSLCertificateKeyFile /etc/apache2/ssl/ server .key
        SSLOptions +StrictRequire
        ```

5. 自动输入SSL密码

    编写脚本`pass`(需要有`x`权限)
    
    ```bash
    echo PASSWORD
    ```

    在`/etc/apache2/httpd.conf`中加入如下配置即可
    
    ```apache
    SSLPassPhraseDialog exec:$PATH/pass
    ```
