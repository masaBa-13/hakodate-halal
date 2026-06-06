-- 函館ハラルマップ ファースト店舗データ
-- 出典: 函館旅館ホテル協同組合「ムスリム&ベジタリアン ガイドマップ」
--      https://www.hakodate.travel/en/sightseeing-spots/food-drink-halal-vegetarian-vegan/

INSERT OR IGNORE INTO shops (
  id, name, address, lat, lng, category, halal_level,
  has_prayer_space, opening_hours,
  comment_ja, comment_en,
  submitter_type, is_active
) VALUES

-- 1. 松風グルカ
('seed-0001-0000-0000-000000000001',
 'Matsukaze Gurkha（松風グルカ）',
 '北海道函館市松風町10-7', 41.7745, 140.7288,
 'food', 'friendly', 0,
 '11:00〜15:00、17:00〜23:00（L.O.22:00）／定休日:水曜',
 'ネパール料理のカレー専門店。ムスリムフレンドリーでベジタリアン対応。テイクアウト可。',
 'Nepalese curry restaurant. Muslim-friendly and vegetarian options available. Take-away OK.',
 'user', 1),

-- 2. 味仙 前川
('seed-0002-0000-0000-000000000001',
 '味仙 前川（Ajisen Maekawa）',
 '北海道函館市若松町9-15 どんぶり横丁市場', 41.7729, 140.7256,
 'food', 'friendly', 0,
 '5:30〜15:00／定休日:木曜',
 '函館朝市どんぶり横丁内のシーフード丼の店。テイクアウト可。',
 'Seafood donburi restaurant inside Hakodate Morning Market Donburi Yokocho. Take-away available.',
 'user', 1),

-- 3. 朝市お食事処 道下商店
('seed-0003-0000-0000-000000000001',
 '朝市お食事処 道下商店',
 '北海道函館市若松町9-15 どんぶり横丁市場', 41.7728, 140.7255,
 'food', 'friendly', 0,
 '6:00〜21:00／不定休',
 '函館朝市どんぶり横丁内。シーフード・ベジタリアン・精進料理対応。テイクアウト可。',
 'Inside Hakodate Morning Market. Seafood, vegetarian and oriental vegetarian options. Take-away available.',
 'user', 1),

-- 4. はなまる
('seed-0004-0000-0000-000000000001',
 'はなまる（Hanamaru）',
 '北海道函館市若松町9-22 朝市内フードコート', 41.7731, 140.7262,
 'food', 'friendly', 0,
 '6:30〜13:00／不定休',
 '函館朝市フードコート内のたこ焼き・海鮮の店。テイクアウト可。',
 'Takoyaki and seafood stall inside Hakodate Morning Market food court. Take-away available.',
 'user', 1),

-- 5. 鈴屋食堂
('seed-0005-0000-0000-000000000001',
 '鈴屋食堂（Suzuya Syokudou）',
 '北海道函館市若松町10-4', 41.7726, 140.7261,
 'food', 'friendly', 0,
 '6:00〜14:00／年中無休',
 '函館朝市エリアのシーフード定食の店。年中無休。テイクアウト可。',
 'Seafood set meal restaurant near Hakodate Morning Market. Open year-round. Take-away available.',
 'user', 1),

-- 6. Cafe & Deli MARUSEN
('seed-0006-0000-0000-000000000001',
 'Cafe & Deli MARUSEN',
 '北海道函館市大手町5-10 ニチロビル1F', 41.7698, 140.7195,
 'food', 'friendly', 0,
 '11:00〜15:00、18:00〜22:00（L.O.21:00）／定休日:火曜',
 'カフェ＆レストラン。ムスリムフレンドリー・ベジタリアン・精進料理対応。テイクアウト可。',
 'Cafe and restaurant. Muslim-friendly, vegetarian and oriental vegetarian options. Take-away available.',
 'user', 1),

-- 7. 函館国際ホテル アザレア（朝食ビュッフェ）
('seed-0007-0000-0000-000000000001',
 '函館国際ホテル アザレア',
 '北海道函館市大手町5-10 函館国際ホテル1F', 41.7699, 140.7196,
 'stay', 'friendly', 0,
 '6:30〜10:00（L.O.9:30）／年中無休',
 '函館国際ホテルの朝食ビュッフェ。ムスリムフレンドリー・ベジタリアン対応。',
 'Breakfast buffet at Hakodate Kokusai Hotel. Muslim-friendly and vegetarian options available.',
 'user', 1),

-- 8. 野菜バー Miruya
('seed-0008-0000-0000-000000000001',
 '野菜バー Miruya（Yasai Bar Miruya）',
 '北海道函館市豊川町22-5', 41.7668, 140.7148,
 'food', 'friendly', 0,
 '（水・木）12:00〜14:30、18:00〜22:00／定休日:日曜・祝日',
 '野菜料理専門のレストラン。ムスリムフレンドリー・ベジタリアン・精進料理対応。3名以上は要前日予約。',
 'Vegetable-focused restaurant. Muslim-friendly, vegetarian and oriental vegetarian options. Groups of 3+ require advance reservation.',
 'user', 1),

-- 9. La Jolie Motomachi by WBF（ホテルWBF函館元町）
('seed-0009-0000-0000-000000000001',
 'La Jolie Motomachi by WBF',
 '北海道函館市末広町6-6', 41.7648, 140.7131,
 'stay', 'friendly', 0,
 '7:00〜10:00（朝食）／年中無休',
 'ホテルWBF函館元町の朝食ビュッフェ。ムスリムフレンドリー・ベジタリアン・精進料理対応。英語スタッフあり。',
 'Breakfast buffet at Hotel WBF Hakodate Motomachi. Muslim-friendly, vegetarian options. English-speaking staff available.',
 'user', 1),

-- 10. Cafe Drip Drop
('seed-0010-0000-0000-000000000001',
 'Cafe Drip Drop',
 '北海道函館市末広町4-19 函館市地域交流まちづくりセンター1F', 41.7638, 140.7170,
 'food', 'friendly', 0,
 '10:00〜18:00（L.O.17:40）／定休日:水曜（施設休館日に準ずる）',
 '函館市地域交流まちづくりセンター1Fのカフェ。ムスリムフレンドリー・ベジタリアン対応。3名以上は要前日予約。',
 'Cafe on the 1st floor of Hakodate Community Design Center. Muslim-friendly and vegetarian options. Groups of 3+ require advance reservation.',
 'user', 1),

-- 11. Pazar Bazar
('seed-0011-0000-0000-000000000001',
 'Pazar Bazar（パザールバザール）',
 '北海道函館市末広町17-19', 41.7626, 140.7125,
 'food', 'friendly', 0,
 '11:00〜18:00（L.O.17:00）、金土11:00〜21:00（L.O.20:00）／定休日:日・月曜',
 'カレー＆サンドイッチの店。ムスリムフレンドリー・ベジタリアン・精進料理対応。英語スタッフあり。テイクアウト可。',
 'Curry and sandwich shop. Muslim-friendly, vegetarian and oriental vegetarian options. English-speaking staff. Take-away available.',
 'user', 1),

-- 12. おひるごはんカフェ taom
('seed-0012-0000-0000-000000000001',
 'おひるごはんカフェ taom',
 '北海道函館市元町30-13', 41.7608, 140.7078,
 'food', 'friendly', 0,
 '11:00〜16:00／定休日:日曜・不定休',
 '元町エリアの野菜料理カフェ。ムスリムフレンドリー対応。',
 'Vegetable lunch cafe in Motomachi area. Muslim-friendly.',
 'user', 1),

-- 13. LAMB''S EAR
('seed-0013-0000-0000-000000000001',
 "LAMB'S EAR",
 '北海道函館市中島町38-11', 41.7795, 140.7378,
 'food', 'friendly', 0,
 '11:00〜15:00、17:30〜20:30（L.O.）／定休日:月曜',
 'カレー専門店。ムスリムフレンドリー対応。',
 'Curry restaurant. Muslim-friendly.',
 'user', 1),

-- 14. maido RAMEN NOODLE SOUP
('seed-0014-0000-0000-000000000001',
 'maido RAMEN NOODLE SOUP',
 '北海道函館市湯川町1-26-34', 41.7573, 140.7428,
 'food', 'friendly', 0,
 '11:30〜15:00（L.O.14:30）、17:00〜21:00（L.O.20:30）／定休日:火曜',
 'ラーメン専門店。ムスリムフレンドリー・ベジタリアン・精進料理対応。スープ切れ次第閉店。',
 'Ramen restaurant. Muslim-friendly, vegetarian and oriental vegetarian options. Closes when soup runs out.',
 'user', 1),

-- 15. Tune Hakodate Hostel & Music Bar
('seed-0015-0000-0000-000000000001',
 'Tune Hakodate Hostel & Music Bar',
 '北海道函館市湯川町1-30-1', 41.7558, 140.7435,
 'stay', 'friendly', 0,
 '18:00〜24:00（L.O.23:30）／年中無休',
 'ホステル＆ミュージックバー。ラーメンあり。ムスリムフレンドリー・英語対応。テイクアウト可。',
 'Hostel and music bar serving ramen. Muslim-friendly. English-speaking staff. Take-away available.',
 'user', 1),

-- 16. フレンドリーベア（礼拝スペースあり）
('seed-0016-0000-0000-000000000001',
 'Friendly Bear（フレンドリーベア）',
 '北海道亀田郡七飯町大沼215', 41.9912, 140.6618,
 'food', 'friendly', 1,
 '9:00〜17:00（L.O.16:30）、11〜3月9:00〜16:00（L.O.15:30）／年中無休（要4日前予約）',
 '大沼エリアのテッパン焼き・鍋料理の店。礼拝スペースあり。ムスリムフレンドリー・ベジタリアン・精進料理対応。',
 'Teppanyaki and Japanese hot pot restaurant near Onuma Lake. Prayer space available. Muslim-friendly, vegetarian options.',
 'user', 1),

-- 17. 函館大沼鶴雅リゾート エプイ
('seed-0017-0000-0000-000000000001',
 '函館大沼鶴雅リゾート エプイ',
 '北海道亀田郡七飯町大沼85-9', 41.9978, 140.6591,
 'stay', 'inquire', 0,
 '朝食7:00〜9:30、ランチ11:30〜15:00、ディナー18:00〜21:00（全て要予約）／年中無休',
 '大沼エリアの高級リゾートホテル。ベジタリアン・英語対応。ムスリム対応は要確認。1名から要予約。',
 'Luxury resort hotel near Onuma Lake. Vegetarian and English options. Muslim accommodation requires prior inquiry. Reservation required from 1 person.',
 'user', 1),

-- 18. どうなんでス 奥田スピリッツ（木古内）
('seed-0018-0000-0000-000000000001',
 'どうなんでス 奥田スピリッツ',
 '北海道上磯郡木古内町本町338-14 道の駅みそぎの郷きこない', 41.6743, 140.4358,
 'food', 'friendly', 0,
 '11:00〜14:30（L.O.14:00）、17:30〜21:00（L.O.20:45）／不定休',
 '道の駅みそぎの郷きこない内のレストラン。ムスリムフレンドリー対応。テイクアウト可。',
 'Restaurant inside Roadside Station Misoginosato Kikonai. Muslim-friendly. Take-away available.',
 'user', 1),

-- 19. 道の駅しかべ間歇泉公園
('seed-0019-0000-0000-000000000001',
 '道の駅しかべ間歇泉公園',
 '北海道茅部郡鹿部町鹿部18-1', 42.0285, 140.8307,
 'other', 'inquire', 0,
 '4〜9月8:00〜18:00、10〜3月9:00〜17:00／10〜3月第4月曜・年末年始休',
 '間歇泉で有名な道の駅。野菜・海鮮料理あり。ベジタリアン・英語対応。ムスリム対応は要確認。',
 'Roadside station famous for its geyser. Vegetable and seafood dishes. Vegetarian and English options. Muslim accommodation requires prior inquiry.',
 'user', 1),

-- 20. 久どん亭
('seed-0020-0000-0000-000000000001',
 '久どん亭（Kudontei）',
 '北海道函館市若松町9-15 どんぶり横丁市場', 41.7727, 140.7254,
 'food', 'friendly', 0,
 '7:00〜16:00／不定休',
 '函館朝市どんぶり横丁内のシーフード丼の店。ムスリムフレンドリー・ベジタリアン対応。3名以上は要前日予約。',
 'Seafood donburi restaurant inside Hakodate Morning Market Donburi Yokocho. Muslim-friendly and vegetarian options. Groups of 3+ require advance reservation.',
 'user', 1);
