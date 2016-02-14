---
title: PPTP Client配置
category: Linux/Unix
tags: [Ubuntu, Linux, PPTP, VPN]
---

#### 1. 安装PPTP Client

```bash
sudo apt-get install pptp-linux
```


#### 2. 创建VPN连接

```
sudo pptpsetup --create vpn --server vpnserver_host_or_vpnserver_ip --username vpnname --password vpnpassword --encrypt
```
    
参数说明：

```
--create vpn                                创建一个名为vpn的连接
--server vpnserver_host_or_vpnserver_ip     指示VPN服务器的主机名或IP地址
--username vpnname                          VPN服务器提供的VPN帐号名
--password vpnpassword                      对应的密码
--encrypt                                   mppe-128加密
```

#### 3. 连接VPN

```bash
sudo pon vpn
```
    
运行`ifconfig`会发现多了一个`ppp0`的网络接口，说明VPN连接成功。

#### 4. 断开VPN

```bash
sudo poff vpn
```
    
再次运行`ifconfig`会发现刚才那个`ppp0`的网络接口消失，说明VPN断开成功

#### 5. 几个配置文件

当完成步骤2后，对如下文件做了修改：

首先是创建了文件`/etc/ppp/peers/vpn`，在这个文件中存放VPN的各个参数信息，步骤2产生的文件内容如下

```
# written by pptpsetup
pty "pptp vpnserver_host_or_vpnserver_ip --nolaunchpppd"
lock
noauth
nobsdcomp
nodeflate
name vpnname
remotename vpn
ipparam vpn
require-mppe-128
```

再有就是`/etc/ppp/chap-secrets`文件，这里面主要存放用户名和密码，步骤2完成后，这个文件会增加如下内容

```
# added by pptpsetup for vpn
vpnname vpn vpnpassword *
```

所以完全可以自己手动配置VPN连接，唯一需要注意的就是文件存放路径，新建的VPN连接配置信息放在`/etc/ppp/peers/`下，文件名与VPN连接名相同，用户名和密码统一放在`/etc/ppp/chap-secrets`。

#### 6. 参考资料

<http://pptpclient.sourceforge.net/howto-ubuntu.phtml#configure_by_hand>
