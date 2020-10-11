---
title: Java如何保证线程安全
category: 编程开发
tags: [Java]
---

当多个线程并发的读写相同的数据，可能出现数据错误，从而导致线程安全问题。

```java
public class Main {

    private int count = 0;

    public void increase() {
        this.count++;
    }

    public int getCount() {
        return this.count;
    }

}
```

如上代码，如果多个线程并发的调用 `increase` 方法，就可能引起线程安全问题。


虽然自增运算符看上去就一行代码，但是实际会被解释为三条指令：读取 `count` 的值 -> 值 `+1` -> 将新值写入 `count` 。这样在多线程的时候执行情况就类似如下了：

```java
    Thread1             Thread2
    r1 = count;         r3 = count;
    r2 = r1 + 1;        r4 = r3 + 1;
    count = r2;         count = r4;
```

这样会造成的问题就是 `r1` 、`r3` 读到的值都是 `0`，最后两个线程都将 `1` 写入 `count`，最后 `count`  等于 `1` ，但实际执行了两次自增，期望值应该是 `2` 才对。

### 线程安全的三大特性
* **原子性**
```java
i = 2; // 将 2 写入 i，是原子的，线程安全
j = i; // 先读取 i，再将其值写入 j，因此不是原子的，线程不安全
```

* **可见性**

从Java的内存模型我们知道所有的变量都存储在主内存中，每个线程还有自己的工作内存，线程的工作内存中保存了被该线程使用到的变量的主内存副本拷贝，线程对变量的所有操作（读取、写入等）都必须在工作内存中进行，而不能直接读写主内存中的变量。不同线程之间也无法直接访问对方工作内存中的变量，线程间变量值的传递必须通过主内存来完成。所以当某个线程将自己的工作内存中的变量修改后，在还没有同步到主内存时，或者别的现在还未从主内存中同步最新的变量值时，线程之间就会出现数据不一致的情况，从而引发线程安全问题。

* **有序性**

现代CPU为了提高执行效率可能会对指令进行重排序。
```java
double pi = 3.14;      // A
double r = 1;          // B
double s = pi * r * r; // C
```

如上代码，A、B是两条独立的语句，而C则依赖于A、B，所以A、B可以重排序，但是C却不能排到A、B的前面。而无论是按 `A->B->C` 顺序执行，还是按 `B->A->C` 执行，最终 s 的结果都是 3.14，对于这样的情况不会出现线程安全问题。

```java
publi class Main {
    private int a = 0;
    private bool flag = false;
    
    public void write() {
        a = 2;              // 1
        flag = true;        // 2
    }
    
    public int multiply() {
        if (flag) {         // 3
            return a * a;   // 4
        } else {
            return a;       // 5
        }
    }

}
```

如上代码，两个线程A、B并发的执行，A线程调用 `write` 方法，B线程调用 `multiply` 方法，那么B线程执行完成后得到的返回结果会是什么呢？可能的情况如下：
* A线程执行完成（无论是否有指令重排），`a=2, flag=true`，B线程开始，因此返回结果为 `4`
* A线程未开始，`a=0, flag=false`，B线程执行完成（执行语句5），因此返回结果为 `0`
* A线程执行到语句1，`a=2, flag=false`，B线程执行完成（执行语句5），因此返回结果为 `2`
* 有指令重排，A线程先执行语句2，`a=0, flag=true`，B线程执行完成（执行语句4），因此返回结果为 `0`
* 还有别的情况就不一一列举了

不同的执行顺序最终执行结果也会不同，因此要保证线程安全也就必须保证指令执行的有序性。

### 不可变对象
如 `String`、`Integer`、`Enum`、`BigInteger` 这些不可变类，一旦对象被实例化，其值就不再发生变化(排除通过反射机制修改其私有的成员变量的情况)。既然不存在修改，也就是没有写操作，自然也就没有现成安全问题。

### 局部变量、线程本地变量
如果全部使用局部变量，那么就不存在线程间共享变量的情况了，自然也就不存在线程安全一说。

线程本地变量也是同理。

### volatile
被 `volatile` 修饰的共享变量，`JVM` 提供了两大特性：
```java
    1. 内存可见性，即写操作会直接写入主存，读操作会直接从主存读取
    2. 禁止指令重排
```

由于 `volatile` 无法保证原子性，因此并不能保证绝对的线程安全，其典型的适用场景一般为一写多读，如简单的计数场景。又或者懒汉模式的单例实现。

```java
publi class Singleton{

    private volatile static Singleton instance = null;

    private Singleton() {
    }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    // new一个对象时会分为三步：新建对象 -> 初始化对象 -> 赋值
                    // 如果在并发情况下出现指令重排，可能导致赋值给 instance 的是未初始化的对象
                    // instance 被 volatile 修饰后，会禁止指令重排，从而保证了线程安全
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

}
```

### CAS
由硬件将 `compare and set` 封装为一条指令，从而保证了原子性。如 `i++` 就可以转换为：
```java
AtomicInteger atomic = new AtomicInteger(0);
atomic.incrementAndGet();
```

```java
public final incrementAndGet() {
    for (;;) {
        int current = get();
        int next = current + 1;
        if (compareAndSet(current, next))
            return next;
    }
}
```

`compareAndSet` 其本质类似于是：
```java
while (true) {
    if (i == 0) { // 比较原始值是否相同
        i = i + 1; // 自增并赋新值
        break;
    }
}
```

但是 `CAS` 无法解决 `ABA` 问题，在对 `i` 的值与原始值进行比较时，如果 `i` 的值从 `2` 变为 `0`，比较也能通过，然后执行自增并赋新值，但却遗漏了 `i=2` 的过程。


### synchronized
被synchronized关键字修饰的代码块会变成同步代码块，只有线程拿到锁之后才能进入同步代码块执行，因此可以保证线程安全。
```java
public class Main {

    private int count = 0;

    public synchronized void increase() {
        this.count++;
    }

    public synchronized int getCount() {
        return this.count;
    }

}
```

### Lock
使用 `synchronized` 关键字时，加锁、释放锁都有JVM来控制，如果需要更灵活的锁控制，可使用Lock。
```java
public class Main {

    private int count = 0;
    private Lock lock = new ReentrantLock();

    public void increase() {
        try {
            lock.lock();
            this.count++;
        } finally {
            lock.unlock();
        }
    }

    public int getCount() {
        try {
            lock.lock();
            return this.count;
        } finally {
            lock.unlock();
        }
    }

}
```

使用Lock时一定要注意锁的释放，避免出现异常导致锁未释放的情况，因此最好是使用 `try/finally` 的方式，并在 `finally` 中释放锁。
