---
title: Tomcat 启用SSL
category: 编程工具
tags: [Tomcat, SSL]
---

1. 生成证书文件

    ```bash
    keytool -genkey -alias tomcat -keyalg RSA -keypass changit -storepass changit -keystore server.keystore -validity 3600
    ```

2. 导出证书

    ```bash
    keytool -export -trustcacerts -alias tomcat -file server.cer -keystore  server.keystore -storepass changit
    ```

3. 将证书导入受信任的证书库

    ```bash
    keytool -import -trustcacerts -alias tomcat -file server.cer -keystore  $JAVA_HOME/jre/lib/security/cacerts -storepass changeit
    ```

4. 在server.xml中启用SSL

    ```xml
    <Connector port="8443" protocol="org.apache.coyote.http11.Http11Protocol" SSLEnabled="true"
        maxThreads="150" scheme="https" secure="true" clientAuth="false" sslProtocol="TLS"
        keystoreFile="tomcat.keystore" keystorePass="tomcat" />
    ```
