---
title: Ubuntu字符集乱码问题
category: Linux/Unix
tags: [Linux, Ubuntu]
---

昨天将两个项目移植到笔记本上，发现全都出现乱码，最开始以为是MySQL的原因，所以从终端直接查看数据库，结果显示又是正常的，然后回到台式机，结果又一切正常……于是又设置Ubuntu语言支持，结果还是不对。正好升级过Ubutnu不久，重启后发现提示修改几个默认目录的命名方式（全变成英文的了），但是没注意。结果在从终端查看数据库，结果这也乱码了，然后再运行ls命令，发现中文文件也乱码，这下问题就严重了。


到网上搜索了一下，发现是本地化出错。运行`locale`命令的结果为：

```
locale: Cannot set LC_CTYPE to default locale: No such file or directory
locale: Cannot set LC_MESSAGES to default locale: No such file or directory
locale: Cannot set LC_ALL to default locale: No such file or directory
LANG=en_US.UTF-8
LC_CTYPE="en_US.UTF-8"
LC_NUMERIC="en_US.UTF-8"
LC_TIME="en_US.UTF-8"
LC_COLLATE="en_US.UTF-8"
LC_MONETARY="en_US.UTF-8"
LC_MESSAGES="en_US.UTF-8"
LC_PAPER="en_US.UTF-8"
LC_NAME="en_US.UTF-8"
LC_ADDRESS="en_US.UTF-8"
LC_TELEPHONE="en_US.UTF-8"
LC_MEASUREMENT="en_US.UTF-8"
LC_IDENTIFICATION="en_US.UTF-8"
LC_ALL=en_US.UTF-8
```

参照 <http://topic.csdn.net/u/20101008/21/9a370b1f-7e49-4689-9b66-ce2344ab0f40.html> 做了修改，但没成功（也许是对了，只不过需要重启，但我没有）。最后将`locale`卸载

```bash
sudo apt-get remove locales
```

重启之后，发现运行`ls`命令，中文文件显示没问题了，但是移植的两个项目还是乱码，在终端里面查看数据库依然乱码。最后重新导入SQL脚本后，一切恢复正常。
