(function() {
    var Inspect = function() {
        var self = this;
        var nav = navigator;
        var ua = nav.userAgent;
        var appVersion = nav.userAgent;
        var browser = {
            versions: function() {
                return { //移动终端浏览器版本信息
                    trident: ua.indexOf('Trident') > -1, //IE内核
                    presto: ua.indexOf('Presto') > -1, //opera内核
                    webKit: ua.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: ua.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: ua.indexOf('iPad') > -1, //是否iPad
                    webApp: ua.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    wechat: ua.indexOf('MicroMessenger') > -1 //是否微信內置瀏覽器
                };
            }(),
            language: (nav.browserLanguage || nav.language).toLowerCase()
        };
        return {
            // 終端是否為手機
            isMobile: browser.versions['mobile'] ? true : false,
            // 瀏覽器原始user agent
            UA: ua,
            browser: (function() {
                var browserName = nav.appName;
                var fullVersion = '' + parseFloat(nav.appVersion);
                var majorVersion = parseInt(nav.appVersion, 10);
                var nameOffset, verOffset, ix;

                // In Opera 15+, the true version is after "OPR/" 
                if ((verOffset = ua.indexOf("OPR/")) != -1) {
                    browserName = "Opera";
                    fullVersion = ua.substring(verOffset + 4);
                }
                // In older Opera, the true version is after "Opera" or after "Version"
                else if ((verOffset = ua.indexOf("Opera")) != -1) {
                    browserName = "Opera";
                    fullVersion = ua.substring(verOffset + 6);
                    if ((verOffset = ua.indexOf("Version")) != -1)
                        fullVersion = ua.substring(verOffset + 8);
                }
                // In MSIE, the true version is after "MSIE" in userAgent
                else if ((verOffset = ua.indexOf("MSIE")) != -1) {
                    browserName = "Microsoft Internet Explorer";
                    fullVersion = ua.substring(verOffset + 5);
                }
                // In Chrome, the true version is after "Chrome" 
                else if ((verOffset = ua.indexOf("Chrome")) != -1) {
                    browserName = "Chrome";
                    fullVersion = ua.substring(verOffset + 7);
                }
                // In Safari, the true version is after "Safari" or after "Version" 
                else if ((verOffset = ua.indexOf("Safari")) != -1) {
                    browserName = "Safari";
                    fullVersion = ua.substring(verOffset + 7);
                    if ((verOffset = ua.indexOf("Version")) != -1)
                        fullVersion = ua.substring(verOffset + 8);
                }
                // In Firefox, the true version is after "Firefox" 
                else if ((verOffset = ua.indexOf("Firefox")) != -1) {
                    browserName = "Firefox";
                    fullVersion = ua.substring(verOffset + 8);
                }
                // In most other browsers, "name/version" is at the end of userAgent 
                else if ((nameOffset = ua.lastIndexOf(' ') + 1) <
                    (verOffset = ua.lastIndexOf('/'))) {
                    browserName = ua.substring(nameOffset, verOffset);
                    fullVersion = ua.substring(verOffset + 1);
                    if (browserName.toLowerCase() == browserName.toUpperCase()) {
                        browserName = nav.appName;
                    }
                }
                // trim the fullVersion string at semicolon/space if present
                if ((ix = fullVersion.indexOf(";")) != -1)
                    fullVersion = fullVersion.substring(0, ix);
                if ((ix = fullVersion.indexOf(" ")) != -1)
                    fullVersion = fullVersion.substring(0, ix);

                majorVersion = parseInt('' + fullVersion, 10);
                if (isNaN(majorVersion)) {
                    fullVersion = '' + parseFloat(nav.appVersion);
                    majorVersion = parseInt(nav.appVersion, 10);
                }
                return {
                    name: browserName,
                    ver: fullVersion
                };
            }()),
            // Cookie是否啟用
            isCookieEnabled: nav.cookieEnabled,
            // 客戶端系統
            platform: nav.platform,
            // 瀏覽器語言
            language: nav.language,
            // 是否支持并启用了DNT
            isDNT: nav.doNotTrack == 1 ? true : false,
            // 是否支持并启用了Java
            isJavaEnabled: nav.javaEnabled,
            // 是否連接網絡
            online: nav.onLine,
            // 屏幕分辨率
            screen: (function() {
                return {
                    width: screen.width,
                    height: screen.height
                }
            }()),
            // 屏幕是否為豎屏
            isPortrait: (function() {
                var b = window.matchMedia("(orientation: portrait)");
                if (b.matches) return true;
                return false;
            }()),
            ping: function(url, opts) {
                var isOk = false;
                var maxCount = 5;
                opts.delay = opts.delay || 1000;
                if (opts.beforePing) opts.beforePing.call(this);
                var timeout = setTimeout(function() {
                    var fn = arguments.callee;
                    if (isOk) {
                        if (opts.afterPing) opts.afterPing.call(this, true);
                        clearInterval(timeout);
                    } else {
                        $.ajax({
                            url: url,
                            method: 'GET',
                            cache: false,
                            beforeSend: function() {},
                            complete: function(XMLHttpRequest, textStatus) {
                                if (XMLHttpRequest.status == 200) {
                                    isOk = true;
                                    fn.call(fn);
                                } else {
                                    if (--maxCount < 1) {
                                        if (opts.afterPing) opts.afterPing.call(this, false, XMLHttpRequest, textStatus);
                                        return;
                                    }
                                    setTimeout(function() {
                                        fn.call(fn);
                                    }, opts.delay);
                                }
                            }
                        });
                    }
                }, 1000);
            }
        };
    };

    root = typeof exports !== "undefined" && exports !== null ? exports : window;
    root.Inspect = Inspect;

}());
