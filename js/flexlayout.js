'use strict';
(function(){


    var iUA = navigator.userAgent,
        UA = {
            YY: /YY[\/ ][0-9.]+/.test(iUA),
            Android: /Android[\/ ](\d+\.\d+)/.test(iUA) ? RegExp.$1 : false,
            IOS: /(iPhone|iPod|iPad)/.test(iUA),
            UCBrowser: /UCBrowser|UCWEB/.test(iUA)
        };


    var metaEl = document.createElement('meta'),
        head = document.getElementsByTagName('head')[0],
        htmlEl = document.getElementsByTagName('html')[0],
        docEl = document.documentElement,
        dpr = window.devicePixelRatio || 1,
        scWidth = window.screen.width,
        clWidth = docEl.clientWidth,
        scHeight = window.screen.height;

    // 已经初始化过, 跳出
    if(docEl.getAttribute('data-dpr')) {
        return;
    }

    metaEl.name = "viewport";
    head.appendChild(metaEl);

    if(UA.IOS) { // IOS
        // 临时方案 修复 ios yy 内嵌页 缩放比例不正常问题
        if(UA.YY){
            dpr = 1;
        }
        scWidth = scWidth * dpr;
        scHeight = scHeight * dpr;
        htmlEl.className += ' mobile-layout ios-layout';

    } else if(UA.Android) { // Android

        // 修复部分机型内嵌页(oppo R8) 无论是 clientWidth、 offsetWidth、 screenWidth 都相等的情况（webview 已写死尺寸， 缩放不了）
        if(docEl.clientWidth == docEl.offsetWidth && docEl.offsetWidth == scWidth){
            dpr = 1;
        }
        
        metaEl.content = "width=device-width, initial-scale=1, maximum-scale=1";

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
        htmlEl.className += ' mobile-layout android-layout';

    } else {
        htmlEl.className += ' pc-layout';
        return;
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
	
	metaEl.setAttribute('content', cnt.join(','));

	docEl.setAttribute('data-dpr', dpr); // 动态写入样式 

	docEl.firstElementChild.appendChild(fontEl); 


    var 
        cWidth = docEl.clientWidth,
        cHeight = docEl.clientHeight,
        mediaWidth = cWidth > cHeight? cWidth: cHeight;


	fontEl.innerHTML = [
		'html{font-size:' + rem + 'px!important;}',
		'@media screen and (min-width: '+ mediaWidth +'px){',
			'html{font-size:'+ vrem +'px!important;}',
		'}',
	].join('');

})();
