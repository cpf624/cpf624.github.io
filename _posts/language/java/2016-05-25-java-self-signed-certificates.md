---
title: Java自签名证书问题
category: 编程开发
tags: [Java, Maven, SSL]
---

使用[Sonatype Nexus](http://www.sonatype.com/nexus-repository-sonatype)自建了一个Maven仓库，出于安全考虑使用了 `HTTPS` 协议，不过 `SSL` 证书用的是自签名的证书，在使用[Maven](http://maven.apache.org)时遇到了如下错误:

```plain
sun.security.validator.ValidatorException: PKIX path building failed:
    sun.security.provider.certpath.SunCertPathBuilderException:
    unable to find valid certification path to requested target
```

这是因为自签名的证书不在Java的可信证书范围内，因此需要手动将对应证书加入Java的可信证书列表中，具体步骤如下:

### 1. 使用keytool导入证书

```bash
# cert_name.crt 为待导入的证书文件
# store_file 为导入的证书文件的存储文件名
# cert_name 为导入的证书存储别名
# 导入证书时需要输入密码，需要将该密码记住，后面将会用到
keytool -import -file cert_name.crt -keystore $JAVA_HOME/jre/lib/security/store_file -alias cert_name
```

### 2. 在Java程序的启动参数添加可信证书参数

```bash
# 123456即为上一步输入的密码
-Djavax.net.ssl.trustStorePassword=123456 -Djavax.net.ssl.trustStore=$JAVA_HOME/jre/lib/security/store_file
```

完成上述两步之后自签名的证书也就可以被Java程序所信任，不在出错。

对于[Maven](http://maven.apache.org)，只需要在 `MAVEN_OPTS` 环境变量中添加上述参数即可:

```bash
# 配置在 ~/.bash_profile 或 ~/.bashrc 中即可
export MAVEN_OPTS="$MAVEN_OPTS -Djavax.net.ssl.trustStorePassword=123456 -Djavax.net.ssl.trustStore=$JAVA_HOME/jre/lib/security/store_file"
```
