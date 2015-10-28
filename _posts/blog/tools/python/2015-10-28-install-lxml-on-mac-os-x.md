---
title: Install lxml on Mac OS X
category: 编程工具
tags: [Python, lxml, Mac]
---

在Mac OS X EI Captian(10.11.1)上安装`lxml`时遇到如下错误：

```
In file included from src/lxml/lxml.etree.c:239:

/private/tmp/pip_build_root/lxml/src/lxml/includes/etree_defs.h:14:10: fatal error: 'libxml/xmlversion.h' file not found

#include "libxml/xmlversion.h"

         ^

1 error generated.

error: command 'cc' failed with exit status 1
```

解决方法：

```bash
brew install libxml2
brew install libxslt
brew link libxml2 --force
brew link libxslt --force
```

如果再次出现同样的错误，运行上面4条命令之前需要先运行：

```bash
brew unlink libxml2
brew unlink libxslt
```

然后再安装`lxml`就可以了。

```bash
STATIC_DEPS=true sudo pip install lxml
```

10.9应该就有这样的问题了，应该可以用同样的方法解决。

参考：<http://stackoverflow.com/questions/19548011/cannot-install-lxml-on-mac-os-x-10-9>
