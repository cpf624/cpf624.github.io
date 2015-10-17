---
title: 几个很有用的MySQL命令
category: 数据库
tags: [MySQL]
---

1. 登录

    ```bash
    mysql -uroot -p --default-character="utf8"
    ```

2. 备份

    ```bash
    mysqldump -uroot -p --default-character="utf8" database > /home/jhat/Documents/database.sql
    ```

3. 恢复

    ```bash
    mysql -uroot -p --default-character="utf8" < /home/jhat/Documents/database.sql
    ```

    其中`--default-character="utf8"`是相当重要的，否则很容易出现乱码！！！

4. 添加用户

    ```bash
    grant all privileges on *.* to jhat@localhost identified by 'jhat' with grant option；
    ```
