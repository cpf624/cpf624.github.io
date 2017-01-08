---
title: Java十进制数转二、八、十六进制数
category: 编程开发
tags: [Java]
---

计算机在储存数据时都是按照二进制储存的，如果我们需要获取一个十进制数的二进制、八进制、十六进制数该怎么弄呢？至于原理我就不再叙述了，网上到处都是，这里只是提供Java源代码，从控制台输入一个十进制正数，然后输出其二进制、八进制、十六进制数。


```java
package fourth;

import java.io.*;

/**
 * @author Jhat
 * @date 2010-5-7 下午11:48:55
 */
public class typeshift {

    public static void main(String[] args) {
        int num = 0;
        // 用于储存十进制数的二进制数(33是为了方便计算八进制数)
        int[] binary = new int[33];
        // 用于储存十进制数的八进制数
        int[] octonary = new int[11];
        // 用于储存十进制数的十六进制数
        String[] hexa = new String[8];
        getcomplement gc = new getcomplement();
        BufferedReader bf = new BufferedReader(new InputStreamReader(System.in));
        try {
            num = Integer.parseInt(bf.readLine());
            binary = gc.getbinary(num);
            octonary = gc.getoctonary(binary);
            hexa = gc.gethexa(binary);
        } catch(IOException e) {
            e.printStackTrace();
        }

        System.out.print(num + "的二进制数为： ");
        // 输出二进制补码
        for (int i = 1; i < binary.length; i++) {
            System.out.print(binary[i]);
        }
        System.out.println();

        System.out.print(num + "的八进制数为： ");
        // 输出八进制数
        for (int i = 0; i < octonary.length; i++) {
            System.out.print(octonary[i]);
        }
        System.out.println();

        System.out.print(num + "的十六进制数为： ");
        // 输出十六进制数
        for (int i = 0; i < hexa.length; i++) {
            System.out.print(hexa[i]);
        }
        System.out.println();

        System.out.println("************************");
        // 其实JDK类库已经提供了很方便的方法，直接就可以得到结果了
        System.out.println(Integer.toBinaryString(num).toString());
        System.out.println(Integer.toOctalString(num).toString());
        System.out.println(Integer.toHexString(num).toString());
    }
}
```

```java
package fourth;

/**
 * @author Jhat
 * @date 2010-5-7 下午11:59:43
 */
public class getcomplement {

    public int[] getbinary(int num) {
        int[] binary = new int[33];
        // 初始化数组
        for(int i = 0; i < binary.length; i++) {
            binary[i]=0;
        }

        // 由于计算机储存数据时就是按补码储存的，所以只需要不断按位取与将每一位的二进制数取出即可
        for (int j = binary.length - 1; j > 0; j--) {
            if ((num & 1) == 1) {
                binary[j] = 1;
            } else {
                binary[j] = 0;
            }
            num = (num >> 1);
        }

        /* 当然，要是完全自己弄也是可以的，不过很繁琐
        int i = binary.length - 1;
        if (num < 0) {
            // num为负数
            num = -num;
            // binary[0] = 1;
            // 获取该数绝对值的原码
            while(num > 0) {
                binary[i] = num % 2;
                num = num / 2;
                i--;
            }
            // 按位取反
            for (int j = 1; j < binary.length; j++) {
                if (binary[j] == 0) {
                    binary[j] = 1;
                } else {
                    binary[j] = 0;
                }
            }
            //加1
            for (int j = binary.length - 1; j >= 0; j--) {
                if (binary[j] == 0) {
                    binary[j] = 1;
                    break;
                } else {
                    binary[j]=0;
                }
            }
        } else {
            // num为正数
            while (num > 0) {
                binary[i] = num % 2;
                num = num / 2;
                i--;
            }
        }
        */

        return binary;
    }

    // 获取八进制数
    public int[] getoctonary(int[] binary) {
        int[] octonary = new int[11];
        // 初始化数组
        for (int i = 0; i < octonary.length; i++) {
            octonary[i] = 0;
        }
        int j = octonary.length - 1;
        for (int i = binary.length - 1; i > 0; i -= 3, j--) {
            octonary[j] = binary[i] + binary[i - 1] * 2 + binary[i - 2] * 4;
        }
        return octonary;
    }

    // 获取十六进制数
    public String[] gethexa(int[] binary) {
        String[] hexa = new String[8];
        // 初始化数组
        for (int i = 0; i < hexa.length; i++) {
            hexa[i] = "0";
        }
        int j = hexa.length - 1;
        for (int i = binary.length - 1; i > 0; i -= 4, j--) {
            int temp = binary[i] + binary[i - 1] * 2 + binary[i - 2] * 4 + binary[i - 3] * 8;
            if(temp > 9) {
                switch(temp) {
                case 10:
                    hexa[j] = "a";
                    break;
                case 11:
                    hexa[j] = "b";
                    break;
                case 12:
                    hexa[j] = "c";
                    break;
                case 13:
                    hexa[j] = "d";
                    break;
                case 14:
                    hexa[j] = "e";
                    break;
                case 15:
                    hexa[j] = "f";
                    break;
                default:
                    break;
                }
            } else {
                hexa[j] = Integer.toString(temp);
            }
        }
        return hexa;
    }
}
```
