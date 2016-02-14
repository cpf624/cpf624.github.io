---
title: POST方式异步文件下载
category: 编程开发
tags: [JavaScript, HTML]
---

#### 1. 定义一个iframe标签，并设置为hidden
```html
<iframe id="hiddenFrame" style="visibility: hidden"></iframe>
```

#### 2. 定义一个form,action属性设置为相应的文件下载链接,同样设置为hidden,并将target属性设置为上一步定义的iframe的id
```html
<form id="hiddenForm" action="export.action" method="post"
    target="hiddenFrame" style="visibility: hidden;">
</form>
```

#### 3. 当需要下载文件时，通过js将上一步定义的form提交，当然如果需要传递参数，通过js将相应的参数加入form中即可
```javascript
var form = document.getElementById('hiddenForm');
var input = document.createElement("input");
input.setAttribute('name', 'option');
input.setAttribute('value', '123');
form.appendChild(input);
if (options) {
    for(var op in options){
        input = document.createElement("input");
        input.setAttribute('name', op);
        input.setAttribute('value', options[op]);
        form.appendChild(input);
    }
}
form.submit();
form.innerHTML = '';
```
