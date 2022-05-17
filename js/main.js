$('#scrollTop').on('click', function() {
    $('html, body').animate({ scrollTop: 0 });
});
let langIsEn = true;
$(window).on('load', function() {
    if (location.href.indexOf('lang=jp') >= 0) {
        langIsEn = false;
    } else {
        langIsEn = true;
    }
    if (location.href.indexOf('?eventId=') < 0) {
        // ホーム画面

        // 初期表示
        showEventList(event_data);

        //検索リダイレクト
        search_redirect();

        //検索トリガー
        $(document).keydown(function(e) {
            check_searchbox();
            if (e.keyCode == 13) {
                let _text = $('.event_search_input').val();
                searchTag(_text);
            }
        });
        $('.event_search_input').on('change', function() {
            check_searchbox();
        });

        $('.whats_sola_button').on('click', function() {
            $('html, body').animate({ scrollTop: $('.whatsSolaSection').offset().top - 150 });
        });

    } else {
        // イベント詳細画面

        //EventIdの確認
        checkEventId();
    }
});

//　URLに検索ワードが入っている時
function search_redirect() {
    let _url = location.href;
    let startQ = _url.indexOf('?q=');
    if (startQ >= 0) {
        let split_text = _url.split('');
        let search_text = '';
        for (let i = startQ + 3; i < split_text.length; i++) {
            if (split_text[i] == '?') {
                break;
            } else {
                search_text += split_text[i];
            }
        }
        $('html, body').scrollTop($('.event_section').offset().top - 150);
        $('.event_search_input').val(decodeURI(search_text));
        check_searchbox();
    }
}


// 検索ボックス変更時の更新
function check_searchbox() {
    let search_text = $('.event_search_input').val().toLowerCase().replace('#', '＃');
    let showing_data = [];
    for (let index = 0; index < event_data.length; index++) {
        if (event_data[index]["title"].toLowerCase().indexOf(search_text) >= 0) {
            //タイトルの検索
            showing_data.push(event_data[index]);

        } else {
            for (let i = 0; i < event_data[index]["tags"].length; i++) {
                //　タグの検索  
                if (('＃' + event_data[index]["tags"][i]).toLocaleLowerCase().indexOf(search_text) >= 0 || ('＃' + event_data[index]["tagsEn"][i]).toLocaleLowerCase().indexOf(search_text) >= 0) {
                    //タイトルの検索
                    showing_data.push(event_data[index]);
                }
            }
        }
    }
    showEventList(showing_data);
}

//タグクリック時の検索
function searchTag(num) {
    let _url = location.href;
    let startQ = _url.indexOf('?q=');
    let langSetting = '';
    if (langIsEn) {
        langSetting = '?lang=en';
    } else {
        langSetting = '?lang=jp';
    }
    if (startQ >= 0) {
        let split_text = _url.split('');
        let next_url = '';
        for (let i = 0; i < startQ; i++) {
            next_url += split_text[i];
        }
        next_url = next_url.replace('?lang=en', '').replace('?lang=jp', '');
        if (num != '') {
            location.href = next_url + '?q=' + num.toLowerCase() + langSetting;
        } else {
            location.href = next_url + langSetting;
        }
    } else {
        _url = _url.replace('?lang=en', '').replace('?lang=jp', '');
        if (num != '') {
            location.href = _url + '?q=' + num.toLowerCase() + langSetting;
        } else {
            location.href = _url + langSetting;
        }
    }
}
//タグクリック時の検索（１個前に戻る）
function searchBackTag(num) {
    let _url = location.href;
    let startQ = _url.indexOf('?');
    if (startQ >= 0) {
        let split_text = _url.split('');
        let next_url = '';
        for (let i = 0; i < startQ; i++) {
            next_url += split_text[i];
        }
        location.href = next_url.replace('event/', '') + '?q=' + num.toLowerCase();
    } else {
        location.href = _url.replace('event/', '') + '?q=' + num.toLowerCase();
    }
}


// イベントリストの表示更新
function showEventList(num) {
    let langSetting = '';
    if (langIsEn) {
        langSetting = '?lang=en';
    } else {
        langSetting = '?lang=jp';
    }

    if (num.length == 0) {
        $('.event_body').html('<p class="no_result_text">検索に該当するイベントはありません。</p>');
    } else {
        let add_html = '';

        for (let index = 0; index < num.length; index++) {
            let _viewDetails = '詳細を見る';
            let _title = num[index]["title"];
            let _tags = num[index]["tags"];
            if (langIsEn) {
                _viewDetails = 'Details';
                _title = num[index]["titleEn"];
                _tags = num[index]["tagsEn"];
            }
            let tags_html = '';
            for (let i = 0; i < 2; i++) {
                tags_html += ` 
                <div class="tag_div" onclick='searchTag("＃` + _tags[i] + `")'>
                    <p class="tag_text">
                        ＃` + _tags[i] + `
                    </p>
                </div>
             `;
            }
            add_html += `<div class="event_div">
        <hr class="event_hr">
        <div class="inner">
            <div class="text_tab">
                <p>
                   ` + _title + `
                </p>
            </div>
            <div class="tag_tab">
            ` + tags_html + `
            </div>
            <a href="event/index.html` + langSetting + `?eventId=` + num[index]["id"] + `">
                <div class="details_tab">
                    <p class="details_text">` + _viewDetails + `</p>
                    <img src="img/arrow_gray.svg" class="arrow_img">
                </div>
            </a>
        </div>
    </div>
        `;
        }
        $('.event_body').html(add_html);
    }
}

// EventIdの確認
function checkEventId() {
    let _url = location.href;
    let startId = _url.indexOf('?eventId=');
    if (startId >= 0) {
        let split_text = _url.split('');
        let id = '';
        for (let i = startId + 9; i < split_text.length; i++) {
            if (split_text[i] == '?') {
                break;
            } else {
                id += split_text[i];
            }
        }
        for (let index = 0; index < event_data.length; index++) {
            if (event_data[index]["id"] == id) {
                showEventDetails(index);
            }
        }
    }
}

//イベントの表示
function showEventDetails(index) {
    $('.application_button').attr('href', '../applications/' + event_data[index]["id"] + '.pdf')
    $('.poster_button').attr('href', '../posters/' + event_data[index]["id"] + '.pdf')
    if (!langIsEn) {
        $('.event_title').text(event_data[index]["title"]);
        $('.event_disc').html(event_data[index]["disc"]);
        $('.participation_right').html(event_data[index]["participationRight"]);
        let tags_html = '';
        for (let i = 0; i < event_data[index]["tags"].length; i++) {
            tags_html += ` 
                <div class="tag_div" onclick='searchBackTag("＃` + event_data[index]["tags"][i] + `")'>
                    <p class="tag_text">
                        ＃` + event_data[index]["tags"][i] + `
                    </p>
                </div>
             `;
        }
        $('.tags_list').html(tags_html);
    } else {

        $('.event_title').text(event_data[index]["titleEn"]);
        $('.event_disc').html(event_data[index]["discEn"]);
        $('.participation_right').html(event_data[index]["participationRightEn"]);
        let tags_html = '';
        for (let i = 0; i < event_data[index]["tagsEn"].length; i++) {
            tags_html += ` 
                <div class="tag_div" onclick='searchBackTag("＃` + event_data[index]["tagsEn"][i] + `")'>
                    <p class="tag_text">
                        ＃` + event_data[index]["tagsEn"][i] + `
                    </p>
                </div>
             `;
        }
        $('.tags_list').html(tags_html);

    }
}

const event_data = [{
        "id": "GOC02G",
        "title": "模擬国連SOLA国際会議",
        "tags": ["国際", "会議", "模擬国連", "中学生", "高校生", ],
        "disc": `ペアごとに１か国を代表して参加する国際会議。議題を「食糧安全保障問題」とし、実際の国連の話し合いのように他国の大使と交渉しながら最終的には全ての国が合意できる決議案採択を目指します。<br><br>SOLA2022でも重要なSDGs（持続可能な開発目標）の目標２である「飢餓をゼロに」と深く関係している食料安全保障の問題。日常でもよく聞く「フードロス」「世界人口の増加」などの言葉と関連のある国際問題です。<br>模擬国連活動は世界各国の学校で行われています。今会議はオンライン開催であるため、皆さんにとって世界各地の生徒と交流する貴重な機会になります！背景の異なる、同世代の学生と一緒にディスカッションを繰り広げてみませんか？<br>模擬国連経験者でなくても、世界の生徒たちと話し合いたい方はぜひ参加してください！「誰も取り残さない会議」を目指して、フロントメンバーがサポートをいたします。積極的なご応募、お待ちしております！`,
        "participationRightEn": `(1)中学生または高校生であること<br>(2)英語での議論に参加できること`,
        "titleEn": `Model UN SOLA International Conference`,
        "discEn": `In the Model United Nations SOLA International Conference, each pair will form a team and participate as the delegation of one country. The agenda item for this conference is "food security issues" and through negotiations with delegates of other countries, you will work towards a mutual goal: a resolution that all countries can agree on.<br><br>Food security issues are deeply related to "Zero hunger," Goal 2 out of the SDGs (Sustainable Development Goals). It is an international issue related to other issues like food loss and the rapid increase in the world population. For many people around the world, it is not easy to have access to meals throughout the day.<br>Since MUN is conducted in a number of schools around the world, this conference will be a valuable opportunity for you to interact with students of the same generation, yet from different backgrounds. Even if you have never tried Model United Nations, please don’t be afraid to challenge this!! Aiming to realize our goal of leaving no one behind, the organization committee will support you. We are looking forward to seeing you soon!`,
        "participationRightEn": `(1)Currently attending junior or senior high school (2) Can participate in discussions in English`,
        "tagsEn": ["International", "Conference", "Model United Nations", "Juniors", "High School", ],
    },
    {
        "id": "DOC03N",
        "title": "模擬国連SOLA国内会議",
        "tags": ["国内", "会議", "模擬国連", "中学生", "高校生", ],
        "disc": `ペアごとに1ヶ国を代表して参加する国際会議。議題を「食糧安全保障問題」とし、実際の国連の話し合いのように他国の大使と交渉しながら最終的には全ての国が合意できる決議案採択を目指します。<br><br>SOLA2022でも重要なSDGs（持続可能な開発目標）の目標２である「飢餓をゼロに」と深く関係している食料安全保障の問題。日常でもよく聞く「フードロス」「世界人口の増加」などの言葉と関連のある国際問題です。<br>日本に住んでいると朝昼晩、食事があることが当たり前になっているかもしれません。<br>一国の大使として新しい視点から食料安全保障の問題を見つめ直してみましょう！<br>近年、全国の模擬国連人口は増加しています。今会議はオンライン開催であるため、皆さんにとって全国各地の中高生と交流する貴重な機会になります。同世代の学生と一緒に熱いディスカッションを繰り広げてみませんか？<br>模擬国連経験者でなくても、国連やSDGsに興味がある、同世代との交流の場を探している方はぜひ参加してください!`,
        "participationRight": `(1)中学生または高校生であること<br>(2)当日に2人または3人で会議に参加できること`,
        "titleEn": "模擬国連SOLA国内会議",
        "discEn": `ペアごとに1ヶ国を代表して参加する国際会議。議題を「食糧安全保障問題」とし、実際の国連の話し合いのように他国の大使と交渉しながら最終的には全ての国が合意できる決議案採択を目指します。<br><br>SOLA2022でも重要なSDGs（持続可能な開発目標）の目標２である「飢餓をゼロに」と深く関係している食料安全保障の問題。日常でもよく聞く「フードロス」「世界人口の増加」などの言葉と関連のある国際問題です。<br>日本に住んでいると朝昼晩、食事があることが当たり前になっているかもしれません。<br>一国の大使として新しい視点から食料安全保障の問題を見つめ直してみましょう！<br>近年、全国の模擬国連人口は増加しています。今会議はオンライン開催であるため、皆さんにとって全国各地の中高生と交流する貴重な機会になります。同世代の学生と一緒に熱いディスカッションを繰り広げてみませんか？<br>模擬国連経験者でなくても、国連やSDGsに興味がある、同世代との交流の場を探している方はぜひ参加してください!`,
        "participationRightEn": `(1)中学生または高校生であること<br>(2)当日に2人または3人で会議に参加できること`,
        "tagsEn": ["National", "Conference", "Model United Nations", "Juniors", "High School", ],
    },
    {
        "id": "GOC14G",
        "title": "模擬G7サミット",
        "tags": ["国際", "会議", "MG7", "中学生", "高校生", ],
        "disc": `議題を「環境についての教育不足の中、中高生が提示する解決策とは何か」とし、具体的には、環境についての教育が行われていないために持続的な活動が行われないことを問題として提示する。誰もが自覚を持って環境問題に取り組む社会を作るために、教育や学校においてどのような工夫ができるのか。また、中高生である自分たちが、問題解決に向けてどのようなアクションを起こせるのかを考える。 <br>様々なバックグラウンドから来る世界の生徒が同じ社会問題に対して向き合い、具体的な解決案を共有することで、１人１人の生徒がイベント後、自らの学校やコミュニティーで早速アクションをとれるよう にするためのイベント。現実的に実行できるような「環境という科目の導入」実現に向け、具体的で独創的な アクションプランを国際的な参加者と共に議論を通して作成し、発表する。<br>会議の流れ <br>当日は、最初に全体で基調講演や運営のプレゼンテーションを通し、環境教育について現状の問題点を把握し、知識をインプットする。その後運営が振り分けるグループで、課題解決の方法を高校生の独創的な視点からディスカッションをする（参加者の希望により日本語または英語で議論します）。最後に議論の成果を全体に向けて英語で発表する。 内容がしっかりと詰められた提案や、独創的なアイデアを出したグループには、ゲストジャッジによる厳正な審査のもと賞が授与される。 また、後日参加者全員で再度集まり、本会議MG7での学びを踏まえ自分たちのコミュニティーでどのような行動や変化をおこせたのかについて、報告と共有の場も設ける予定である。 `,
        "participationRight": `(1)中高生または高校生であること<br>(2)各校参加上限なし`,
        "titleEn": `Model G7 Summit 2022`,
        "discEn": `The focus will be on environmental education around the world. Students all over the world will discuss what kind of environmental education in primary, middle, and high school can effectively spread awareness and encourage students to take action against climate change. Students will consider what kind of knowledge society is currently lacking and what kind of classes are necessary to fill in the gap.<br><br>At the summit, after learning about the current situation through presentations and keynote speeches, students will separate into groups and discuss a specific action plan that can be taken in order to solve the issue. Afterwards, everyone will rejoin to give and hear presentations of each group’s ideas. Groups that gave the most creative or specific action plan will be awarded, after careful consideration by the guest judges. <br><br>Through students from diverse backgrounds coming together and working towards the common goal of solving climate change through education, we hope that each student will be able to take the ideas back to their own schools and communities in order to take specific action. <br>`,
        "participationRightEn": `(1) Currently attending junior or senior high school<br>(2) No limits to the number of students per school`,
        "tagsEn": ["International", "Conference", "MG7", "Juniors", "High School", ],
    },
    {
        "id": "DFN06N",
        "title": "2050の日本を描く",
        "tags": ["国内", "会議", "中学生", "高校生", ],
        "disc": `「2050の日本」をテーマとする、準備型と即興型を組み合わせた新しい形のディベート企画。それを足がかりに一歩踏み込み、議論を深めた会議をします。`,
        "participationRight": `(1)中学生または高校生であること<br>(2)SOLA2022当日(8/22)に渋谷教育学園渋谷に来校すること<br>(3)各校につき数人のチームを組み、事前に与えられた論題に対しディベートの準備を行うこと`,
        "titleEn": `2050の日本を描く`,
        "discEn": `「2050の日本」をテーマとする、準備型と即興型を組み合わせた新しい形のディベート企画。それを足がかりに一歩踏み込み、議論を深めた会議をします。`,
        "participationRightEn": `(1)中学生または高校生であること<br>(2)SOLA2022当日(8/22)に渋谷教育学園渋谷に来校すること<br>(3)各校につき数人のチームを組み、事前に与えられた論題に対しディベートの準備を行うこと`,
        "participationRightEn": ``,
        "tagsEn": ["National", "Conference", "Juniors", "High School", ],
    },
    {
        "id": "DON07N",
        "title": "アパレル×環境~繊維の隙間から見る環境問題~",
        "tags": ["国内", "会議", "環境", "中学生", "高校生", ],
        "disc": `環境×アパレル~繊維の隙間から見る環境問題~<br>日程:8/18<br>時間:10:00~16:00<br>言語:日本語<br>定員:50名程度<br><br>アパレルの最先端を行きながら、環境問題にも深く関わっている大手アウトドアアパレルブランドの方をお招きし、現場の声を聞きながら、参加者の皆さんと共に環境とアパレルの関わりについてディスカッションしていきます。<br><br>環境×アパレルとは？<br>　本イベントでは、環境問題に関するテーマについて話し合うことを目的としています。環境問題に関して興味関心のある方や、学生団体等のコミュニティを作りたい方など、是非参加していただきたいです。皆さんと一丸となり、解決策を練っていけることを楽しみにしています。`,
        "participationRight": `(1)中学生または高校生であること`,
        "titleEn": `アパレル×環境~繊維の隙間から見る環境問題~`,
        "discEn": `環境×アパレル~繊維の隙間から見る環境問題~<br>日程:8/18<br>時間:10:00~16:00<br>言語:日本語<br>定員:50名程度<br><br>アパレルの最先端を行きながら、環境問題にも深く関わっている大手アウトドアアパレルブランドの方をお招きし、現場の声を聞きながら、参加者の皆さんと共に環境とアパレルの関わりについてディスカッションしていきます。<br><br>環境×アパレルとは？<br>　本イベントでは、環境問題に関するテーマについて話し合うことを目的としています。環境問題に関して興味関心のある方や、学生団体等のコミュニティを作りたい方など、是非参加していただきたいです。皆さんと一丸となり、解決策を練っていけることを楽しみにしています。`,
        "participationRightEn": `(1)中学生または高校生であること`,
        "tagsEn": ["National", "Conference", "Environment", "Juniors", "High School", ],
    },
    {
        "id": "DOC08N",
        "title": "中学生SDGs Actions Not Words 2022",
        "tags": ["国内", "会議", "中学生", ],
        "disc": `中学生がSDGsのために「実践した(/実践している)」アクションを報告し合い、共有する会議。<br><br>　世界の問題に目を向けよう、環境問題について考えよう。これまでたくさん耳にした言葉だと思います。若い世代が真剣に考えるという事は、あなたにとってだけでなく、世界にとっても重要です。では、世界は「考えること」で変わるでしょうか。あなたの心は変わるかもしれません、しかし世界は「実行すること」でしか変えられません。<br>　この企画では、SDGs(Sustainable Development Goals: 持続可能な開発目標)に関わる事で小さくても「実践」を行っている中学生をオンライン上に集め、実践内容を報告しあってもらいます。さらにその後、チームごとに分けて与えられた1つのお題に関してディスカッションをし、考えたことをそれぞれ発表してもらいます。<br><br>　実践することは、簡単ではありません。実際に「SDGsは大切だ」と感じていても、実行に移している人は多くないでしょう。だからこそ、自分の頭で考えて行動した中学生の活動報告や仲間と協力して考えるということは、同じ志を持つ同世代だけでなく、もっと広い世界にまで勇気を伝えることができます。「発信すること」や「協力すること」も「実行すること」の一つの形で、世界を変える手段の一つだからです。<br>　是非、皆さんが真剣に考えて実践したことを教えてください。そして、多くの仲間に出会い、一緒に歩みを進めて行きましょう。`,
        "participationRight": `(1)日本国内の中学生、又は国外の日本人学校等に通っている中学生であること<br>(2)SDGsに関するアクションを起こしていること`,
        "titleEn": "中学生SDGs Actions Not Words 2022",
        "discEn": `中学生がSDGsのために「実践した(/実践している)」アクションを報告し合い、共有する会議。<br><br>　世界の問題に目を向けよう、環境問題について考えよう。これまでたくさん耳にした言葉だと思います。若い世代が真剣に考えるという事は、あなたにとってだけでなく、世界にとっても重要です。では、世界は「考えること」で変わるでしょうか。あなたの心は変わるかもしれません、しかし世界は「実行すること」でしか変えられません。<br>　この企画では、SDGs(Sustainable Development Goals: 持続可能な開発目標)に関わる事で小さくても「実践」を行っている中学生をオンライン上に集め、実践内容を報告しあってもらいます。さらにその後、チームごとに分けて与えられた1つのお題に関してディスカッションをし、考えたことをそれぞれ発表してもらいます。<br><br>　実践することは、簡単ではありません。実際に「SDGsは大切だ」と感じていても、実行に移している人は多くないでしょう。だからこそ、自分の頭で考えて行動した中学生の活動報告や仲間と協力して考えるということは、同じ志を持つ同世代だけでなく、もっと広い世界にまで勇気を伝えることができます。「発信すること」や「協力すること」も「実行すること」の一つの形で、世界を変える手段の一つだからです。<br>　是非、皆さんが真剣に考えて実践したことを教えてください。そして、多くの仲間に出会い、一緒に歩みを進めて行きましょう。`,
        "participationRightEn": `(1)日本国内の中学生、又は国外の日本人学校等に通っている中学生であること<br>(2)SDGsに関するアクションを起こしていること`,
        "tagsEn": ["National", "Conference", "Juniors", ],
    },
    {
        "id": "DON09N",
        "title": "1億総SDGs",
        "tags": ["国内", "会議", "中学生", "高校生", ],
        "disc": `　僕たちのような中高生は学校などで教わることができるSDGsですが、大人たちにはそのような機会がほとんどありません。そのためSDGsと言われた時に名前は知ってるけど内容が全然分からないという大人が多いというのが社会の現状です。<br><br>　そこでより多くの大人達にSDGsを名前だけでなく、それがどういうものなのか理解を深めてもらうにはどうしたらよいのかに関して、グループディスカッションを行います。<br><br>　このディスカッションには個人で応募していただき、事前に運営側でグループに分け、当日はそのグループ内でディスカッションを行います。<br><br>　そこで出た案は全体で発表して、互いに気づいた点をコメントしあうことで企画をより良いものとする時間も設ける予定です。<br><br>　最終的な結論はグループごとにSDGs活動を行っている団体に提出します。<br><br>　この企画は事前の準備は必要はありません。どうしたら大人も含めた多くの人にSDGsについてもっと知ってもらえるだろうと思っている人もそうでない人も、ぜひ気軽に応募してみてください!!!!!!!<br><br>（※注意）この企画はSDGsの発信方法を考える企画で、SDGsの内容については議論しません。`,
        "participationRight": ``,
        "titleEn": `1億総SDGs`,
        "discEn": `　僕たちのような中高生は学校などで教わることができるSDGsですが、大人たちにはそのような機会がほとんどありません。そのためSDGsと言われた時に名前は知ってるけど内容が全然分からないという大人が多いというのが社会の現状です。<br><br>　そこでより多くの大人達にSDGsを名前だけでなく、それがどういうものなのか理解を深めてもらうにはどうしたらよいのかに関して、グループディスカッションを行います。<br><br>　このディスカッションには個人で応募していただき、事前に運営側でグループに分け、当日はそのグループ内でディスカッションを行います。<br><br>　そこで出た案は全体で発表して、互いに気づいた点をコメントしあうことで企画をより良いものとする時間も設ける予定です。<br><br>　最終的な結論はグループごとにSDGs活動を行っている団体に提出します。<br><br>　この企画は事前の準備は必要はありません。どうしたら大人も含めた多くの人にSDGsについてもっと知ってもらえるだろうと思っている人もそうでない人も、ぜひ気軽に応募してみてください!!!!!!!<br><br>（※注意）この企画はSDGsの発信方法を考える企画で、SDGsの内容については議論しません。`,
        "participationRightEn": ``,
        "tagsEn": ["National", "Conference", "Juniors", "High School", ],
    },
    {
        "id": "DOC10N",
        "title": "中高生 地球温暖化サミット",
        "tags": ["国内", "会議", "環境", "中学生", "高校生", ],
        "disc": `午前の部の半分ほどで気候変動についての発表を事前に選ばれた数校で行います。午前の部後半から午後の始まりまでは去年「中高生地球温暖化サミット」の前身となった「気候正義について考えよう」というsolaの種目から誕生し、第5回日経ソーシャルビジネスコンテストで大賞を取ったアプリ「かけいぼぐらし」のプロモーションを行います。そして午後の部からは地球温暖化についてのディスカッションをズームを使ってグループに分かれて学校関係なくやります。そしてその後ディスカッションした内容をまとめ、提言を作ります。人数は多ければ多いほどいいのでどんどん来てください。皆さんのご応募お待ちしています！`,
        "participationRight": `(1)中学生または高校生であること<br>(2)1校で複数の班が参加可能<br>　※但し、調整させて頂くことがあります。`,
        "titleEn": `中高生 地球温暖化サミット`,
        "discEn": `午前の部の半分ほどで気候変動についての発表を事前に選ばれた数校で行います。午前の部後半から午後の始まりまでは去年「中高生地球温暖化サミット」の前身となった「気候正義について考えよう」というsolaの種目から誕生し、第5回日経ソーシャルビジネスコンテストで大賞を取ったアプリ「かけいぼぐらし」のプロモーションを行います。そして午後の部からは地球温暖化についてのディスカッションをズームを使ってグループに分かれて学校関係なくやります。そしてその後ディスカッションした内容をまとめ、提言を作ります。人数は多ければ多いほどいいのでどんどん来てください。皆さんのご応募お待ちしています！`,
        "participationRightEn": `(1)中学生または高校生であること<br>(2)1校で複数の班が参加可能<br>　※但し、調整させて頂くことがあります。`,
        "tagsEn": ["National", "Conference", "Environment", "Juniors", "High School", ],
    },
    {
        "id": "DON16N",
        "title": "地域に縛られない平等な教育を目指そう",
        "tags": ["国内", "会議", "教育", "中学生", "高校生", ],
        "disc": "全国の中高生が連携して、地方ごとの教育の特色、問題意識を共有。解決策をディスカッションし、外部への提言を作成する企画です。<br><br>『TOEICやTOEFLなど、英語の外部試験は県内で受けられるものが少なく、県をまたぎ会場に行かなければならない。』<br>『自治体の財政力の差から、公共教育施設数の差が大きい。』<br>『都会の人たちがボランティア活動や模擬国連への参加、海外経験をしているなか、青森の高校生たちは同い年の子がそんな活動をしていることすら知らなかった。』<br>「予備校、大学が少ない。 学校、塾の先生が少なく、専門外の授業を担当する先生も。」<br><br>これらは、私達が岩手県や秋田県で学ぶ中高生に行ったアンケートや、論文や記事等の事前調査から得られた声です。<br>地方に生まれたということだけで、都心部の人たちと教育、自身のスキルアップにつながる機会に差が大きく生じてしまう。この日本には、そんな問題が確かに存在します。<br>実際、地方出身の運営メンバー二人は東京に来て、地方との教育のギャップを身をもって感じることがありました。<br>このイベントは、そんな運営メンバーの実体験に基づく想いから発案されたものです。<br>大泉　孝誠(発案者)<br>「久しぶりに話した地元の友達が学校の不満をこぼすのを聞いて、この問題に関心を抱き、早急に改善されるべきと強く感じました。しかし、ただ関心を持つだけでは何も変わりません。当事者である僕達中高生が主体的にこの問題に向き合い、有効な解決策を考案することこそが、この問題を解決する第一歩となるでしょう。｣ <br><br>本企画は、様々な地域の同世代と地域によって異なる教育の現状と問題点を共有し、実際に解決案をディスカッション、最終的には運営メンバーの手で実行することが目的です。地域の垣根を超えて、学生が平等な教育に働きかけることは類を見ない活動です。<br>地方の原石が埋もれてしまう、これは日本の大きな損失です。全国の中高生と協力して、この問題に一石を投じてみませんか。",
        "participationRight": `(1) 日本の中高生であること`,
        "titleEn": `地域に縛られない平等な教育を目指そう`,
        "discEn": "全国の中高生が連携して、地方ごとの教育の特色、問題意識を共有。解決策をディスカッションし、外部への提言を作成する企画です。<br><br>『TOEICやTOEFLなど、英語の外部試験は県内で受けられるものが少なく、県をまたぎ会場に行かなければならない。』<br>『自治体の財政力の差から、公共教育施設数の差が大きい。』<br>『都会の人たちがボランティア活動や模擬国連への参加、海外経験をしているなか、青森の高校生たちは同い年の子がそんな活動をしていることすら知らなかった。』<br>「予備校、大学が少ない。 学校、塾の先生が少なく、専門外の授業を担当する先生も。」<br><br>これらは、私達が岩手県や秋田県で学ぶ中高生に行ったアンケートや、論文や記事等の事前調査から得られた声です。<br>地方に生まれたということだけで、都心部の人たちと教育、自身のスキルアップにつながる機会に差が大きく生じてしまう。この日本には、そんな問題が確かに存在します。<br>実際、地方出身の運営メンバー二人は東京に来て、地方との教育のギャップを身をもって感じることがありました。<br>このイベントは、そんな運営メンバーの実体験に基づく想いから発案されたものです。<br>大泉　孝誠(発案者)<br>「久しぶりに話した地元の友達が学校の不満をこぼすのを聞いて、この問題に関心を抱き、早急に改善されるべきと強く感じました。しかし、ただ関心を持つだけでは何も変わりません。当事者である僕達中高生が主体的にこの問題に向き合い、有効な解決策を考案することこそが、この問題を解決する第一歩となるでしょう。｣ <br><br>本企画は、様々な地域の同世代と地域によって異なる教育の現状と問題点を共有し、実際に解決案をディスカッション、最終的には運営メンバーの手で実行することが目的です。地域の垣根を超えて、学生が平等な教育に働きかけることは類を見ない活動です。<br>地方の原石が埋もれてしまう、これは日本の大きな損失です。全国の中高生と協力して、この問題に一石を投じてみませんか。",
        "participationRightEn": `(1) 日本の中高生であること`,
        "tagsEn": ["National", "Conference", "Education", "Juniors", "High School", ],
    },
    {
        "id": "DOC04N",
        "title": "ビブリオバトル全国大会2022",
        "tags": ["国内", "競技", "図書", "ビブリオバトル", "中学生", "高校生", ],
        "disc": `　ビブリオバトルは日本発祥の書評合戦です。バトラーはそれぞれの“推し本”を1冊持ち寄り、順番に紹介していきます。一通り発表が終わったら、観客と参加者は「1番読みたくなった本」に投票し、チャンプ本を決めます。<br>　去年のSOLAでは、魅力的な本とバトラー達のプレゼンによって白熱したバトルが行われました。そして今回2回目のビブリオバトルを開催します！今回も前回と同様、「本を読む」という点からSDGsを多角的に捉えるということ、そしてビブリオバトルの魅力をSOLAの場をかりて世界に発信していきたいです。<br>　ビブリオバトルの魅力はなんと言っても、普段読まないような本と出会えること。インターネットや図書館、本屋に行っても興味のない題材に挑戦するのは案外難しいものです。<br>　ビブリオバトルはあなたとは違う「好み」を色々な人達が持ち寄る場でもあります。<br>　バトラーでなくともたくさんの方々にこのビブリオバトルに立ち寄って頂きたいです。<br>　渋谷の地を飛び出し、素晴らしいたくさんの本に皆さんが出会えれば幸いです。`,
        "participationRight": `(1)中学生または高校生であること<br>(2)各校1人まで応募できます`,
        "titleEn": `ビブリオバトル全国大会2022`,
        "discEn": ` “Bibliobattle” is a book evaluation match that originated in Japan. Battlers bring their own "Fave Book" and introduce them in turn. When the presentations are finished, the audience and the competitors vote for the book that caught their attention the most and decide on the "Champion Book". In last year's SOLA, a lively match was held with fascinating books and presentations, and we would be holding a bibliobattle this year too! We would be exploring the many sides of SDGs through reading, in addition to spreading the fascination of this event. Bibliobattle also introduces you to the joy of encountering new books. It's pretty challenging to step into new genres, even on the Internet, library, or book stores. This is a place where
        many people bring forth their own interests and passions. Even if you're not a battler, please be welcome to join. We hope that everyone could come across great books beyond the city of Shibuya.`,
        "participationRightEn": `(1)Currently attending junior or senior high school<br>(2)Only one person per school may apply `,
        "tagsEn": ["National", "Competition", "Books", "Bibliobattle", "Juniors", "High School", ],
    },
    {
        "id": "GOC05G",
        "title": "ビブリオバトル国際大会",
        "tags": ["国際", "競技", "図書", "ビブリオバトル", "中学生", "高校生", ],
        "disc": `　ビブリオバトルは日本発祥の書評合戦です。バトラーはそれぞれの“推し本”を1冊持ち寄り、順番に紹介していきます。一通り発表が終わったら、観客と参加者は「1番読みたくなった本」に投票し、チャンプ本を決めます。<br>　去年のSOLAでは、魅力的な本とバトラー達のプレゼンによって白熱したバトルが行われました。そして今回2回目のビブリオバトルを開催します！今回も前回と同様、「本を読む」という点からSDGsを多角的に捉えるということ、そしてビブリオバトルの魅力をSOLAの場をかりて世界に発信していきたいです。<br>　ビブリオバトルの魅力はなんと言っても、普段読まないような本と出会えること。インターネットや図書館、本屋に行っても興味のない題材に挑戦するのは案外難しいものです。<br>　ビブリオバトルはあなたとは違う「好み」を色々な人達が持ち寄る場でもあります。<br>　バトラーでなくともたくさんの方々にこのビブリオバトルに立ち寄って頂きたいです。<br>　渋谷の地を飛び出し、素晴らしいたくさんの本に皆さんが出会えれば幸いです。`,
        "participationRight": `(1)中学生または高校生であること<br>(2)各校1人まで応募できます`,
        "titleEn": `SOLA International Bibliobattle Tournament 2022`,
        "discEn": `“Bibliobattle” is a book evaluation match that originated in Japan. Battlers bring their own "Fave Book" and introduce them in turn. When the presentations are finished, the audience and the competitors vote for the book that caught their attention the most and decide on the "Champion Book". In last year's SOLA, a lively match was held with fascinating books and presentations, and we would be holding a bibliobattle this year too! We would be exploring the many sides of SDGs through reading, in addition to spreading the fascination of this event. Bibliobattle also introduces you to the joy of encountering new books. It's pretty challenging to step into new genres, even on the Internet, library, or book stores. This is a place where
        many people bring forth their own interests and passions. Even if you're not a battler, please be welcome to join. We hope that everyone could come across great books beyond the city of Shibuya.`,
        "participationRightEn": `(1)Currently attending junior or senior high school<br>(2) Only one person per school may apply`,
        "tagsEn": ["International", "Competition", "Books", "Bibliobattle", "Juniors", "High School", ],
    },
    {
        "id": "GOC13G",
        "title": "数マラソン2022、Mathalon2022",
        "tags": ["国際", "競技", "数学", "中学生", "高校生", ],
        "disc": `難易度、分野の様々な42問の数学の問題を参加者が解き競争することで、より多くの人に数学を好きになってもらおうという企画です。この企画は全5部構成で、それぞれの部における出題分野は以下のスケジュールに記載してあります。このうち、2部と5部は2～4の小グループに分かれて早押し制で行い、1,3,4部は全員で一斉に制限時間を定めて解き正誤で採点します。また、各問題の点数の内訳は、早押し問題が1問につき1点、その他の問題は1問につき2点とします。<br><br>　昨年度のSOLAにおいて学びの「オリンピック」ということで、42.195km走るフルマラソンにちなみ、42問の数学の問題を解くこの企画が企画されました。昨年度も世界中の様々な国から参加者が集まり、盛り上がったこの企画、参加してみませんか？世界中の中高生と数学で競いあえるこの企画で、この夏、数学を思い切り楽しみましょう！挑戦お待ちしています！`,
        "participationRight": `(1)現在、中学生または高校生であること`,
        "titleEn": "Mathalon: Marathon of 42 Math Questions",
        "discEn": `Participants will compete with each other through solving 42 math questions in various topics and difficulties. This tournament is divided into 5 rounds, and each round will consist of different topics and rules. Rounds 2 and 5 will be a fast-paced buzzer competition where participants compete with their peers in 2 to 4 small groups. Rounds 1, 3, and 4 will be a competition where participants answer a number of questions within a limited amount of time. Participants will receive points based on how many questions they answer correctly. Each correct answer in rounds 2 and 5 will be 1 point, and each correct answer in rounds 1, 3, and 4 will be 2 points. The participant with the highest score will be the champion.<br><br>This competition was first held in SOLA2021. The competition consists of 42 questions, which we took from the length of an Olympic marathon: 42.195 kilometers. This event is open to anyone who wants to test their math skills and take part in a fun challenge. Last year, many participants from countries around the world joined this event, and it was a very enjoyable competition. Participate in this math tournament with highschool students from around the world and enjoy a summer of math! We are waiting for your participation!<br>`,
        "participationRightEn": `(1)Currently attending junior high or senior high school`,
        "tagsEn": ["International", "Competition", "Math", "Juniors", "High School", ],
    },
    {
        "id": "DON11J",
        "title": "SDGs NEXT Project 2022",
        "tags": ["国内", "プレゼン", "高校生", ],
        "disc": `最初は聞き馴染みのなかったSDGsという言葉も、もはやすっかり社会に浸透しました。政府はもちろん、いくつかの企業や学校もSDGsを掲げてさまざまな活動を行なっています。社会が一丸となってこれからの地球を考える新たな時代の幕開けを感じます。<br><br>しかし、ここで少し考えてみてください。SDGsは今から7年前の2015年の9月に国連で採択された目標です。この変化が激しい現代社会において、7年とは決して無視できない長さです。だとすれば、いま私たちが掲げるSDGsとは本当に時代に合ったものでしょうか？何か課題や改善できる点はないのでしょうか？<br><br>本企画では、まずSDGsに関する疑問や課題をディスカッションしてもらい、ではそれらを解決し「より良いSDGs」を作るにはどうすれば良いのかを（18個目のSDGs目標を作るという形で）考えてもらいます。<br><br>SDGsに関心がある方はもちろん、あまりそうではない方もぜひお気軽に参加してみてください！<br>`,
        "participationRight": `(1)日本の高校生であること`,
        "titleEn": `SDGs NEXT Project 2022`,
        "discEn": `最初は聞き馴染みのなかったSDGsという言葉も、もはやすっかり社会に浸透しました。政府はもちろん、いくつかの企業や学校もSDGsを掲げてさまざまな活動を行なっています。社会が一丸となってこれからの地球を考える新たな時代の幕開けを感じます。<br><br>しかし、ここで少し考えてみてください。SDGsは今から7年前の2015年の9月に国連で採択された目標です。この変化が激しい現代社会において、7年とは決して無視できない長さです。だとすれば、いま私たちが掲げるSDGsとは本当に時代に合ったものでしょうか？何か課題や改善できる点はないのでしょうか？<br><br>本企画では、まずSDGsに関する疑問や課題をディスカッションしてもらい、ではそれらを解決し「より良いSDGs」を作るにはどうすれば良いのかを（18個目のSDGs目標を作るという形で）考えてもらいます。<br><br>SDGsに関心がある方はもちろん、あまりそうではない方もぜひお気軽に参加してみてください！<br>`,
        "participationRightEn": `(1)日本の高校生であること`,
        "tagsEn": ["National", "Presentation", "High School", ],
    },
    {
        "id": "DON12W",
        "title": "未来のスマートシティを作ろう〜ロボット×SDGs〜",
        "tags": ["国内", "ワークショップ", "科学", "ロボット", "中学生", "高校生", ],
        "disc": `この企画は《スマートシティ》をテーマに、現代の街に潜む様々な問題を、ロボットを用いて解決する方法を考えよう、というものです。各グループごとに、与えられた、［交通］［公園］［インフラ］などのテーマについて、ロボット製作の知見を活かしながら考えます。普段のロボコンとはまた一味違った視点から、ロボットについて考えることで、ロボット製作にも活かせるアイデアを得ることが出来ます。        `,
        "participationRight": `(1)中学生、高校生であること<br>(2)ロボット製作に取り組んだ経験がある人、団体`,
        "titleEn": "未来のスマートシティを作ろう〜ロボット×SDGs〜",
        "discEn": `この企画は《スマートシティ》をテーマに、現代の街に潜む様々な問題を、ロボットを用いて解決する方法を考えよう、というものです。各グループごとに、与えられた、［交通］［公園］［インフラ］などのテーマについて、ロボット製作の知見を活かしながら考えます。普段のロボコンとはまた一味違った視点から、ロボットについて考えることで、ロボット製作にも活かせるアイデアを得ることが出来ます。        `,
        "participationRightEn": `(1)中学生、高校生であること<br>(2)ロボット製作に取り組んだ経験がある人、団体`,
        "tagsEn": ["National", "Workshop", "Science", "Robot", "Juniors", "High School", ],
    },
    {
        "id": "DOC17W",
        "title": "メンタルヘルスの未来",
        "tags": ["国内", "ワークショップ", "健康", "中学生", "高校生", ],
        "disc": `オンライン上で開催する、メンタルヘルス教育に関するワークショップです。メンタルヘルス教育の現状や問題点、「あまりいえない」という心理的ハードルの解決策などについて話します。<br>ぜひ気軽に参加してください！`,
        "participationRight": `(1) 中高生であること`,
        "titleEn": `メンタルヘルスの未来`,
        "discEn": `オンライン上で開催する、メンタルヘルス教育に関するワークショップです。メンタルヘルス教育の現状や問題点、「あまりいえない」という心理的ハードルの解決策などについて話します。<br>ぜひ気軽に参加してください！`,
        "participationRightEn": `(1) 中高生であること`,
        "tagsEn": ["National", "Workshop", "Health", "Juniors", "High School", ],
    },
    {
        "id": "GON15P",
        "title": "SOLA International Book Talk 2022",
        "tags": ["国際", "プロジェクト", "図書", "中学生", "高校生", ],
        "disc": `私たちは、自国の文学に触れる機会は頻繁ですが、他国の文学に触れる機会は日常であまり頻繁にありません。今回のブックトークでは、世界各国から参加者を募り、その参加者の国の文化が反映された本を紹介し合います。（文化とは基本歴史だが、文化に直結しているものだったらなんでも良い）。また、事前にアイスブレイクや自己紹介などの楽しいアクティビティーもあります。主な目的としては、本についての対話による文化の交流や海外の学生とのコミュニケーションの場を開催することです。なので、ぜひ気軽に参加してください！`,
        "participationRight": `(1) 英語を喋ることのできる<br>(2) 12歳〜18歳の人`,
        "titleEn": `SOLA International Book Talk 2022`,
        "discEn": `Although we often read literature from our own country, it's not often that we get to read literature from countries abroad. In this book talk, we will invite people from all around the world in which they will be able to share their country's book that reflects the culture that they have been brought up from (culture mostly refers to history, art, but anything else is possible as well).  In addition, in order to make sure that everyone would be comfortable in the book talk, we will include small activities such as ice breaks, brief introductions, and so on. The main goal of this project is cultural exchange through sharing books and to create a space in which young adolescents with different backgrounds can interact with each other. Please feel free to join and have fun with us! `,
        "participationRightEn": `(1) People who are 12~18 years old who can speak English on a moderate level `,
        "tagsEn": ["International", "Project", "Books", "Juniors", "High School", ],
    },

    // {
    //     "id": "DOC18Q",
    //     "title": "中学生クイズ",
    //     "tags": ["国内", "サミット"],
    //     "disc": ``,
    //     "participationRight": ``,
    //     "titleEn": `中学生クイズ`,
    //     "discEn": ``,
    //     "participationRightEn": ``,
    //     "tagsEn": [],
    // },
    {
        "id": "GOC01G",
        "title": "SOLA Cup 2022 中高生パーラメンタリーディベート国際大会 (11月開催)",
        "tags": ["特別企画", "競技", "ディベート", "中学生", "高校生", ],
        "disc": `SOLA Cup 2021とは？<br>World School’s Debating Championship (WSDC) Styleによる国際高校生即興型英語ディベート大会<br>※但し本大会用に修正を加えたもの<br>​<br>　全世界の高校生に、即興型であるパーラメンタリーディベートの試合を行う機会を提供することにより、グローバル社会で活躍するのに必要とされる英語による論理的発信能力、問題発見解決能力、クリティカル・シンキング、コラボレーション力、グローバル課題や時事問題についての基礎知識、そして緩急やジェスチャー、ユーモアなどを意識した聞き手目線の分かりやすいパブリック・スピーチ力を身につける意義を伝える機会になります。また、世界一流のディベーターとの交流の機会となる他、自分のスピーチ力が他国の生徒との対戦で通用するのか、参加者各自が自分の実力を試す良い経験になります。国際大会で度々活躍されてきたジャッジから質の高いフィードバックをいただき、全員が成長できるようなイベントになることを願います。`,
        "participationRight": ` ​(1) 中学生または高校生であること<br>(2)パーラメンタリーディベート大会(HPDU, WSDC, Asian, BP, NA, etc)の出場経験がある生徒がチーム内にいること（その生徒は、各試合に選手として出場してください）`,
        "titleEn": `SOLA Cup 2022 中高生パーラメンタリーディベート国際大会 (In November)`,
        "discEn": `What is SOLA Cup 2021?<br>World School’s Debating Championship (WSDC) format debate tournament with Impromptu motions only and modifications made to suit this event.<br>​<br>By creating an opportunity to compete in parliamentary debate, we hope to provide high school students from all over the world with a chance to gain skills necessary to thrive in a globalizing society– logical thinking, problem solving, critical thinking, collaboration, knowledge about current affairs, and public speaking skills. Furthermore, this tournament will be an opportunity for students to not only interact with world class debaters, but also test their debating skills against those their age from other countries and receive high quality feedback from many high achieving judges. We hope that through this tournament, students will be able to grow both as debaters and as global citizens.`,
        "participationRightEn": ` ​(1) Currently attending junior or senior high school<br>(2) Teams must have at least one debater who has participated in a parliamentary debate tournament (eg. WSDC, HPDU of Japan, Asian, BP, NA, etc.)`,
        "tagsEn": ["Special Evenet", "Competition", "Debate", "Juniors", "High School", ],
    },
];