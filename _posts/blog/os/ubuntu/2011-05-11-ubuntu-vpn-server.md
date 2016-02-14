---
title: Ubuntu下架设VPN服务器
category: Linux/Unix
tags: [Linux, Ubuntu, PPTP, IPTABLES, VPN]
---

#### 1. 安装`pptpd`

```bash
sudo apt-get install pptpd
```


#### 2. 主要配置文件及对应参数说明

+ `/etc/pptpd.conf`
    PPTP服务器的主配置文件
    1. `option option-file`
        - 指定一个选项文件，里面的内容作为pptpd进程启动时的命令行参数。
        - 在执行pptpd命令时使用 `--option` 选项指定参数效果是一样的
    2. `stimeout seconds`
        - 派生pptpctrl进程处理客户端连接以前，等客户端PPTP包的时间，单位为秒，默认是10s。
        - 主要用于防止DoS攻击
    3. `debug`
        - 启用调试模式
    3. `bcrelay internal-interface`
        - 是否启用广播包中继功能。如果启用，将把从internal-interface接口收到的广播包转发个客户端。
    4. `connections  n`
        - 限制客户端连接数，默认为100。
        - 如果由pptpd分配IP给客户端，则地址分配完后，客户端连接也不能建立。
    5. `delegate`
        - 默认情况该选项不存在。此时，由pptpd进程管理IP地址的分配，它将把下一个可分的IP分给客户端。
        - 如果该选项存在，则pptpd进程不负责IP地址分配，
        - 由客户端对应的pppd进程采用radius或chap-secrets方式进行分配。
    6. `localip ip-specification`
        - 在PPP连接隧道的本地端使用的IP地址（简单的说就是服务端地址）。
        - 如果只指定一个，则所有的客户端对应的服务端地址都是这个。
        - 否则，每个客户端都必须指定不同的服务端地址，服务端地址用完后，客户端的连接将被拒绝。
        - 如果使用了delegate选项，则该选项失效。
    7. `remoteip op-sepecification`
        - 指定分配给远程客户端的IP地址。每个连接的客户端都必须分配到一个IP地址。
        - 如果使用了delegate选项，则该选项失效。
    8. `noipparam`
        - 默认情况下，客户端原始的IP地址是传递给ip-up脚本。如果存在该选项，将不传递。
    9. `listen ip-address`
        - 指定本地网络接口的IP地址，pptpd进程将只监听这个网络接口的PPTP连接。默认监听所有本地接口。
    10. `pidfile pid-file`
        - 指定进程PID文件的位置和文件名。
    11. `speed speed`
        - 指定PPTP连接的速度，默认是115200bps,Linux系统中，该选项一般无效。
    12. `logwtmp`
        - 指定是否启用wtmp系统日志
+ `/etc/ppp/options.pptpd`
    - pptpd命令运行时的选项存放在该文件中
+ `/etc/ppp/chap-secrets`
    - 保存VPN客户端拨入时使用的用户名、密码、分配的IP地址（*表示任意IP）

#### 3. 示例配置
+ `/etc/pptpd.conf`

```
option /etc/ppp/options.pptpd
# debug
stimeout 10
# noipparam
logwtmp
# brcelay ech1
# delegate
connections 20
# localip 192.168.0.1
# remoteip 192.168.0.100-200
```

+ `/etc/ppp/chap-secrets`

```
# Secrets for authentication using CHAP
# client    server  secret  IP address
vpntest pptpd   vpnpassword *
```

上述配置是设置了一个用户名为vpntest的VPN账号，密码为vpnpassword，服务类型为pptpd，分配给该用户的IP地址未指定。

#### 4. 修改配置文件后，运行

```bash
/etc/init.d/pptpd start # 运行pptp进程
```

or

```bash
/etc/init.d/pptpd restart   # 重启pptp进程
```

配置信息才能生效。

#### 5. 检验PPTP服务器是否运行

在控制台输入命令

```bash
sudo netstat -anp | grep pptpd
```

将得到如下结果，说明PPTP服务器运行成功。

```
tcp     0   0.0.0.0:1723    0.0.0.0:*   LISTEN  6426/pptpd
unix    2   [ ]             DGRAM       54100   6426/pptpd
```

为了客户端能够顺利连接到VPN服务器，还需主机防火墙开放VPN端口（默认为1723）

```bash
sudo iptables -I INPUT -p tcp --dport 1723 -j ACCEPT
```

#### 6. 在VPN服务器上设置对于客户端IP地址的网络地址转换（NAT）

到目前为止，VPN服务器确实搭建完成，客户端也可以正常连接了，但是客户端却不能通过该VPN服务器上网，我们还需要为客户端IP地址设置网络地址转换（NAT）

查看 `proc/sys/net/ipv4/ip_forward` 文件中的值是否为 `1`，

如果不是，则需在 `/etc/sysctl.conf` 文件中添加一行 `net.ipv4.ip_forward=1` 

运行

```bash
sudo /etc/init.d/procps restart
sudo iptables --table nat --append POSTROUTING --out-interface eth0 --jump MASQUERADE
```

好吧，到这里VPN服务器搭建完成！！！

#### 7. 断开VPN连接以及VPN关闭VPN服务器

运行 `ifconfig` 来查看当前的VPN连接，如果想断开某个VPN连接，首先查询其PID，如：

```bash
cat /var/run/ppp0.pid
```

根据查询到得PID，将该进程结束即可断开该VPN连接

```bash
sudo kill 5834
```

至于pptp的PID，运行

```bash
sudo netstat -anp | grep pptpd
```

从返回的结果便可看出pptp的PID，如从上面的运行结果来看pptp的PID为：6426，那么运行

```bash
sudo kill 6426
```

即可关闭VPN服务。
