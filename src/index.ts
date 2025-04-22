const iUA = navigator.userAgent

const UA = {
  YY: /YY[/ ][0-9.]+/.test(iUA),
  Android: /Android[/ ](\d+\.\d+|\d+)/.test(iUA) ? RegExp.$1 : false,
  Harmony: /Harmony/.test(iUA),
  IOS: /(iPhone|iPod|iPad)/.test(iUA),
  UCBrowser: /UCBrowser|UCWEB/.test(iUA)
}

const trigger = (target: Element | Window, type: string) => {
  const dc = document
  if (dc.createEvent) {
    const evt = dc.createEvent('HTMLEvents')
    evt.initEvent(type, false, true)
    target.dispatchEvent(evt)
  }
}

export interface InitFlexlayoutOption {
  /** 是否进行 meta 缩放处理,默认为 true */
  scale?: boolean
  /** 是否进行竖屏的rem 单独适配,默认为 true */
  vrem?: boolean
}

export function initFlexlayout(op?: InitFlexlayoutOption) {
  let metaEl = document.querySelector('meta[name=viewport]')
  const head = document.getElementsByTagName('head')[0]
  const htmlEl = document.getElementsByTagName('html')[0]
  const docEl = document.documentElement
  let dpr = window.devicePixelRatio || 1

  let needScale = true
  let needVrem = true

  if (op?.scale !== undefined) {
    needScale = op.scale
  }

  if (op?.vrem !== undefined) {
    needVrem = op.vrem
  }

  let retryKey: any
  const init = function () {
    let scWidth = window.screen.width
    let scHeight = window.screen.height

    // 修复部分机型初始化时获取不了屏幕宽度问题
    clearTimeout(retryKey)
    if (!scWidth) {
      retryKey = setTimeout(function () {
        init()
      }, 50)
      return
    }

    if (!metaEl) {
      metaEl = document.createElement('meta')
      metaEl.setAttribute('name', 'viewport')
      head.appendChild(metaEl)
    }

    if (UA.IOS && UA.YY) {
      needScale = false
    }

    metaEl.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1')

    if (UA.IOS) {
      if (needScale) {
        scWidth = scWidth * dpr
        scHeight = scHeight * dpr
      }
    } else if (UA.Android || UA.Harmony) {
      // 修复部分机型内嵌页(oppo R8) 无论是 clientWidth、 offsetWidth、 screenWidth 都相等的情况（webview 已写死尺寸， 缩放不了）
      if (docEl.clientWidth === docEl.offsetWidth && docEl.offsetWidth === scWidth) {
        needScale = false
        dpr = 1
      }

      if (needScale) {
        const docW2H = docEl.clientWidth - docEl.clientHeight
        const scW2H = scWidth - scHeight

        // 修复部分机型 window.screen.width 始终代表屏幕较短的问题 即 横屏情况下 window.screen.width < window.screen.height
        if (docW2H / Math.abs(docW2H) !== scW2H / Math.abs(scW2H)) {
          scWidth = window.screen.height
          scHeight = window.screen.width
        }

        // 修复部分机型 window.screen.width === docEl.clientWidth 情况, 正常应该是 window.screen.width == docEl.clientWidth * dpr
        if (Math.abs(scWidth - docEl.clientWidth * dpr) > 2) {
          scWidth = Math.floor(scWidth * dpr)
          scHeight = Math.floor(scHeight * dpr)
        }
      } else {
        scWidth = docEl.clientWidth
        scHeight = docEl.clientHeight
      }
      if (htmlEl.className.indexOf('mobile-layout') === -1) {
        htmlEl.className += ' mobile-layout android-layout'
      }
    } else {
      scWidth = docEl.clientWidth
      scHeight = docEl.clientHeight
      if (htmlEl.className.indexOf('pc-layout') === -1) {
        htmlEl.className += ' pc-layout'
      }
    }

    const clientWidth = scWidth > scHeight ? scHeight : scWidth
    const clientHeight = scWidth > scHeight ? scWidth : scHeight
    const rem = clientWidth / 10
    const vrem = clientHeight / 10
    const scale = 1 / dpr // 设置viewport，进行缩放，达到高清效果

    // alert('window.screen.width:' + window.screen.width)
    const cnt = ['width=' + clientWidth, 'initial-scale=' + scale, 'maximum-scale=' + scale]

    if (UA.Android && +UA.Android <= 4 && !UA.UCBrowser) {
      // 修复部分低端机缩放后显示比例不正常问题 而 UC浏览器 碰到这个则会出现忽略 scale 直接 1:1 显示
      cnt.push('target-densitydpi=device-dpi')
    }
    if (needScale) {
      metaEl.setAttribute('content', cnt.join(','))
    } else {
      dpr = 1
    }

    const fontElId = 'flexlayoutFontStyle'
    let fontEl = document.getElementById(fontElId)
    if (!fontEl) {
      fontEl = document.createElement('style')
      fontEl.id = fontElId
      if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(fontEl)
      }
    }

    const cWidth = docEl.clientWidth
    const cHeight = docEl.clientHeight
    const mediaWidth = cWidth > cHeight ? cWidth : cHeight

    if (needVrem === false) {
      fontEl.innerHTML = ['html{font-size:' + rem + 'px!important;}'].join('')
    } else {
      fontEl.innerHTML = [
        'html{font-size:' + rem + 'px!important;}',
        '@media screen and (min-width: ' + mediaWidth + 'px){',
        '    html{font-size:' + vrem + 'px!important;}',
        '}'
      ].join('')
    }

    if (dpr < 1.5) {
      dpr = 1
    } else if (dpr < 2) {
      dpr = 1.5
    } else if (dpr < 2.5) {
      dpr = 2
    } else if (dpr < 3) {
      dpr = 2.5
    } else {
      dpr = 3
    }
    htmlEl.setAttribute('data-dpr', `${dpr}`) // 动态写入样式
  }
  init()

  let iWidth = window.screen.width

  window.onresize = function () {
    iWidth = window.screen.width
    init()
  }

  let padding = 0

  const intervalKey = setInterval(function () {
    padding++
    if (iWidth !== window.screen.width) {
      trigger(window, 'resize')
      init()
    }
    if (padding > 10) {
      clearInterval(intervalKey)
    }
  }, 1000)
}
