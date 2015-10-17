---
title: 安装emacs-w3m
category: TOOLS
tags: [Linux, Emacs]
---

首先安装好Emacs和w3m

```bash
sudo apt-get install emacs w3m
```

然后到 <http://emacs-w3m.namazu.org> 下载emacs-w3m。

emacs-w3m安装步骤:

```bash
sudo ./configure
sudo make
sudo make install
```

按照官网的文档，需要在`~/.emacs`文件中加入：

```bash
(require 'w3m-load')
````

但是我发现这样依然没法使用emacs-w3m。最后在 <http://www.emacswiki.org/emacs/emacs-w3m#toc20> 看到一篇文档，按照上面的介绍，运行：

```bash
sudo apt-get install w3m-el-snapshot
```

至此emacs-w3m安装成功，运行emacs后，`M-x w3m`启动emacs-w3m。
