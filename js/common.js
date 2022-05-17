function changeLang(num) {
    let lang = 'en';
    $('.lang_outer').removeClass('selected');
    if (num == 'jp') {
        $('.lang_jp').addClass('selected');
        lang = 'jp';
    } else {
        $('.lang_en').addClass('selected');
        lang = 'en';
    }
    let _url = location.href;
    if (_url.indexOf('?') >= 0) {
        location.href = _url.replace('?lang=en', '').replace('?lang=jp', '') + '?lang=' + lang;
    } else {
        location.href = _url + '?lang=' + lang;
    }
}
$(window).on('load', function() {
    if (location.href.indexOf('lang=jp') >= 0) {
        $('.lang_outer').removeClass('selected');
        $('.lang_jp').addClass('selected');
    } else {
        $('.lang_outer').removeClass('selected');
        $('.lang_en').addClass('selected');
    }
});