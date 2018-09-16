'use strict';
(function(){


    var 
        iUA = navigator.userAgent,
        // 配置是否使用 缩放 viewport
        needScale = window.__flexlayoutConfig && window.__flexlayoutConfig.scale === true ? true : false,
        // needScale = true,
        UA = {
            YY: /YY[\/ ][0-9.]+/.test(iUA),
            Android: /Android[\/ ](\d+\.\d+)/.test(iUA) ? RegExp.$1 : false,
            IOS: /(iPhone|iPod|iPad)/.test(iUA),
            UCBrowser: /UCBrowser|UCWEB/.test(iUA)
        };


    var 
        metaEl = document.querySelector('meta[name=viewport]'),
        head = document.getElementsByTagName('head')[0],
        htmlEl = document.getElementsByTagName('html')[0],
        docEl = document.documentElement,
        dpr = window.devicePixelRatio || 1,
        scWidth = window.screen.width,
        scHeight = window.screen.height;

    if(!metaEl){
        metaEl = document.createElement('meta');
        metaEl.name = "viewport";
        head.appendChild(metaEl);
    }

    // 已经初始化过, 跳出
    if(htmlEl.getAttribute('data-dpr')) {
        return;
    }

    if(UA.IOS && UA.YY){
        needScale = false;
    }



    metaEl.content = "width=device-width, initial-scale=1, maximum-scale=1";


    if(UA.IOS){
        if(needScale){
            scWidth = scWidth * dpr;
            scHeight = scHeight * dpr;
        }

    } else if(UA.Android){
        // alert([
        //     'docEl.clientWidth:' + docEl.clientWidth,
        //     'docEl.offsetWidth:' + docEl.offsetWidth,
        //     'scWidth:' + scWidth,

        // ].join('\n'));
        // 修复部分机型内嵌页(oppo R8) 无论是 clientWidth、 offsetWidth、 screenWidth 都相等的情况（webview 已写死尺寸， 缩放不了）
        if(docEl.clientWidth == docEl.offsetWidth && docEl.offsetWidth == scWidth){
            needScale = false;
            dpr = 1;
        }


        if(needScale){
            var docW2H = docEl.clientWidth - docEl.clientHeight,
                scW2H = scWidth - scHeight;

            // 修复部分机型 window.screen.width 始终代表屏幕较短的问题 即 横屏情况下 window.screen.width < window.screen.height
            if(docW2H / Math.abs(docW2H) != (scW2H) / Math.abs(scW2H)){
                scWidth = window.screen.height;
                scHeight = window.screen.width;
            }


            // 修复部分机型 window.screen.width === docEl.clientWidth 情况, 正常应该是 window.screen.width == docEl.clientWidth * dpr
            if(Math.abs(scWidth - docEl.clientWidth * dpr) > 2){
                scWidth = Math.floor(scWidth * dpr);
                scHeight = Math.floor(scHeight * dpr);
            }

        } else {
            scWidth = docEl.clientWidth;
            scHeight = docEl.clientHeight;
        }
        htmlEl.className += ' mobile-layout android-layout';


    } else {
        scWidth = docEl.clientWidth;
        scHeight = docEl.clientHeight;
        htmlEl.className += ' pc-layout';
    }


    var 
        clientWidth = scWidth > scHeight? scHeight: scWidth,
        clientHeight = scWidth > scHeight? scWidth: scHeight,
        rem = clientWidth / 10, 
        vrem = clientHeight / 10,
        fontEl = document.createElement('style'), 
        scale = 1 / dpr; // 设置viewport，进行缩放，达到高清效果 

    var cnt = [
        'width=' + clientWidth,
        'initial-scale=' + scale,
        'maximum-scale='+ scale
    ];

    if(UA.Android && UA.Android <= 4 && !UA.UCBrowser){
        // 修复部分低端机缩放后显示比例不正常问题 而 UC浏览器 碰到这个则会出现忽略 scale 直接 1:1 显示
        cnt.push('target-densitydpi=device-dpi');
    }
    if(needScale){
        metaEl.setAttribute('content', cnt.join(','));

    } else {
        dpr = 1;
    }


    docEl.firstElementChild.appendChild(fontEl); 


    var 
        cWidth = docEl.clientWidth,
        cHeight = docEl.clientHeight,
        mediaWidth = cWidth > cHeight? cWidth: cHeight;

    fontEl.innerHTML = [
        'html{font-size:' + rem + 'px!important;}',
        '@media screen and (min-width: '+ mediaWidth +'px){',
            'html{font-size:'+ vrem +'px!important;}',
        '}'
    ].join('');


    if(dpr < 1.5){
        dpr = 1;

    } else if(dpr < 2){
        dpr = 1.5;

    } else if(dpr < 2.5){
        dpr = 2;

    } else if(dpr < 3){
        dpr = 2.5;

    } else {
        dpr = 3;
    }
    htmlEl.setAttribute('data-dpr', dpr); // 动态写入样式 
})();
