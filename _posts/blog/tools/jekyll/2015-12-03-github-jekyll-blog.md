---
title: 使用Github, Jekyll打造自己的博客
category: 编程工具
tags: [Github, Jekyll]
---

### 1. 在[Github](https://github.com/)创建博客项目
<https://pages.github.com/>

<https://help.github.com/categories/github-pages-basics/>

创建完成后，博客以源码的形式托管在Github，Github会自动生成一个站点，这样就有了一个不用自己维护且完全免费的博客。

#### 1.1 自定义域名绑定
在项目根目录下创建一个CNAME文件，将要绑定的域名写在里面即可。

<https://help.github.com/articles/adding-a-cname-file-to-your-repository/>

### 2. 使用[Jekyll](http://jekyllrb.com/)
Github Pages只支持静态页面，如果一个一个页面的编写，那就太麻烦了，这时Jekyll就派上用场了。Jekyll可以根据网页源码(如Markdown)生成静态文件，而且提供模板、变量、插件等功能。Github也支持Jekyll，因此只要按照Jekyll规范编写网页源码，提交代码后Github将自动生成对应的静态文件。

<http://jekyll.bootcss.com/>

<http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html>


#### 2.1 Jekyll模板
<https://github.com/jekyll/jekyll/wiki/Themes>

<http://jekyllthemes.org/>

#### 2.2 Markdown转换
可以使用Markdown来编写网页，Jekyll可以将Markdown文件转换成静态网页文件，默认使用的是kramdown，不过推荐使用redcarpet。在 `_config.yml` 中添加如下配置即可:

```ruby
markdown: redcarpet
```

不同的Markdown转换器转换效果可能有所不同，因此最好是编写的同时预览一下生成效果。

Markdown语法：<http://segmentfault.com/markdown#articleHeader5>

#### 2.3 源码语法高亮
如果有在博客中高亮显示源码的需要，推荐使用pygments插件，具体参考:

<http://havee.me/internet/2013-08/support-pygments-in-jekyll.html>

<http://pygments.org/docs/cmdline/>

同时还可以使用Solarized风格的样式，具体参考:

<http://marcusmo.co.uk/blog/solarized-code-highlighting/>

#### 2.4 文件压缩
CSS, JavaScript压缩参考:

<http://jekyllrb.com/docs/assets/>

不足的是JavaScript压缩只支持CoffeeScript。

HTML压缩参考:

<http://jch.penibelst.de/>

#### 2.5 Liquid模板引擎
<https://github.com/Shopify/liquid/wiki>

<http://liquidmarkup.org/>

<http://havee.me/internet/2013-11/jekyll-liquid-designers.html>

### 3. 评论系统
名声最大的第三方评论系统当属[Disqus](https://disqus.com/)了，不过其在国外，访问速度可能稍慢，而且还有被墙的风险，所以选择要慎重。国内的第三方评论系统参考:

<http://lusongsong.com/reed/384.html>

而我选择的是新浪微博评论箱，参考:

<http://open.weibo.com/widget/comments.php>

### 4. 我的博客源码

<https://github.com/cpf624/cpf624.github.io>
