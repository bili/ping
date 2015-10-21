$(function() {
    var inpect = new Inspect();
    $('#platform').text(inpect.isMobile() ? 'Mobile' : 'PC');
    $('#ua').text(inpect.getUA());
    $('#cookieEnabled').text(inpect.isCookieEnabled() ? "已启用" : "已禁用");
    $('#connect').on('click', function() {
        var url = '/';
        var $btn = $(this);
        var $status = $('#connect-status');
        var timeout;
        inpect.ping(url, {
            beforePing: function() {
                var dots = ['', '.', '..', '...'];
                var count = 0;
                timeout = setInterval(function() {
                    $status.html('连接中' + dots[count++ % dots.length]);
                }, 350);
                $btn.prop('disabled', true);
            },
            afterPing: function(status, req) {
                $btn.prop('disabled', false);
                clearInterval(timeout);
                if (status) {
                    $status.text('连接成功');
                } else {
                    $status.text('连接失敗（錯誤碼：' + req.status + '）');
                }
            }
        });
    });
});
