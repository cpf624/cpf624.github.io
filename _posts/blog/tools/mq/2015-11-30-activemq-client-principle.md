---
title: ActiveMQ Client工作原理
category: 编程工具
tags: [消息队列, MQ, ActiveMQ]
---

# 1. 基本原理
![ActiveMQ Basic Principle]({{ site.homeurl }}/assets/images/blog/tools/mq/activemq-client-principle/activemq_basic_principle.svg)

ActiveMQ基本原理如上图所示，消息由Producer产生，Consumer消费。Producer和Consumer均属于ActiveMQ Client部分，不过一般运行在不同的机器上。Producer产生消息后通过网络发送给ActiveMQ Broker，Broker收到消息后进行存储，再投递给Consumer进行消费(Consumer也是通过网络与Broker连接)。


![JMS Architecture]({{ site.homeurl }}/assets/images/blog/tools/mq/activemq-client-principle/jms_architecture.svg)

ActiveMQ完整实现了JMS API，JMS架构如上图所示。无论是生产者(Producer)还是消费者(Consumer)，都需要用Connection Factory创建Connection，再在Connection上创建Session，最后由Session创建出Producer/Consumer实例。Producer要发送消息，首先需要通过对应的Session创建消息，再将创建出来的消息发送到指定的队列。同理，Consumer都是从Session接收消息进行消费。

# 2. 网络结构
![ActiveMQ Client Network Model]({{ site.homeurl }}/assets/images/blog/tools/mq/activemq-client-principle/activemq_client_network.svg)

ActiveMQ所实现的Connection是由一个责任链模式的Transport完成的，参考: <http://activemq.apache.org/configuring-transports.html>。概括来说分为网络类Transport和包装类Transport。

#### 2.1 网络类Transport
网络类Transport针对不同网络环境进行实现，从而提供不同网络环境下Client与Broker进行连接的能力，也就是说网络类Transport将直接与Broker进行连接。网络类Transport主要包括TCPTransport、UDPTransport、MulticastTransport、SSLTransport、NIOTransport、HTTPTransport、HTTPSTransport、WebSocketsTransport等。

#### 2.2 包装类Transport
包装类Transport则是在网络类Transport和其它包装类Transport的基础上包装出更多的功能。比如ResponseCorrelator在TCPTransport的基础上实现了消息请求与响应的映射，也就可以在其基础上轻松的实现请求、响应的异步处理。再如MutexTransport在ResponseCorrelator的基础上实现了互斥写保护，也就可以在其基础上轻松的保证并发环境下共享连接时消息发送的准确性。再如FanoutTransport可以持有多个其它Transport，通过其持有的Transport从而将消息同时发往不同的Broker。再如FailoverTransport可以持有多个其它可能可用的Transport，通过检查其所持有的Transport的可用性，选择出一个可用的Transport，并在Transport失效的情况下自动进行切换，对于集群环境的Broker就相当适用。

# 3. 线程模型
从生产者(Producer)的角度来看ActiveMQ Client的线程模型相对简单，此处不做描述，从消费者(Consumer)角度来看ActiveMQ Client的线程模型如下图所示。
![ActiveMQ Client Thread Model]({{ site.homeurl }}/assets/images/blog/tools/mq/activemq-client-principle/activemq_client_thread_model.svg)

# 4. 长连接维护
ActiveMQ Consumer Client与ActiveMQ Broker之间的连接为长连接，长连接的维护主要靠三个Daemon线程来完成。

+ Read Checker

该线程定时检查是否有从Broker读取数据(Transport线程读取)，如果超过一定时间未检查到就认为连接异常，并通知Connection连接异常。

+ Write Checker

该线程定时检查是否有向Broker写入数据，如果超过一定时间未检查到，则向Broker发送KeepAlive Commond，发送完成后Broker的响应将会被Transport线程读取到，从而维持了Client与Broker之间的长连接。

+ Connect Checker

该线程检查Client与Broker之间的连接状态，可检查连接是否已经建立、建立连接是否超时。

# 5. 消息接收与消费
TCPTransport会有一个Transport线程尝试从Broker读取数据，并将读取到的数据转换成相关Commond，然后交由TransportListener处理，而TransportListener一般就是对应的Connection。对于消息类Commond，在Connection中根据消息的ConsumerId进行调度，将消息调度到对应Session的Message Queue中。Session中会有Session Task线程负责将消息从Message Queue中取出，再一次根据ConsumerId进行调度，将消息调度到对应Message Consumer的Unconsumed Message Queue中。最终Application Consumer(ActiveMQ Client使用者)从Message Consumer的Unconsumed Message Queue中接收消息，而消息从Unconsumed Message Queue出队后，会先将消息放入Delivered Messages LinkedList中，才会将消息交给Application Consumer消费。如果消息被正常消费，被消费的消息将从Delivered Messages中移除；如果出现异常或因为其它原因，对消息进行回滚时，会将Delivered Messages中的消息全部取出，交由对应的Session Dispatcher重新进行调度，如果需要延迟将在Scheduler中完成。

事务的提交、回滚都是以Session为单位的，因此用到事务时，一个Session最好只创建一个Consumer(Message Consumer和Application Consumer为一一对应的一个)。

另外多个Session共享一个Connection时，如果某个Session所对应的Application Consumer已结束运行，但是又未关闭Session，积压在Message Consumer的Unconsumed Message Queue中的消息将无法继续被消费，只有关闭Session后，Broker才会重新推送那些未被消费的消息。

# 6. 消息接收模式
消息都是从Broker传输到Client，默认情况下Broker会主动将消息PUSH至Client，当然也可以通过配置改为Client主动从Broker PULL消息，参考: <http://activemq.apache.org/slow-consumer-handling.html>

+ PUSH模式

默认情况下，Broker会主动将消息PUSH至Client，这样做的目的是为了让消息能够即时到达Client，以最快的速度被消费。每个队列默认最多PUSH 1000条消息，当达到这个限制后，需要在已推送的消息中收到确认后才会继续推送消息。

+ PULL模式

如果遇到慢Consumer，每个消息的处理比较耗时的话，PUSH模式就可能将消息积压在Message Consumer的Unconsumed Message Queue中，一旦造成积压，继续添加更多的Consumer也无济于事，因为Broker已将消息推送出去，在得到确认前不会继续推送，因此可能造成部分消息长时间得不到处理。如果达到了PUSH的最大消息量限制，新到达的消息同样得不到即时处理，最终造成恶性循环。好在ActiveMQ支持Client主动PULL模式，在这种模式下，Broker不再主动推送消息，仅当收到Client的PULL Request后才向Client发送一条消息。这样消息一直在Broker中，通过简单的增加Consumer数量就可以加快消息的整体处理速度。

# 7. 消息重传
消息重传都是在Client端重新调度完成，如果需要延迟，是在Scheduler中完成。但是如果消息重传一定次数后(未达到重传次数上限)，关闭对应Session，Broker会重新推送消息，新的Consumer接收到消息后，消息的重传次数将重新从零开始计数。
