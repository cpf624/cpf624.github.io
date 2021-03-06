---
title: 纠结的特殊字符
category: 编程开发
tags: [Java, C/C++, HTML, XML, JavaScript, Shell]
---

和特殊字符纠结了N久，还是简单的总结一下常用的特殊字符。

1. `\`

    该字符主要用于转义字符用，如表示 `\` 本身，需要用其进行转义，即为：`\\` 。常见的程序设计语言都是如此，如：C/C++, Java, JavaScript, Shell等。

2. `"`

    在C/C++, Java, JavaScript等程序设计语言中，均用于标识字符窜的开始和结束。如果仅是作为一个字符存在，需用 `\` 转义，即为： `\"` 。而在HTML、XML中，可以用 `&quot;` 表示，当然也可以使用其它进制进行编码。而在Shell中，字符窜中间可使用变量代替某些值。

3. `'`

    在C/C++, Java中，作为一个字符的开始和结束标志，在字符窜中不需要进行转义。而在JavaScript中，和 `"` 的作用是一致的，所以当表示 `'` 本身时需要用 `\` 转义，另外可以和 `"` 嵌套使用，如 `'a"b"c'` 是一个完整的字符窜，但不能用相同的字符进行嵌套使用，如 `'a'b'c'` 或 `"a"b"c"` 就存在语法错误了。在Shell中， `'` 之间的就完全是字符窜了，所以中间没法出现变量，即便有，也当作字符窜处理，失去变量的意义。

4. `&`

    在C/C++, Java, JavaScript, Shell中作为算数与运算符，当两个连用 `&&` 时，表示逻辑与。而在HTML、XML中需要用 `&amp;` 进行转义，或者使用其它编码。

5. `<`

    在C/C++, Java, JavaScript为小于运算符，而在HTML、XML中作为一个标签的开始，所以当需要表示 `<` 字符时，需要用 `&lt;` 转义或者使用其它编码。

6. `>`

    在C/C++, Java, JavaScript为小于运算符，而在HTML、XML中作为一个标签的开始，所以当需要表示 `>` 字符时，需要用 `&gt;` 转义或者使用其它编码。

7. (空格)

    在HTML、XML用 `&nbsp;` 进行转义。

8. `%`

    在C/C++, Java, JavaScript, Shell中作为取模运算符，通常将字符窜按照某种字符集编码后，会使用 `%` 开头。


再有就是部分字符在正则表达式中的含义了，比如 `\` 在正则中也是作为转义字符，要是用常用的程序设计语言写一个正则表达式去匹配一个字符窜，一定要考虑清除字符在程序设计语言与正则表达式中分别是什么含义，比如在Java代码中用正则去匹配 `\` ，那么正则表达式就应该为`\\\\`。
