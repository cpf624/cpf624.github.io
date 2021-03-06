---
title: 总结 ——软件设计之重要
category: 个人总结
tags: [有感而发, 程序员]
---

花了两周的时间，一边看前台的相关知识，一边做。虽说做的挺慢，但是从中也学到了不少东西，现在也做一下总结。

刚开始写代码时，是想到什么就写什么，后来发现有些地方写的不对，然后再修改。写到最后又发现代码重复性有点大，很多地方都应当写一个共用的类或包，但是事先没有一个总体的把握，属于摸着石头过河的，所以很多地方就直接将代码复制过去，一两个还可以，但要是多了之后就很烦了，尤其是后期维护，这样将相当费力。从这一点来看，无论是做前台还是后台，开发前的一个总体设计与需求分析是相当重要的。只有充分分析用户需求后，才知道该用什么样的技术，用什么样的方法去具体实现。而总体设计亦是整个软件开发过程至关重要的一环，通过总体设计可以有效的节约开发周期的同时，可以是代码更加优化，代码优化了也有利于后期维护。

但是对于一个初学者来说，一开始就直接做总体设计，好吗？我觉得不好，对于一个初学者，毕竟几乎没有经验，因此在做设计时，很多情况都无法考虑到，做出的设计也就无法适应后期的开发，最终还得不断的修改，甚至被最初的设计引向错误的方向……到头来还是属于摸着石头过河，不断的写代码，再不断的修改，发现有公用的东西之后就将其提取出来单独写，最为一个共用体，而非机械的复制代码。不断的重复这一过程，不断的吸取教训积累经验，下一次做的设计也就会比上一次好了。
