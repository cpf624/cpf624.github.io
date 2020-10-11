---
title: Java线程池原理及应用实践
category: 编程开发
tags: [Java]
---

### 为什么要使用线程池
在多任务并发的场景，如同时处理多个用户的请求，通常会使用多线程的方式进行，提供一种伪并行的能力。线程本身作为一种资源（操作系统调度的最小单位），其创建、销毁的过程相对来说都比较重量级，而且会有一定的时间消耗。如果提前将线程创建好，当任务到达后就可以直接执行(前提是线程池空闲)；执行完成后不立即销毁线程，继续执行下一个任务或者等待新任务的到达。所以利用线程次即可以消除线程创建的等待时间，避免线程频繁创建、销毁所带来的资源损耗。

线程本身作为一种资源也不是无限的，当需要并发处理的任务超过系统极限时，继续创建线程已不可能，那么可行的策略就是拒绝执行任务、或者让任务排队等待，直到有空闲的线程来执行为止。而要解决这些问题，都是比较复杂、繁琐的，线程池则可以统一进行实现、封装。


### 线程池的使用
通过 `ThreadPoolExecutor` 来创建，其完整的构造方法如下:

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    // ...
}
```

常见使用方式如下:

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

ThreadPoolExecutor executor = new ThreadPoolExecutor(2, 8, 1,
    TimeUnit.MINUTES, new LinkedBlockingDeque<>(10));

// 不需要获取结果的执行
executor.execute(new Runnable() {
    @Override
    public void run() {
        System.out.println("do something");
    }
});

// 获取执行结果的方式，注意调用 Future#get 会阻塞或出现异常，直到任务执行完成或异常中断 
Future future = executor.submit(new Runnable() {
    @Override
    public void run() {
        System.out.println("do something");
    }
});

Future<String> future2 = executor.submit(new Callable<String>() {
    @Override
    public String call() throws Exception {
        return "ok";
    }
});

try {
    String ret = future2.get(); // ret = "ok"
} catch (InterruptedException ex) {
    ex.printStackTrace(); // 线程被中断(如调用线程池的stop方法后正在运行的线程将被中断)
} catch (ExecutionException ex) {
    ex.printStackTrace(); // Runnable#run, Callable#call 方法内部出现的异常
}
```

`Executors` 也提供了一些默认的线程池设置，但 `不推荐` 使用，因为无限制的线程数或队列长度，可能造成内存溢出。
```java
import java.util.concurrent.Executors;

// 线程数量为Integer.MAX_VALUE，队列长度为0，即新任务到达时，如果没有空闲线程，则立即新建一个线程
Executors.newCachedThreadPool();

// 固定数目线程的线程池，队列长度为 Integer.MAX_VALUE
Executors.newFixedThreadPool(2);

// 线程数量固定为1的线程数，队列长度为 Integer.MAX_VALUE
Executors.newSingleThreadExecutor();

// 定时及周期执行的线程池
Executors.newScheduledThreadPool(2);
```

### 线程池基本原理
##### `ThreadPoolExecutor` 构造参数的作用:
1. `corePoolSize` 线程池核心线程数最大值，向线程池提交任务时，如果线程池中已有的线程数小于 `corePoolSize` 则会新创建一个线程来执行当前提交的任务。(即使其它线程空闲也会这样)
2. `maximumPoolSize` 线程池最大线程数大小，向线程池提交任务时，如果线程池中已有的线程数大于等于 `corePoolSize`，且 `workQueue` 任务队列已满时，则会新创建一个线程来执行当前提交的任务。
3. `keepAliveTime` 线程池中非核心线程空闲的存活时间大小，即介于 `corePoolSize` 和 `maximumPoolSize` 之间创建的线程
4. `unit` 线程空闲存活时间单位
5. `workQueue` 任务队列
6. `threadFactory` 用于设置创建线程的工厂，可以给创建的线程设置有意义的名字，可方便排查问题
7. `handler`  线程池的饱和策略

向线程池中提交任务后的执行过程如下：

![线程池执行流程图]({{ site.assetsurl }}/assets/images/blog/language/java/thread-pool/thread-pool-sequence.png)

##### 四种饱和策略
* `AbortPolicy` 抛出一个异常[默认]
* `DiscardPolicy` 直接丢弃任务
* `DiscardOldestPolicy` 丢弃队列里最老的任务，将当前这个任务继续提交给线程池
* `CallerRunsPolicy` 交给线程池调用所在的线程进行处理

##### 常见任务队列
* `ArrayBlockingQueue` 基于数组实现的FIFO有界阻塞队列
* `LinkedBlockingQueue` 基于链表实现的FIFO阻塞队，默认是一个无边界的阻塞队列，最大长度为Integer.MAX_VALUE，吞吐量通常要高于ArrayBlockingQuene。newFixedThreadPool线程池使用了这个队列
* `DelayQueue` 任务定时周期的延迟执行的队列。newScheduledThreadPool线程池使用了这个队列。
* `PriorityBlockingQueue` 具有优先级的无界阻塞队列
* `SynchronousQueue` 同步队列，一个不存储元素的阻塞队列，每个插入操作必须等到另一个线程调用移除操作，否则插入操作一直处于阻塞状态，吞吐量通常要高于LinkedBlockingQuene。newCachedThreadPool线程池使用了这个队列

### 线程池的异常处理
一种方式是在`Runnable` 或 `Callable` 的实现类最外层 `try/catch` 住所有可能的异常，并进行相关处理。

也可以调用 `Thread.setDefaultUncaughtExceptionHandler` 设置一个全局的异常处理器。

或者重写 `ThreadPoolExecutor#afterExecute` 方法，在其内部处理异常。

当然也可以采用 `submit` 的方式提交任何，然后 `try/catch` 的方式调用 `Future#get` 方法进行异常处理，但是需要注意该方式会阻塞。

### 线程池状态

![线程池状态]({{ site.assetsurl }}/assets/images/blog/language/java/thread-pool/thread-pool-status.png)

##### `RUNNING`
* 该状态的线程池会接收新任务，并处理阻塞队列中的任务;
* 调用线程池的shutdown()方法，可以切换到SHUTDOWN状态;
* 调用线程池的shutdownNow()方法，可以切换到STOP状态;

##### `SHUTDOWN`
* 该状态的线程池不会接收新任务，但会处理阻塞队列中的任务；
* 队列为空，并且线程池中执行的任务也为空,进入TIDYING状态;

##### `STOP`
* 该状态的线程不会接收新任务，也不会处理阻塞队列中的任务，而且会中断正在运行的任务；
* 线程池中执行的任务为空,进入TIDYING状态;

##### `TIDYING`
* 该状态表明所有的任务已经运行终止，记录的任务数量为0。
* terminated()执行完毕，进入TERMINATED状态

##### `TERMINATED`
* 该状态表示线程池彻底终止

### 如何设置线程池
对于一个系统来说，其并行处理能力取决于CPU核心数，虽然并发执行的线程数可以大于CPU核心数，但实际同时（并行）运行的任务不会超过CPU核心数，而是由操作系统进行调度，实现宏观上的并发执行效果。操作系统在调用线程执行时，当进行线程切换时，保存、恢复线程执行上下文信息都会存在一定的性能消耗，所以需要设置一个合理的线程数量，尽量规避这部分消耗。比如，对于执行时间非常短的任务，如果线程数量设置的较大，线程切换的消耗可能大于线程实际执行的消耗，这样就不划算了。

通常任务会分为CPU密集型或IO密集型，对于CPU密集型的任务，应当尽可能减少线程切换，因此线程数量小于等于CPU核心数比较合理；对于IO密集型任务，在IO等待阶段CPU是空闲了，那么就可以多设置一些线程来充分利用CPU，比如设置为CPU核心数的2倍或者更多。而具体多少则需要根据任务的平均执行时间、可接受的平均等待时间进行估算。

当然还可能存在CPU、IO消耗都比较大的任务，对于这样的任务则应该考虑进行拆分了，计算和IO的部分分别用不同的线程池进行处理。

### 更多实践
* 原生的ThreadPoolExecutor参数都是固化的，如果能根据实际运行情况动态的调整线程数量、任务队列长度是不是更好呢？
* 添加监控逻辑，对线程池的运行状况、线程执行结果进行埋点监控，将更有利于实际生产运维。
* 异步通知执行结果，而不是通过 `Future#get` 获取。
