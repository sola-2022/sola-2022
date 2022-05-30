const translateText = [
    ['.top_section .subtitle', '学びのオリンピック', '<span>Shibuya Olympiad </span><span>in Liberal Arts</span>'],
    ['.event_section .section_title', 'イベント情報', 'Upcoming Events'],
    ['.main .who_can_participate', '参加条件', 'Who can participate?'],
    ['.main .guideline_text', '応募要項', 'Guideline'],
    ['.main .poster_text', 'ポスター', 'Poster'],
    ['.main .guideline_pdf_text', '応募要項 PDF', 'Guideline PDF'],
    ['.main .poster_pdf_text', 'ポスター PDF', 'Poster PDF'],
];

$(window).on('load', function() {
    for (let i = 0; i < translateText.length; i++) {
        if (location.href.indexOf('lang=jp') >= 0) {
            $(translateText[i][0]).html(translateText[i][1]);
        } else {
            $(translateText[i][0]).html(translateText[i][2]);
        }
    }
});