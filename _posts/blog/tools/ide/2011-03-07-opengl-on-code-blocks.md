---
title: OpenGL Programing on Code::Blocks for Ubuntu
category: 编程工具
tags: [Linux, Ubuntu, OpenGL]
---

#### 1. 安装Code::Blocks

* 一个安装教程：<http://forum.ubuntu.org.cn/viewtopic.php?t=59230>
* 本人是先到 <http://www.codeblocks.org/downloads/26> 下载下来解压后发现里面有很多`.deb`文件，不管，直接运行

```bash
sudo dpkg -i *.deb
```

* 全部安装。由于使用的是Ubuntu 10.04，系统版本算很新的了，所以会提示缺少什么库，再安装相应的库即可。
* 如果不行，会发现Code::Blocks无法运行，那么运行

```bash
sudo apt-get -f install
```

* 根据提示操作，安装需要的库，以及建立关联后，Code::Blocks即可使用了。


#### 2. 安装OpenGL库

```bash
sudo apt-get install freeglut3 freeglut3-dev
```

* 安装完成后，用Code::Blocks建立OpenGL的工程，且可以使用。
* 建立OpenGL GLUT工程时，需要选择`glut`的路径。对应选项的值如下：

```ini
base: /usr
include: /usr/include
lib: /usr/lib
```

* 其它的就可以不管了。但是会发现，依然没法编译，会出现一个关于`Xxf86vm`的错误。
* 在网上找了很久，几乎都是说修改Code::Blocks里面的`Linker Setting`，蒋关于`Xxf86vm`的关联删除即可，但是找了半天Code::Blocks就没得这个。
* 既然报这个错，那就安装相应的库就是了，所以运行：

```bash
sudo apt-get install libxxf86vm-dev
```

* 这下编译顺利通过。

#### 3. 其它

由于实现没有做记录，配置成功后再写的这篇日志，所以可能有些细节之处忘了，容易导致缺失默写库，不过没关系，把那一大堆库都装一下，反正都不大。

```bash
sudo apt-get install mesa-common-dev libgl1-mesa-dev libglu1-mesa-dev
sudo apt-get install freeglut3-dev
sudo apt-get install build-essential gdb subversion #这行可以不需要
sudo apt-get install automake autoconf libtool
sudo apt-get install libgtk2.0-dev libxmu-dev libxxf86vm-dev
```

* 参考：<http://hi.baidu.com/yeyaxx/blog/item/0cd147f314a2c4da0b46e03e.html>
* 如果还差，那就是：

```bash
sudo apt-get install libglut3 libglut3-dev
```
