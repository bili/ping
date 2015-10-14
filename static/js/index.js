function ping(url, opts) {
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
$(function() {
    $('#connect').on('click', function() {
        var url = '/';
        var $btn = $(this);
        var $status = $('#connect-status');
        var timeout;
        ping(url, {
            beforePing: function() {
                var dots = ['', '.', '..', '...'];
                var count = 0;
                timeout = setInterval(function() {
                    $status.html('连接中'+dots[count++%dots.length]);
                }, 350);
                $btn.prop('disabled', true);
            },
            afterPing: function(status, req) {
                $btn.prop('disabled', false);
                clearInterval(timeout);
                if (status) {
                    $status.text('连接成功');
                } else {
                    $status.text('连接失敗'+req.status);
                }
            }
        });
    });
});
