$(function() {
    $('#platform').text(Inspect.platform);
    $('#device').text(Inspect.isMobile ? 'Mobile' : 'PC');
    $('#browser').text(Inspect.browser.name + ' ' + Inspect.browser.ver);
    $('#ua').text(Inspect.UA);
    $('#lanuage').text(Inspect.language);
    $('#cookieEnabled').text(Inspect.isCookieEnabled ? "已启用" : "已禁用");
    $('#javaEnabled').text(Inspect.isJavaEnabled ? "已启用" : "已禁用");
    $('#isDNT').text(Inspect.isDNT ? "已启用" : "已禁用");
    $('#date').text(new Date());
    $('#online').text(Inspect.online ? '在線' : '離線');
    $('#resolution').text(Inspect.screen.width + 'px(寬) * ' + Inspect.screen.height + 'px(高)');
    $('#orientation').text(Inspect.isPortrait != -1 ? (Inspect.isPortrait ? '豎屏' : '橫屏') : '未知');
    $('#devicePixelRatio').text(Inspect.devicePixelRatio != -1 ? Inspect.devicePixelRatio : '未知');
    $('#connect').on('click', function() {
        var url = 'http://www.dib66.com/';
        var $btn = $(this);
        var $status = $('#connect-status');
        var timeout;
        Inspect.ping(url, {
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
