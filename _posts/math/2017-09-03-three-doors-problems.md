---
title: 三门问题
category: 概率
tags: [数学, 概率]
use_math: true
---

三门问题（Monty Hall problem）亦称为蒙提霍尔问题、蒙特霍问题或蒙提霍尔悖论，大致出自美国的电视游戏节目Let's Make a Deal。问题名字来自该节目的主持人蒙提·霍尔（Monty Hall）。参赛者会看见三扇关闭了的门，其中一扇的后面有一辆汽车，选中后面有车的那扇门可赢得该汽车，另外两扇门后面则各藏有一只山羊。当参赛者选定了一扇门，但未去开启它的时候，节目主持人开启剩下两扇门的其中一扇，露出其中一只山羊。主持人其后会问参赛者要不要换另一扇仍然关上的门。作为参赛者究竟要不要换？


讨论这个问题之前，先讨论一下为什么抽签是公平的。我们将问题修改为：

```
有N扇门，有且仅有一扇门后面有一辆汽车，其它门后都是山羊。有N个人参赛，依次选中一扇门（不可与其他人选中同样的门）。由于是依次选择的，那么选择次序对选中结果是否有影响？即这N个参赛的人，选中汽车的概率是否一样？
```

第一个人进行选择时，毫无疑问，选中的概率为`1/n`。

第二个人进行选择时，汽车还在剩下的`N-1`扇门后面的概率为`1 - 1/n`，因此选中的概率为：

$$
P = \left(1 - \frac{1}{n}\right) \times \frac{1}{n-1} = \frac{1}{n}
$$

第`i`个人进行选择时(`i>2`)，选中的概率为：

$$
P(i) = \left(1 - ... \left(\left(1 - \left(1 - \frac{1}{n}\right) \times \frac{1}{n-1}\right) \times \frac{1}{n-2}\right) ... \times \frac{1}{n-i-1}\right) \times \frac{1}{n-i} = \frac{1}{n}
$$

如果把每一次抽签都看成一次独立事件的话，不难看出，随着抽签的进行，门的数量在减少，汽车还在剩余的门后的概率也在降低，但是每个人选中汽车的概率都是一样的，即为 `1/n`。

由此可见，抽签无论先后，其实都是公平的，大家的概率都一样。

回到三门问题，参赛者首次选中汽车的概率为`1/3`，如果坚持不换，那么选中汽车的概率始终为`1/3`。如果没有主持人这个上帝角色存在，不为参赛者排除一扇本后是山羊的们，那么无论参赛者是否交换，选中汽车的概率始终为`1/3`。（当然，一定是在没有看第一次选中的结果前决定要不要换）

由于主持人这个上帝角色的存在，直接帮忙排除了一扇背后是山羊的门，如果重新选择，概率会是什么样？

有的人会说，主持人排除一扇门之后，汽车肯定在剩下的两扇门后，在任一扇门的背后的概率均为`1/2`，因此换与不换没太大意义，反正概率都一样。

我们知道，计算概率我们都是以一次独立事件为基础来进行的。主持人排除一扇门之后，如果新来一个参赛者从剩下的两扇门中选择，将此作为一次独立事件，确实其无论选择哪扇门，选中的概率均为`1/2`。

但是这里只有一个参赛者，应该将其从第一次选择开始，到最后决定是否换，看做一个完整的独立事件。这么来看的话，参赛者第一选择之后，选中的概率为`1/3`，汽车在剩下的两扇门后的概率为`2/3`。由于主持人以上帝视角排除了一扇门，那么排除掉的那扇门背后有汽车的概率为`0`，所以最后剩下的那扇门后有汽车的概率为`2/3`，这样才满足参赛者第一次选择之后，汽车在剩下的两扇门后的概率为`2/3`。

所以作为参赛者，应该换，换了之后选择的概率为`2/3`。

也许还是有人不相信，那么我们按题目所设定的规则用代码来模拟实验，看看换与不换，选择汽车的概率分布是多少。

在模拟过程中，我们将问题推广，门的数量为大于等于3扇，其它条件不变，分别模拟不同门的数量情况下，最终选中的概率情况，代码和最终结果如下。

```python
#!/usr/bin/env python
# -*- coding: UTF-8 -*- 
# Author:   Jhat
# Date:     2017-09-03
# Home:     http://jhat.org
# Vim:      tabstop=4 shiftwidth=4 softtabstop=4

from random import randint

def probability(base, limit):
    c_not_change = 0
    c_change = 0

    for _ in xrange(0, limit):
        r_index = randint(0, base - 1)

        i_not_change = randint(0, base - 1)
        if i_not_change == r_index:
            c_not_change += 1
            continue

        # 交换
        if r_index < i_not_change:
            s_index = [i for i in xrange(0, r_index)] \
                    + [i for i in xrange(r_index + 1, i_not_change)] \
                    + [i for i in xrange(i_not_change+ 1, base)]
        else:
            s_index = [i for i in xrange(0, i_not_change)] \
                    + [i for i in xrange(i_not_change + 1, r_index)] \
                    + [i for i in xrange(r_index+ 1, base)]
        del s_index[randint(0, len(s_index) - 1)]
        s_index.append(r_index)
        s_index.sort()
        i_change = s_index[randint(0, len(s_index) - 1)]
        if i_change == r_index:
            c_change += 1

        # 不换
        # s_index = [i for i in xrange(0, i_not_change)] + [i for i in xrange(i_not_change + 1, base)]
        # i_change = s_index[randint(0, len(s_index) - 1)]
        # if i_change == r_index:
        #     c_change += 1

    limit = float(limit)
    return (c_not_change / limit, c_change / limit)

for base in range(3, 11):
    p_not_change = []
    p_change = []
    for _ in range(10):
        p = probability(base, 1000000)
        p_not_change.append(p[0])
        p_change.append(p[1])
    print base, p_not_change
    print base, p_change
```

<br/>
模拟实验结果如下图所示：

![N门模拟实验]({{ site.assetsurl  }}/assets/images/blog/math/three-doors-problems/tdp_simulation_experiment.jpg)

从程序模拟实验结果来看，三门问题，换之后选中汽车的概率为`2/3`。推广到`N`门问题之后，换之后选中的概率为：

$$
P(n) = \frac{n-1}{n} \times \frac{1}{n-2}
$$
