/*!
 * yyl-flexlayout esm 2.0.0
 * (c) 2020 - 2021 jackness
 * Released under the MIT License.
 */
var iUA = navigator.userAgent;
var UA = {
    YY: /YY[/ ][0-9.]+/.test(iUA),
    Android: /Android[/ ](\d+\.\d+|\d+)/.test(iUA) ? RegExp.$1 : false,
    IOS: /(iPhone|iPod|iPad)/.test(iUA),
    UCBrowser: /UCBrowser|UCWEB/.test(iUA)
};
var trigger = function (target, type) {
    var dc = document;
    if (dc.createEvent) {
        var evt = dc.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        target.dispatchEvent(evt);
    }
};
function initFlexlayout(op) {
    var metaEl = document.querySelector('meta[name=viewport]');
    var head = document.getElementsByTagName('head')[0];
    var htmlEl = document.getElementsByTagName('html')[0];
    var docEl = document.documentElement;
    var dpr = window.devicePixelRatio || 1;
    var needScale = true;
    var needVrem = true;
    if ((op === null || op === void 0 ? void 0 : op.scale) !== undefined) {
        needScale = op.scale;
    }
    if ((op === null || op === void 0 ? void 0 : op.vrem) !== undefined) {
        needVrem = op.vrem;
    }
    var retryKey;
    var init = function () {
        var scWidth = window.screen.width;
        var scHeight = window.screen.height;
        // 修复部分机型初始化时获取不了屏幕宽度问题
        clearTimeout(retryKey);
        if (!scWidth) {
            retryKey = setTimeout(function () {
                init();
            }, 50);
            return;
        }
        if (!metaEl) {
            metaEl = document.createElement('meta');
            metaEl.setAttribute('name', 'viewport');
            head.appendChild(metaEl);
        }
        if (UA.IOS && UA.YY) {
            needScale = false;
        }
        metaEl.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
        if (UA.IOS) {
            if (needScale) {
                scWidth = scWidth * dpr;
                scHeight = scHeight * dpr;
            }
        }
        else if (UA.Android) {
            // 修复部分机型内嵌页(oppo R8) 无论是 clientWidth、 offsetWidth、 screenWidth 都相等的情况（webview 已写死尺寸， 缩放不了）
            if (docEl.clientWidth === docEl.offsetWidth && docEl.offsetWidth === scWidth) {
                needScale = false;
                dpr = 1;
            }
            if (needScale) {
                var docW2H = docEl.clientWidth - docEl.clientHeight;
                var scW2H = scWidth - scHeight;
                // 修复部分机型 window.screen.width 始终代表屏幕较短的问题 即 横屏情况下 window.screen.width < window.screen.height
                if (docW2H / Math.abs(docW2H) !== scW2H / Math.abs(scW2H)) {
                    scWidth = window.screen.height;
                    scHeight = window.screen.width;
                }
                // 修复部分机型 window.screen.width === docEl.clientWidth 情况, 正常应该是 window.screen.width == docEl.clientWidth * dpr
                if (Math.abs(scWidth - docEl.clientWidth * dpr) > 2) {
                    scWidth = Math.floor(scWidth * dpr);
                    scHeight = Math.floor(scHeight * dpr);
                }
            }
            else {
                scWidth = docEl.clientWidth;
                scHeight = docEl.clientHeight;
            }
            if (htmlEl.className.indexOf('mobile-layout') === -1) {
                htmlEl.className += ' mobile-layout android-layout';
            }
        }
        else {
            scWidth = docEl.clientWidth;
            scHeight = docEl.clientHeight;
            if (htmlEl.className.indexOf('pc-layout') === -1) {
                htmlEl.className += ' pc-layout';
            }
        }
        var clientWidth = scWidth > scHeight ? scHeight : scWidth;
        var clientHeight = scWidth > scHeight ? scWidth : scHeight;
        var rem = clientWidth / 10;
        var vrem = clientHeight / 10;
        var scale = 1 / dpr; // 设置viewport，进行缩放，达到高清效果
        // alert('window.screen.width:' + window.screen.width)
        var cnt = ['width=' + clientWidth, 'initial-scale=' + scale, 'maximum-scale=' + scale];
        if (UA.Android && +UA.Android <= 4 && !UA.UCBrowser) {
            // 修复部分低端机缩放后显示比例不正常问题 而 UC浏览器 碰到这个则会出现忽略 scale 直接 1:1 显示
            cnt.push('target-densitydpi=device-dpi');
        }
        if (needScale) {
            metaEl.setAttribute('content', cnt.join(','));
        }
        else {
            dpr = 1;
        }
        var fontElId = 'flexlayoutFontStyle';
        var fontEl = document.getElementById(fontElId);
        if (!fontEl) {
            fontEl = document.createElement('style');
            fontEl.id = fontElId;
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(fontEl);
            }
        }
        var cWidth = docEl.clientWidth;
        var cHeight = docEl.clientHeight;
        var mediaWidth = cWidth > cHeight ? cWidth : cHeight;
        if (needVrem === false) {
            fontEl.innerHTML = ['html{font-size:' + rem + 'px!important;}'].join('');
        }
        else {
            fontEl.innerHTML = [
                'html{font-size:' + rem + 'px!important;}',
                '@media screen and (min-width: ' + mediaWidth + 'px){',
                '    html{font-size:' + vrem + 'px!important;}',
                '}'
            ].join('');
        }
        if (dpr < 1.5) {
            dpr = 1;
        }
        else if (dpr < 2) {
            dpr = 1.5;
        }
        else if (dpr < 2.5) {
            dpr = 2;
        }
        else if (dpr < 3) {
            dpr = 2.5;
        }
        else {
            dpr = 3;
        }
        htmlEl.setAttribute('data-dpr', "" + dpr); // 动态写入样式
    };
    init();
    var iWidth = window.screen.width;
    window.onresize = function () {
        iWidth = window.screen.width;
        init();
    };
    var padding = 0;
    var intervalKey = setInterval(function () {
        padding++;
        if (iWidth !== window.screen.width) {
            trigger(window, 'resize');
            init();
        }
        if (padding > 10) {
            clearInterval(intervalKey);
        }
    }, 1000);
}

export { initFlexlayout };
