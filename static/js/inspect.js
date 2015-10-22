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
            isMobile: (function() {
                if (browser.versions['mobile']) return true;
                return false;
            }()),
            // 瀏覽器原始user agent
            UA: (function() {
                return ua;
            }()),
            // Cookie是否啟用
            isCookieEnabled: (function() {
                return nav.cookieEnabled;
            }()),
            // 客戶端系統
            platform: (function() {
                return nav.platform;
            }()),
            // 瀏覽器語言
            language: (function() {
                return nav.language;
            }()),
            // 是否支持并启用了DNT
            isDNT: (function() {
                return nav.doNotTrack == 1 ? true : false;
            }()),
            // 是否支持并启用了Java
            isJavaEnabled: (function() {
                return nav.javaEnabled;
            }()),
            online: (function() {
                return nav.onLine;
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
