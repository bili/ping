(function() {

    var Inspect = {
        ping: function ping(url, opts) {
            var isOk = false;
            var maxCount = 3;
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
    }

    root = typeof exports !== "undefined" && exports !== null ? exports : window;
    root.Inspect = Inspect;

}())
