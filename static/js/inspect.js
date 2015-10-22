(function() {
    var Inspect = function() {
        var _self = this;
        this._nav = navigator;
        this._ua = this._nav.userAgent;
        this._appVersion = this._nav.userAgent;
        this._browser = {
            versions: function() {
                var u = _self._ua;
                return { //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    wechat: u.indexOf('MicroMessenger') > -1 //是否微信內置瀏覽器
                };
            }(),
            language: (this._nav.browserLanguage || this._nav.language).toLowerCase()
        };
        return {
            // 終端是否為手機
            isMobile: (function(_self) {
                if (_self._browser.versions['mobile']) return true;
                return false;
            }(this)),
            // 瀏覽器原始user agent
            UA: (function(_self) {
                return _self._ua;
            }(this)),
            // Cookie是否啟用
            isCookieEnabled: (function(_self) {
                return _self._nav.cookieEnabled;
            }(this)),
            // 客戶端系統
            platform: (function(_self) {
                return _self._nav.platform;
            }(this)),
            // 瀏覽器語言
            language: (function(_self) {
                return _self._nav.language;
            }(this)),
            // 是否支持并启用了DNT
            isDNT: (function(_self) {
                return _self._nav.doNotTrack == 1 ? true : false;
            }(this)),
            // 是否支持并启用了Java
            isJavaEnabled: (function(_self) {
                return _self._nav.javaEnabled;
            }(this)),
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
