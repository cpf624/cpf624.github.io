---
title: SSH密钥认证
category: TOOLS
tags: [Linux, SSH]
---

1. 通过`ssh-keygen`命令生成密匙，很产生两个文件，和输入的名称一致的是私匙，以`.pub`结尾的是公匙

    ```bash
    ssh-keygen -t rsa -f jhat.ssh
    ```

2. 服务端将公匙文件内容加入：`~/.ssh/authorized_keys`

    ```bash
    cat jhat.ssh.pub >> ~/.ssh/authorized_keys
    ```

3. 客户端添加私匙

    ```bash
    ssh-add jhat.ssh
    ```
    
    或者在`~/.ssh/config`中加入：

    ```bash
    Host jhat.org
    IdentityFile /home/jhat/.ssh/jhat.ssh
    ```

4. 完成上诉操作后，ssh到服务器时即可不再输入密码……
