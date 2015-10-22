$(function() {
    var inspect = new Inspect();
    $('#platform').text(inspect.platform);
    $('#device').text(inspect.isMobile ? 'Mobile' : 'PC');
    $('#browser').text(inspect.browser.name + ' ' + inspect.browser.ver);
    $('#ua').text(inspect.UA);
    $('#lanuage').text(inspect.language);
    $('#cookieEnabled').text(inspect.isCookieEnabled ? "已启用" : "已禁用");
    $('#javaEnabled').text(inspect.isJavaEnabled ? "已启用" : "已禁用");
    $('#isDNT').text(inspect.isDNT ? "已启用" : "已禁用");
    $('#date').text(new Date());
    $('#online').text(inspect.online ? '在線' : '離線');
    $('#resolution').text(inspect.screen.width + 'px(w) * ' + inspect.screen.height + 'px(h)');
    $('#orientation').text(inspect.isPortrait ? '豎屏' : '橫屏');
    $('#connect').on('click', function() {
        var url = 'http://www.dib66.com/';
        var $btn = $(this);
        var $status = $('#connect-status');
        var timeout;
        inspect.ping(url, {
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
