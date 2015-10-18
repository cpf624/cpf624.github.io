---
title: PHP验证码
category: 编程开发
tags: [PHP]
---

在用PHP写自己的博客时，当做到登录这块时，需要使用一个图片验证码，在网上搜了一大圈，都没找到一个满意的结果，最终参照网友的代码，自己做了一些更改，并抽取成一个通用的函数。


首先是生成一张字符窜图片：

```php
<?php
/**
 * 将字符窜生成图片（包含随机线条等混淆信息）
 * @access public
 * @param string $_str 字符窜
 * @param int $_width 图片宽度
 * @param int $_height 图片高度
 * @param bool $_flag 图片是否需要边框
 */
function create_str_image($_str, $_width, $_height, $_flag = true) {
    if (!is_int($_width) || $_width <= 0 || !is_int($_height)
        || $_height <= 0) {
        return null;
    }
    $_str_len = strlen($_str);
    if ($_str_len <= 0) {
        return null;
    }
    // 创建一张图像
    $_img = imagecreatetruecolor($_width, $_height);
    // 白色
    $_white = imagecolorallocate($_img, 255, 255, 255);
    // 填充
    imagefill($_img, 0, 0, $_white);
    // 边框
    if ((bool)$_flag) {
        $_rnd_color = imagecolorallocate($_img, mt_rand(0, 255),
            mt_rand(0, 255), mt_rand(0, 255));
        imagerectangle($_img, 0, 0, $_width-1, $_height-1, $_rnd_color);
    }
    $_rnd_count = $_width > $_height ? $_width - $_height : $_height - $_width;
    // 随机画线
    for ($i = 0; $i < $_rnd_count; $i++) {
        $_rnd_color = imagecolorallocate($_img, mt_rand(0, 255),
            mt_rand(0, 255), mt_rand(0, 255));
        imageline($_img, mt_rand(0, $_width), mt_rand(0, $_height),
            mt_rand(0, $_width), mt_rand(0, $_height), $_rnd_color);
    }
    // 随机雪花
    for ($i = 0; $i < $_rnd_count; $i++) {
        $_rnd_color = imagecolorallocate($_img, mt_rand(200, 255),
            mt_rand(200, 255), mt_rand(200, 255));
        imagestring($_img, 1, mt_rand(1, $_width), mt_rand(1, $_height),
            '*', $_rnd_color);
    }
    // 输出验证码
    $_str_width = 0.9 * $_width / $_str_len;
    $_str_height = 0.9 * $_height;
    $_str_pos = 0.1 * $_width;
    // 使用时需要修改一下字体路径
    // 默认情况下，生成的图片字体很小，所以才选择使用了别的字体
    $_font = $_SERVER["DOCUMENT_ROOT"] . "/fonts/FreeMonoOblique.ttf";
    for ($i = 0; $i < $_str_len; $i++) {
        $_rnd_color = imagecolorallocate($_img, mt_rand(0, 100),
            mt_rand(0, 150), mt_rand(0, 200));
        imagettftext($_img, $_str_height, mt_rand(0, 45), $_str_pos,
            $_str_height, $_rnd_color, $_font, $_str[$i]);
        $_str_pos += $_str_width;
    }
    return $_img;
}
?>
```

默认情况下是不支持图片生成的，还需要安装php5-gd，并将/etc/php5/apache2/php.ini文件中的gd.jpeg_ignore_warning = 0注释取消。

现在图片是生成出来了，但是要显示到页面，还得有如下代码：

```php
<?php
/**
 * @param int $len 随机字符窜长度，默认值：4
 * @param int $width 图片宽度，默认值：140
 * @param int $height 图片高度，默认值：40
 * @param bool $flag 是否需要边框，默认值：true
 * @param string $type 图片类型，默认值：image/png
 * @param string $key SESSION存放键，默认值：random_validation_code
 */

include_once(__DIR__ . "/include/array.php");
include_once(__DIR__ . "/include/random.php");
include_once(__DIR__ . "/include/images.php");

$len = array_get_int($_REQUEST, "len", 4);
$width = array_get_int($_REQUEST, "width", 140);
$height = array_get_int($_REQUEST, "height", 37);
$flag = array_get_bool($_REQUEST, "flag", true);
$type = array_get_string($_REQUEST, "type", "png");
$key = array_get_string($_REQUEST, "key", "vcode");
$str = random_str($len);
$img= create_str_image($str, $width, $height, $flag);
if ($img != null) {
    session_start();
    //输出图像
    switch(strtolower($type)) {
    case "jpeg":
        header("Content-Type: image/jpeg");
        imagejpeg($img);
        break;
    case "gif":
        header("Content-Type: image/gif");
        imagegif($img);
        break;
    default:
        header("Content-Type: image/png");
        imagepng($img);
        break;
    }
    // 销毁
    imagedestroy($img);
    // 保存在session
    $_SESSION[$key] = $str;
} else {
    header("Content-Type: text/plain");
    echo "fail to create image";
}
// print_r(array($len, $width, $height, $flag, $type, $key));
?>
```

为了更通用一些，所以所有参数都可以通过Request Param加入。
