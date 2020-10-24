---
title: Java线程状态
category: 编程开发
tags: [Java]
---

![Java线程状态机]({{ site.assetsurl }}/assets/images/blog/language/java/thread-status/thread-status.png)


### NEW
尚未启动的线程的线程状态。
```java
Thread thread = new Thread();
```

### RUNNABLE
已启动，等待CPU调度运行的线程状态。
```java
thread.start();
```

### BLOCKED
线程阻塞等待监视器锁的线程状态。等待进入synchronized同步代码块或方法。
```java
synchronized (this) {
    // ...
}
```

### WAITING
线程获得锁，处于等待状态，需要其它线程唤醒。
```java
synchronized (this) {
    this.wait();
}
```

### TIMED_WAITING
线程获得锁，处于等待状态，需要其它线程唤醒，也可以在等待时间结束后自动唤醒。
```java
synchronized (this) {
    this.wait(1000);
}
```

### TERMINATED
线程执行完成。

### BLOCKED与WAITING的区别
* 每个对象都有一个监视器锁，同一时刻仅允许一个线程进入，多个线程同时获取锁资源时，就会有线程需要排队等待，等待在`EntryList`同步队列上。等待监视器资源的现在就是BLOCKED状态。
* 当线程调用某个对象的`wait`方法时，当前线程会释放对象锁（因此wait一定要在synchronized同步方法/块中调用），进入等待状态（`WaitSet`）。等待 `notify` 唤醒，或者等待时间结束后自动唤醒。

### sleep和wait的区别
* sleep是线程中的方法，但是wait是Object中的方法。
* sleep方法不会释放lock，但是wait会释放，而且会加入到等待队列中。
* sleep方法不依赖于同步器synchronized，但是wait需要依赖synchronized关键字。
* sleep不需要被唤醒（休眠之后推出阻塞），但是wait需要（不指定时间需要被别人中断）。

### 需要关注的状态
使用jstack、jvisualvm等工具查看线程状态时，重点关注 `WAITING`、`BLOCKED` 状态的线程，尤其是 `dead lock`。
