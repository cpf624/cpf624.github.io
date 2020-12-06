---
title: 如何保证幂等性
category: 数据库
tags: [MySQL, Java]
---

### 什么是幂等性
想象一下这样的场景，用户在商城下单买东西，然后发起支付，钱已经扣成功了，但是由于网络超时或其它一些原因导致商城未能正常得到支付结果。用户又重新发起支付，如果支付服务没有幂等性保证，就会导致重复扣款，对用户来说就是极差的体验。

通用的讲，服务在处理一条数据请求时，根据具体的业务场景判断，如果同一条数据请求 `有且仅能被处理一次`，那么就需要对这条数据请求的处理保证幂等性，避免重复处理。


### 常见错误方法
* 加分布式锁
> 加锁只能限制并发，但最终还是会被执行到，如果没有幂等性保证就会重复处理。

* 先从数据库查询，如果不存在再写入
> 在没有并发的情况下，这种方式是没问题的。但如果两个相同的数据请求同时到达(HTTP客户端自动重试、MQ重发消息等会导致出现重复的数据请求)，查询结果都是不存在，那么都会进行写入，如果没有幂等性保证就会出现重复写入。
> 而且出现这样的重复请求属于小概率事件，没必要为这样的小概率事件浪费一次不必要的查询，因为查询的方式不能100%保证幂等性。

### 最佳实践
服务调用方和服务提供方在数据请求中约定一个唯一性约束，通常为业务流水号，由服务调用方保证业务流水号的全局唯一性。服务提供方会对请求数据建表，并按约定建立唯一性索引，在收到数据请求后先进行落库，如果出现唯一性冲突就说明同样的数据请求已经处理过了，应该忽略当前请求，或者执行幂等逻辑。一般来说，服务提供方的幂等逻辑，需要将执行成功的结果查询出来返回给服务调用方，服务调用方得到返回结果之后也需要校验返回结果是否与请求参数一致。为什么要做的这么复杂？如果服务调用方两次请求的业务流水号一致，但是请求参数不一致(如用户填写数据发起的请求，用户两次填写的数据可能不一致)，假设服务提供方的幂等逻辑只是简单的返回成功，那么服务调用方就无从判断服务提供方实际处理的请求数据，导致两边出现不一致。

代码示例：
```sql
CREATE TABLE t_order (
  id        BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  order_no  VARCHAR(32) NOT NULL DEFAULT '' COMMENT '唯一性业务流水号',
  data      VARCHAR(64) NOT NULL DEFAULT '' COMMENT '数据',
  PRIMARY KEY (id),
  UNIQUE KEY uniq_order_no (order_no)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
```

```java
public Response save(Request req) {
    // orderNo 为双方约定的全局唯一的业务流水号
    try {
        // insert into t_order values (#{req.orderNo}, #{req.data});
    } catch(DuplicateKeyException ex) {
        return get(req.getOrderNo());
    }
    // 正常业务逻辑处理
    return new Response();
}

public Response get(String orderNo) {
    // select * from t_order where order_no=#{orderNo};
    return new Response();
}
```
