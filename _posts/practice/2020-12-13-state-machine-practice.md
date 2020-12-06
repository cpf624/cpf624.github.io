---
title: 状态机应用实践
category: 数据库
tags: [MySQL, Java]
---

Bob最近找了一份搬砖的工作，每次会搬数量不等的砖，一天结束后包工头Alice会为其结算工资。一开始工人不多的时候，包工头自己用笔记录就能搞清楚每天该给每个工人结算多少工资。后面Alice的业务推广到全国，单靠人工就没法支持业务的发展了，急需一套信息化系统来支撑，于是我们开干。


### 建表
```sql
CREATE TABLE t_move_brick (
  id            BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  move_no       VARCHAR(32) NOT NULL DEFAULT '' COMMENT '搬砖流水号',
  pay_no        VARCHAR(32) NOT NULL DEFAULT '' COMMENT '支付流水号',
  worker_id     BIGINT NOT NULL DEFAULT 0 COMMENT '搬砖人ID',
  move_num      INT NOT NULL DEFAULT 0 COMMENT '搬砖数量',
  status        TINYINT NOT NULL DEFAULT 0 COMMENT '状态 1: 新建, 2: 待支付, 3: 已支付',
  create_time   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  UNIQUE KEY uniq_move_no (move_no),
  KEY idx_pay_move(pay_no, move_no)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='搬砖记录';

CREATE TABLE t_move_pay (
  id            BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  pay_no        VARCHAR(32) NOT NULL DEFAULT '' COMMENT '支付流水号',
  worker_id     BIGINT NOT NULL DEFAULT 0 COMMENT '搬砖人ID',
  boss_id       BIGINT NOT NULL DEFAULT 0 COMMENT '包工头ID',
  move_count    INT NOT NULL DEFAULT 0 COMMENT '搬砖记录数',
  move_sum      INT NOT NULL DEFAULT 0 COMMENT '搬砖总数量',
  money         INT NOT NULL DEFAULT 0 COMMENT '支付金额',
  status        TINYINT NOT NULL DEFAULT 0 COMMENT '状态 1: 新建, 2: 待支付, 3: 已支付',
  create_time   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  UNIQUE KEY uniq_pay_no (pay_no)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='支付记录';
```

### 搬砖记录
Bob每完成一次搬砖，系统就记录一下当次搬砖结果。
```sql
insert into t_move_brick (move_no, worker_id, move_num, status) values ('M202012131013000102101', 101, 81, 1);
```
最后形成如下流水:

| 主键ID | 搬砖流水号 | 支付流水号 | 搬砖人ID | 搬砖数量 | 状态 | 创建时间 | 更新时间 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 1 | M202012131013000102101 | | 101 | 81 | 1 | 2020-12-13 10:13:00 | 2020-12-13 10:13:00 |
| 2 | M202012131013000102102 | | 102 | 41 | 1 | 2020-12-13 10:14:00 | 2020-12-13 10:14:00 |
| 3 | M202012131013000102103 | | 101 | 70 | 1 | 2020-12-13 10:14:01 | 2020-12-13 10:14:01 |
| 4 | M202012131013000102104 | | 101 | 28 | 1 | 2020-12-13 10:14:10 | 2020-12-13 10:14:10 |
| 5 | M202012131013000102105 | | 102 | 35 | 1 | 2020-12-13 10:15:00 | 2020-12-13 10:15:00 |

### 聚合搬砖记录
Bob们工作非常勤劳，因此搬砖记录会非常多，如果直接基于搬砖记录进行支付，系统压力会非常大，更适合的方式是将一批搬砖记录聚合到一起，一次性完成支付。

那，聚合都需要做哪些保证呢？
> 1. 一条搬砖记录有且仅能被聚合一次（重复聚合就会导致多支付，包工头会亏死的）
>
> 2. 被聚合过的搬砖记录，需要关联到对应的支付记录，这样才可以根据支付记录查询出关联的所有搬砖记录
>
> 3. 需要将被聚合的所有搬砖记录的搬砖数量累计在对应的支付记录上（需要保证数据一致，否则要么包工头亏，要么搬砖工人亏）
>
> 4. 如果需要支持取消支付，还得支持撤销聚合，然后再重新进行聚合

##### 通过状态机保证搬砖记录有且仅能被聚合一次
聚合的过程，会用到搬砖记录的两个状态，从 `新建` 状态转移到 `待支付` 状态，状态变更成功后再将其聚合到支付记录上，只要能够保证有且仅有一个线程能变更状态成功，那么就可以保证一条搬砖记录有且仅能被聚合一次。

* 查询时加悲观锁，然后再变更状态
```java
public MoveBrick getById(Long id) {
    // select * from t_move_brick where id=1 for update
    return new MoveBrick();
}

public boolean doAggregation(MoveBrick brick) {
    MoveBrick dbBrick = getById(brick.getId());
    if (dbBrick == null || dbBrick.getStatus() != 1) {
        // 搬砖记录不存在或者状态不为新建态都不做聚合
        return false;
    }
    // start transaction

    // 变更搬砖记录状态
    // update t_move_brick set status=2 where id=1;

    // 执行聚合逻辑

    // commit transaction
    return true;
}
```

这么做也不是不可以，但是重依赖数据库悲观锁，如果一开始并不知道需要聚合那些搬砖记录，那么可能需要一次性锁住很多搬砖记录，或者先查出来一批搬砖记录，确认可以聚合之后，再单条加悲观锁查询一次。无论哪种方式，其并发性都不会太好。

更好的方式是利用状态机做乐观锁的方式：
```java
public boolean doAggregation(MoveBrick brick) {
    // start transaction

    // 将原状态加入where条件，这样即便是在高并发的情况下，同时更新同一条搬砖记录
    // 在数据库层面也可以保证一条搬砖记录有且仅会被更新成功一次
    // 通过判断返回的更新数据条数，如果为 0 则说明没有更新成功，即可忽略本次聚合
    // update t_move_brick set status=2 where id=1 and status=1;
    if (updated <= 0) {
        return false;
    }

    // 执行聚合逻辑

    // commit transaction
    return true;
}
```

##### 如何累计搬砖数量
经常看到如下的实现方式：
```java
public boolean doAggregation(MoveBrick brick) {
    // start transaction

    // update t_move_brick set status=2 where id=1 and status=1;
    if (updated <= 0) {
        return false;
    }

    // 先查询出支付记录 movePay
    // select * from t_move_pay where pay_no='P202012131013000100101';

    // 在服务中计算好累计好的结果
    movePay.setMoveCount(movePay.getMoveCount() + 1);
    movePay.setMoveSum(movePay.getMoveSum() + brick.getMoveNum());
    // 在高并发的情况下，如果同时往同一条支付记录累计搬砖量，多个线程查询到的初始值都是一样的，都按同样的初始值进行累计，这样就会导致累计丢失
    // 简单的解决方法时在查询支付记录的时候加上悲观锁，但是这样又将单条支付记录的累计变成了串行，系统的并发性便会有所下降

    // 再将累计后的结果写入数据库
    update t_move_pay set move_count=#{moveCount}, move_sum=#{moveSum} where pay_no='P202012131013000100101';

    // commit transaction
    return true;
}
```

### 简单实现
```java
private List<MoveBrick> query() {
    // 按一定条件查询出一批搬砖记录
    // select * from t_move_brick where status=1;
    return new ArrayList();
}

private MovePay createMovePay(Long workerId, Long bossId) {
    // 新建一条支付记录
    String payNo = generateNo();
    // insert into t_move_pay (pay_no, worker_id, boss_id, move_count, move_sum, money, status)
    // values ('P202012131013000100101', #{workerId}, #{bossId}, 0, 0, 0, 1);
    return new MovePay();
}

private boolean doAggregation(MoveBrick brick, MovePay pay) {
    // 将原状态加入where条件，这样即便是在高并发的情况下，同时更新同一条搬砖记录
    // 在数据库层面也可以保证一条搬砖记录有且仅会被更新成功一次
    // 通过判断返回的更新数据条数，如果为 0 则说明没有更新成功，即可忽略本次聚合
    // update t_move_brick set status=2, pay_no=#{pay.payNo} where id=1 and status=1;
    if (updated <= 0) {
        return false;
    }

    // update t_move_pay set move_count+=1, move_sum+=#{brick.moveNum} where pay_no=#{pay.payNo} and status=1;
    return updated > 0;
}

public List<MoveBrick> aggregation() {
    List<MoveBrick> bricks = query();
    if (bricks == null || bricks.isEmpty()) {
        return bricks;
    }
    List<MoveBrick> result = new ArrayList();
    // start transaction
    MovePay pay = createMovePay();
    for (MoveBrick brick : bricks) {
        if (doAggregation(brick, pay)) {
            result.add(brick);
        }
    }
    // commit transaction
    return result;
}
```
