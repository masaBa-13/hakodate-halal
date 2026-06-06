-- 食材フラグ（NULL=不明, 0=なし, 1=あり）
ALTER TABLE shops ADD COLUMN contains_pork INTEGER;
ALTER TABLE shops ADD COLUMN contains_alcohol INTEGER;
ALTER TABLE shops ADD COLUMN uses_halal_meat INTEGER;
ALTER TABLE shops ADD COLUMN contains_beef INTEGER;
ALTER TABLE shops ADD COLUMN contains_chicken INTEGER;
ALTER TABLE shops ADD COLUMN contains_seafood INTEGER;
ALTER TABLE shops ADD COLUMN contains_dairy INTEGER;
ALTER TABLE shops ADD COLUMN contains_egg INTEGER;
ALTER TABLE shops ADD COLUMN contains_gluten INTEGER;
ALTER TABLE shops ADD COLUMN is_vegetarian INTEGER;
ALTER TABLE shops ADD COLUMN is_vegan INTEGER;

-- 対応メニュー（JSON配列 例: ["ラーメン","チャーハン"]）
ALTER TABLE shops ADD COLUMN menu_items TEXT;

-- おすすめ度（登録者による 1〜5）
ALTER TABLE shops ADD COLUMN submitter_rating INTEGER;
