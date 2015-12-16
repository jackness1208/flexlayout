!function(){

	var docEl = document.documentElement,
        dpr = window.devicePixelRatio || 1,
        scWidth = window.screen.width,
        scHeight = window.screen.height,
        docW2H = docEl.clientWidth - docEl.clientHeight,
        scW2H = scWidth - scHeight;


    // 临时方案 修复 ios yy 内嵌页 缩放比例不正常问题
    if(/(iPhone|iPod|iPad).*YY\/[0-9.]+/.test(navigator.userAgent)){
        dpr = 1;
    }
    

    // 修复部分机型 window.screen.width 始终代表屏幕较短的问题 即 横屏情况下 window.screen.width < window.screen.height
    if(docW2H / Math.abs(docW2H) != (scW2H) / Math.abs(scW2H)){
        scWidth = window.screen.height;
        scHeight = window.screen.width;
    }

    // 修复部分机型 window.screen.width === docEl.clientWidth 情况, 正常应该是 window.screen.width == docEl.clientWidth * dpr
    var fixDpr = scWidth === docEl.clientWidth
           ? dpr 
           : 1
           ,
		screenWidth = Math.floor(scWidth * fixDpr),
		screenHeight = Math.floor(scHeight * fixDpr),
		clientWidth = screenWidth > screenHeight? screenHeight: screenWidth,
		clientHeight = screenWidth > screenHeight? screenWidth: screenHeight,
		fontEl = document.createElement('style'), 
		metaEl = document.querySelector('meta[name="viewport"]'), 
		rem = clientWidth / 10, 
		vrem = clientHeight / 10,
		scale = 1 / dpr; // 设置viewport，进行缩放，达到高清效果 

    var cnt = [
        'width=' + clientWidth,
		'initial-scale=' + scale,
		'maximum-scale='+ scale
    ];

    if(!/UCBrowser|UCWEB/.test(navigator.userAgent)){
        // 修复部分低端机缩放后显示比例不正常问题 而 UC浏览器 碰到这个则会出现忽略 scale 直接 1:1 显示
        cnt.push('target-densitydpi=device-dpi');
    }
	
	metaEl.setAttribute('content', cnt.join(','));
	

	docEl.setAttribute('data-dpr', dpr); // 动态写入样式 
	docEl.firstElementChild.appendChild(fontEl); 

	fontEl.innerHTML = [
		'html{font-size:' + rem + 'px!important;}',
		'@media screen and (min-width: '+ (clientHeight) +'px){',
			'html{font-size:'+ vrem +'px!important;}',
		'}',
	].join('');
}();
