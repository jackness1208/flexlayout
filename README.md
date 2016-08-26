# 移动端多屏适配方案 flexlayout
这是一套 通过 JS + sass 实现的 多屏适配方案。

## 注意
本适配方案如发现在手机内嵌页使用时没有正常缩放，那意味着：
该app 的 webview 没有将 setScalesPage 设定为 yes 或者 PhoneGap 中的 EnableViewportScale 没有设置为 true 导致。
暂时无解。需自行单独处理。
如：
```
// 临时方案 修复 ios yy 内嵌页 缩放比例不正常问题
if(/(iPhone|iPod|iPad).*YY\/[0-9.]+/.test(navigator.userAgent)){
    dpr = 1;
}
```

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
</head>
<script>
window.__flexlayoutConfig = { // 不填默认会针对 viewport 进行缩放
    scale: true
};
</script>
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

## 更新记录
### 1.3.0 [2016-8-26]
* [ADD] 添加 组件会根据 window.__flexlayoutConfig.scale 来判断是否执行页面 缩放处理设置
* [ADD] pc 端观看 本组件页面也会进行 font-size, dpr 计算

### 1.2.0 [2016-7-21]
* [ADD] 添加防止重复加载此js 功能

### 1.1.1 [2016-3-31]
* [FIX] 修复 组件 在 华为 M8 下显示有问题 BUG
* [FIX] 修复 组件 在 乐视 X501 下显示有问题 BUG

### 1.1.0 [2016-3-3]
* [ADD] 在 html 通过 classname 对 PC、手机、ios、 andorid 进行区分, 若为 PC端则 只添加 样式，不会触发 viewport init
