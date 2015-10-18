---
title: 几个常见的计算机术语分析
category: 编程开发
tags: [程序员]
---

1. **instruction**

    n.a manual usually accompanying a technical device and explaining how to install or operate it

2. **routine**

    n.Computer Science. A set of programming instructions designed to perform a specific limited task.

3. **program**

    n.Computer Science. a sequence of instructions that a computer can interpret and execute

4. **subroutine**

    n. Computer Science
    
    A set of instructions that performs a specific task for a main routine, requiring direction back to the proper place in the main routine on completion of the task.

5. **subprogram**

    n.A computer program contained within another program that operates semi-independently of the encasing program.

6. **procedure**

    n.Computer Science. A set of instructions that performs a specific task; a subroutine or function.

7. **function**

    n.Computer Science. A procedure within an application.


<br />

所说subroutine和subprogram翻译过来都是“子程序”的意思，但是，仔细分析其英文解释，却有着细微的差别。个人认为如果要划分范围的话，subprogram应该从属于subroutine的范畴。

从单词的组成上来讲，sub有“子”的意思，而分析routine和program我会注意到，

routine是

```
A set of programming instructions
```

而program则是

```
A sequence of instructions
```

更为关键的是program是一系列计算机能够执行的指令，而routine是设计好的一系列程序指令（可以模糊的理解为用户发出的命令），也就是说从routine到program还有一个层级的差异。换句话讲，一个计算机应用程序，用户在操作时发出一系列命令，主程序接收用户的命令后，然后调用应用程序对应的功能模块，而功能模块也就是事先设计好的子程序（subroutine）（用“功能模块”来描述有些牵强），当对应的功能模块接收到命令后，然后继续调用相应的subprogram，向其发出一系列指令（programming instruction），subprogram接收到指令后，在调用相应的函数（function）最终解释执行为A sequence of instructions 。这一过程的路线图为：

```
Person ---> Application ---> Subroutine ---> SubProgram --->  Function --->Instruction --->Computer
```

对应用户来说，能够接触到的则是Application，或许还可以接触到Subroutine，而Subprogram则是一个个的黑箱，里面封装了各种各样的“苦力”Function，由它通过一系列Instruction来操作Computer，最终满足用户的要求。

对于Procedure和Function之间有什么差异，我也没弄明白…………
