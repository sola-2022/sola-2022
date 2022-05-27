const translateText = [
    ['.top_section .subtitle', '学びのオリンピック', '<span>Shibuya Olympiad </span><span>in Liberal Arts</span>'],
    ['.event_section .section_title', 'イベント情報', 'Upcoming Events'],
    ['.whatsSolaBody', `令和元年度より、文部科学省は、Society5.0時代に向けて、イノベーティブなグローバル人材を育成するため、高等学校と国内外の大学，企業，国際機関等が協働し、高校生国際会議の開催等、高校生へ高度な学びを提供するネットワークの形成を目指すＷＷＬ（ワールド・ワイド・ラーニング）コンソーシアム構築事業を実施しています。<br><br>本学園が、文部科学省より、その拠点校に指定されてから、３年目を迎えました。最終年度にあたる本年、そのまとめとして、学びのオリンピック「SOLA 2021」（Shibuya Olympiad in Liberal Arts 2021）を開催することとなりました。テーマを「SDGs～私たちのつくる未来～」とし、模擬国際界、コンペティション、プレゼンテーションなど、様々な種目（部門）で中高生が互いに学び合い、気づきを得る一日になることを期待しております。このような中高生による中高生のための国際大会は世界にも類を見ない記念すべき試みです。皆様のご参加をお待ちしております。​<br> ​<br> ​<br>WWLコンソーシアム構築支援事業研究開発報告書をご覧ください：<br><br><a class="links" target="_blank" href="https://www.shibushibu.jp/wp-content/uploads/2021/04/2020wwl_kenkyukaihatsuhokokusho.pdf">https://www.shibushibu.jp/wp-content/uploads/2021/04/2020wwl_kenkyukaihatsuhokokusho.pdf</a>`, `Since 2019, the Ministry of Education, Culture, Sports, Science and Technology of Japan (MEXT), as a means of providing high school students with high quality learning and cultivating innovative people in preparation for Society 5.0, has been organizing the Worldwide Learning Consortium Project with the support of international organizations and high schools, universities and corporations across the globe.<br><br>It has been three years since our school was designated by MEXT as one of its hub schools. This year being the final year, we have decided to hold the Shibuya Olympiad in Liberal Arts 2021 as a summary of the program. This is a student-organized international exchange program consisting of several events, such as competitions, workshops, and presentations. The theme is "SDGs and the future we build." An international event of this scale run by and for high school students is yet to be seen and a commemorative event unlike any other in the world. <br><br>See the World Wide Learning Consortium Project Report: <br><br><a class="links" target="_blank" href="https://www.shibushibu.jp/wp-content/uploads/2021/04/2020wwl_kenkyukaihatsuhokokusho.pdf">https://www.shibushibu.jp/wp-content/uploads/2021/04/2020wwl_kenkyukaihatsuhokokusho.pdf</a>`],
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