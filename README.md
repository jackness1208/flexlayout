# 移动端多屏适配方案 flexlayout

这是一套 通过 JS + sass 实现的 多屏适配方案。

## 注意

本适配方案如发现在手机内嵌页使用时没有正常缩放，那意味着：
该 app 的 webview 没有将 setScalesPage 设定为 yes 或者 PhoneGap 中的 EnableViewportScale 没有设置为 true 导致。
暂时无解。需自行单独处理。

当前版本 若不同组件的 psdWidth 不一样时， 使用 dpr 函数将会出现 字体显示不一致的问题， 待修复

如：

```
// 临时方案 修复 ios yy 内嵌页 缩放比例不正常问题
if(/(iPhone|iPod|iPad).*YY\/[0-9.]+/.test(navigator.userAgent)){
    needScale = 1;
}
```

## 解决的问题

- 像 PC 端那样直接用 px 愉快地切图，1 套样式适配所有手机
- 横竖屏随意切换
- 不需要单独处理 1px border retina 下问题

## JS 写法

JS 可用 gulp-inline 等前端自动化工具 把 js 内容 inline 到项目 html 里面，or 直接把代码贴到 html 头部

```typescript
import { initFlexlayout } from 'yyl-flexlayout'
initFlexlayout()
```

## sass mixin 写法

```
$psdWidth: 320!default;
@function rem($val){
    @return round($val / $psdWidth * 10 * 100) / 100 * 1rem;
}

@function multiStr($str, $n){
    @if type-of($str) == 'number' {
        @return $str * $n;
    }

    @if type-of($str) == 'list' {
        $newList: ();
        @each $item in $str {
            $newList: append($newList, multiStr($item, $n));
        }
        @return $newList;
    }

    @return $str;
}

@mixin dpr ($key, $val) {

    [data-dpr="3"] & {
        #{$key}: multiStr($val, 3 / 2);
    }
    [data-dpr="2.5"] & {
        #{$key}: multiStr($val, 2.5 / 2);
    }
    [data-dpr="2"] & {
        #{$key}: multiStr($val, 2 / 2);
    }
    [data-dpr="1.5"] & {
        #{$key}: multiStr($val, 1.5);
    }
    [data-dpr="1"] & {
        #{$key}: multiStr($val, 1 / 2);
    }

    #{$key}: multiStr($val, 1 / 2);
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
        @include dpr(font-size, 12px);
    }
    ...
}
```

## types

```typescript
export interface InitFlexlayoutOption {
  /** 是否进行 meta 缩放处理,默认为 true */
  scale?: boolean
  /** 是否进行竖屏的rem 单独适配,默认为 true */
  vrem?: boolean
}
export declare function initFlexlayout(op?: InitFlexlayoutOption): void
```
