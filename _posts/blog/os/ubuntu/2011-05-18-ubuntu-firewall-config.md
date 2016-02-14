---
title: Ubuntu防火墙设置
category: Linux/Unix
tags: [Ubuntu, IPTABLES]
---

由于iptables的设置在重启后所有设置的规则都会消失，所以很有必要将我们设置好的规则保存至文件，让系统开机时自动加载。而在Red Hat下，提供了iptables的各种配置文件供用户修改，用以保存iptables的各种规则，以及开机自动加载规则等。但哥在Ubuntu下却没找到这些配置文件，是不是就没办法了呢？当然不是，只是稍微麻烦点点，既然Ubuntu默认情况下不提供这些配置文件，那我们就自己创建。


#### 1. 保存防火墙规则至`/etc/iptables`文件

```bash
iptables-save > /etc/iptables
```

需要注意的是上述命令必须以root用户运行！！！

#### 2. 从`/etc/iptables`文件中加载防火墙规则

```bash
iptables-restore < /etc/iptables
```

#### 3. 让系统关闭前自动保存防火墙规则，以及开机时自动加载防火墙规则

在`/etc/network/interfaces`文件中加入

```
# 加载防火墙规则
pre-up iptables-restore < /etc/iptables
# 保存防火墙规则
post-down iptables-save > /etc/iptables
```

***注意：是加入，不是覆盖！！！***

#### 4. 参考资料
- <http://www.linux.gov.cn/netweb/iptables.htm#ipsaverestore>
- <http://wiki.ubuntu.org.cn/IptablesHowTo#Saving_iptables_.E4.BF.9D.E5.AD.98.E8.AE.BE.E7.BD.AE>
