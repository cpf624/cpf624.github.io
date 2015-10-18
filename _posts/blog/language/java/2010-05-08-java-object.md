---
title: Java对象
category: 编程开发
tags: [Java]
---

在Java中虽然没有了指针，但是个人觉得其实它还是有的，只不过是Java帮用户处理了，比如说this就是一个很好的实例。Java中对象同样也用到指针。前段时间在写一个程序时，其中有一段就需要不断的应用同样的对象，当时没注意到一个实例对象实际上保存的是一个内存地址，导致将多个对象添加到一个ArrayList中后，得到的结果全是最后添加的一个对象。弄了N久也不知道是怎么回事，最后请教了高手才知道，原来就是因为指针的问题。由于对象保存的是内存地址，所以没用一次对象，就必须新new一个对象，否则应用的都是同一个内存地址上的对象。对于初学者很重要啊，《Think in Java》也是一本相当不错的书，解决了很多初学者的疑惑。


下面是自己弄的一段程序代码:

```java
package StudentsInformation;

import java.io.*;

/**
 * 从文件中录入数据
 * @author Jhat
 * @date 2010-4-25 下午11:50:08
 */
public class AddInf {

    Chain c=new Chain();

    public Chain readfile() {
        String[] rd = new String[100];
        int i = 0;
        try {
            FileReader filepath = new FileReader(
                "F:/MyProgram/Java/ClassManagement/StudentsInformation/add.txt");
            BufferedReader bf = new BufferedReader(filepath);
            rd[0] = bf.readLine();
            while (rd[i] != null) {
                i++;
                rd[i] = bf.readLine();
            }
            filepath.close();
            bf.close();

            for( int j = 0; j < i; j++) {
                Person per = new Person(); //这里相当重要
                String[] inf = rd[j].split(" ");
                per.name = inf[0];
                per.sex = inf[1];
                per.age = inf[2];
                per.ID = inf[3];
                per.phone = inf[4];
                c.Add(per);
            }

            System.out.println("add ok!");
        } catch(IOException e) {
            e.printStackTrace();
        }
        return c;
    }

}
```
