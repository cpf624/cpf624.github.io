---
title: Access-Control-Allow-Origin
category: 编程开发
tags: [JavaScript, jQuery, Ajax]
---

故事的起因是这样的，想找个获取股票交易实时数据的接口，找来找去最后找到了新浪财经，然而其接口却是这样的：

+ Request URL:

```
http://hq.sinajs.cn/rn=1454399448305&list=sz300369
```

+ Request Headers:

```
GET /rn=1454399448305&list=sz300369 HTTP/1.1
Host: hq.sinajs.cn
Connection: keep-alive
Cache-Control: max-age=0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36
Accept-Encoding: gzip, deflate, sdch
Accept-Language: en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4
```

+ Response Headers:

```
HTTP/1.1 200 OK
Cache-Control: no-cache
Content-Length: 146
Connection: Keep-Alive
Content-Type: application/x-javascript; charset=GBK
Content-Encoding: gzip
```

+ Response Body:

```javascript
var hq_str_sz300369="绿盟科技,32.500,31.950,35.150,35.150,32.120,35.150,0.000,5239999,179070472.050,3742815,35.150,300,35.140,500,35.080,200,35.010,500,35.000,0,0.000,0,0.000,0,0.000,0,0.000,0,0.000,2016-02-02,10:49:13,00";
```


我是需要使用`Ajax`请求来获取实时交易数据，很自然的写出了如下代码：

```javascript
$.ajax({
    url: 'http://hq.sinajs.cn/rn=1454399448305&list=sz300369',
    type: 'GET',
    success: function(data) {
        console.log(data);
    }
});
```

然后Chrome就报错了：

```
XMLHttpRequest cannot load http://hq.sinajs.cn/rn=1454399448305&list=sz300369. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost' is therefore not allowed access.
```

而该Ajax请求、响应头信息如下：

+ Request Headers:

```
GET /rn=1454399448305&list=sz300369 HTTP/1.1
Host: hq.sinajs.cn
Connection: keep-alive
Accept: */*
Origin: http://localhost
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36
Referer: http://localhost/stock/index.html
Accept-Encoding: gzip, deflate, sdch
Accept-Language: en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4
```

+ Response Headers:

```
HTTP/1.1 200 OK
Cache-Control: no-cache
Content-Length: 150
Connection: Keep-Alive
Content-Type: application/x-javascript; charset=GBK
Content-Encoding: gzip
```

与直接请求相比(不通过Ajax)请求头多了个 `Origin: http://localhost` ，也正是因为这个 `Origin` 触发了浏览器的 `同源策略` ，从而导致Ajax请求无法正常访问。同源策略参考: <https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy>。

在A站点的页面下请求B站点的数据，如果遇到这样的问题，一种方式是在B站点的数据接口响应头添加：

```
Access-Control-Allow-Origin: *
```

更多解决方法参考：<http://www.freebuf.com/articles/web/65468.html>。

但是让新浪财经给我加个 `Access-Control-Allow-Origin` 显然是不现实的，那就只能在客户端解决该问题了。仔细想过直接访问是可以请求到数据的，Ajax请求时请求头多了个 `Origin` 才请求不到数据，如果能把 `Origin` 从请求头去掉是不是就可以了呢？

通过查看 `jQuery` 官方文档(<http://api.jquery.com/jQuery.ajax>)发现，原来 `dataType` 还可以设置为 `script` ，正好接口响应数据类型为 `application/x-javascript` ，那就这样试一试：

```javascript
$.ajax({
    url: 'http://hq.sinajs.cn/rn=1454399448305&list=sz300369',
    type: 'GET',
    dataType: 'script',
    success: function() {
        console.log(hq_str_sz300369); // 因为请求、响应都是脚本类型数据，因此可以直接使用响应结果中的变量。
    }
});
```

然而还是没法请求到数据，不过可喜的是不再报 `Access-Control-Allow-Origin` 的错了，而是一个语法错误。仔细看请求信息，发现jQuery给加了一个查询参数：

```
?_=1454403309696
```

jQuery加的这个参数导致新浪财经服务器解析参数出错，所以没有得到预期的数据结果，那就继续看jQuery的文档，看看能否让其不加这个参数，仔细一看还真有：
> "script": Evaluates the response as JavaScript and returns it as plain text. Disables caching by appending a query string parameter, _=[TIMESTAMP], to the URL unless the cache option is set to true. Note: This will turn POSTs into GETs for remote-domain requests.

既然是这样，那就再加一个参数：

```javascript
$.ajax({
    url: 'http://hq.sinajs.cn/rn=1454399448305&list=sz300369',
    type: 'GET',
    dataType: 'script',
    cache: true,
    success: function() {
        console.log(hq_str_sz300369);
    }
});
```

最后问题解决~
