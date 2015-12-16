# 移动端多屏适配方案 flexlayout
这是一套 通过 JS + sass 实现的 多屏适配方案。

## 解决的问题
* 像PC端那样直接用 px 愉快地切图，1套样式适配所有手机
* 横竖屏随意切换
* 不需要单独处理 1px border retina下问题

## JS 写法
JS 可用 gulp-inline 等前端自动化工具 把 js 内容 inline 到项目 html 里面，or 直接把代码贴到 html 头部

```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>flexlayout</title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0">
</head>
<script src="js/flexlayout.js" inline></script>
<body>
...
</html>

```

## sass mixin 写法
```
$psdWidth: 320!default;
@function rem($val){
    @return round($val / $psdWidth * 10 * 100) / 100 * 1rem;
}
```

## 多组件引用方式参考

组件写法参考
```
$psdWidth: 640!global;
@mixin w-testComponent($path){
    .w-testComponent {
        background: url($path + 'images/logo.png');
        width: rem(320);
        height: rem(320);
        padding: rem(20) rem(20) rem(20) rem(15);
    }
    ...
}
```

示例图

![info](https://raw.githubusercontent.com/jackness1208/resource/master/project/flexlayout/images/info01.png)

demo 在[这里](http://www.jackness.org/lab/2015/flexlayout/html/example3.html)

![demo](https://raw.githubusercontent.com/jackness1208/resource/master/project/flexlayout/images/qrcode.png)

