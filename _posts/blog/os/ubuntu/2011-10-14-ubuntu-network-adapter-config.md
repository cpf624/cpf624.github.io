---
title: Ubuntu网卡配置
category: Linux/Unix
tags: [Linux, Ubuntu]
---

#### 1. 查看网卡信息

```bash
ifconfig #查看当前激活的网卡信息
sudo ifconfig -a #查看所有网卡信息，包含禁用的网卡
```

#### 2. 禁用/激活网卡

```bash
sudo ifconfig eth0 up #激活设备名为eth0的网卡
sudo ifconfig eth0 down #禁用备名为eth0的网卡
```

#### 3. 查看无线链接情况

```bash
iwconfig
```

#### 4. 修改网卡接口名
修改`/etc/udev/rules.d/70-persistent-net.rules`文件中的`NAME`字段，重启后生效

#### 5. 配置网卡信息
`/etc/network/interfaces`如：在该文件加入如下配置后，开机自动为`eth0`以`DHCP`方式获取IP

```bash
auto eth0
iface eth0 inet dhcp
```

#### 6. 重启网络

```bash
sudo /etc/init.d/networking restart
```
