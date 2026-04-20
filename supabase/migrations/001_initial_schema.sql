-- MyCoupon Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  affiliate_url TEXT,
  description TEXT,
  short_description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  category_id UUID REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  coupon_count INT DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  code TEXT,
  affiliate_url TEXT,
  image_url TEXT,
  discount_type TEXT CHECK (discount_type IN ('percent', 'fixed', 'free_shipping', 'gift', 'other')) DEFAULT 'percent',
  discount_value NUMERIC,
  discount_label TEXT,
  coupon_type TEXT CHECK (coupon_type IN ('code', 'deal', 'free_shipping')) DEFAULT 'code',
  badge TEXT CHECK (badge IN ('exclusive', 'verified', 'popular', 'new', null)),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  uses_count INT DEFAULT 0,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users (uses Supabase Auth, just metadata)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_featured ON stores(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_store_id ON coupons(store_id);
CREATE INDEX IF NOT EXISTS idx_coupons_slug ON coupons(slug);
CREATE INDEX IF NOT EXISTS idx_coupons_featured ON coupons(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_store_id ON faqs(store_id);

-- Update coupon_count trigger
CREATE OR REPLACE FUNCTION update_store_coupon_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE stores SET coupon_count = coupon_count + 1 WHERE id = NEW.store_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE stores SET coupon_count = coupon_count - 1 WHERE id = OLD.store_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_coupon_count
AFTER INSERT OR DELETE ON coupons
FOR EACH ROW EXECUTE FUNCTION update_store_coupon_count();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_stores_updated_at
BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trigger_coupons_updated_at
BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read stores" ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all stores" ON stores FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all coupons" ON coupons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Seed data
INSERT INTO categories (name, slug, icon, display_order) VALUES
  ('אופנה', 'fashion', '👗', 1),
  ('אלקטרוניקה', 'electronics', '💻', 2),
  ('בית וגן', 'home-garden', '🏠', 3),
  ('אוכל ומסעדות', 'food', '🍽️', 4),
  ('טיסות ותיירות', 'travel', '✈️', 5),
  ('ספורט ופנאי', 'sports', '⚽', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('site_name', 'הקופון שלי', 'שם האתר'),
  ('site_description', 'מצא את הקופונים והדילים המשתלמים ביותר בישראל', 'תיאור האתר'),
  ('hero_title', 'כל הקופונים השווים במקום אחד', 'כותרת הגיבור'),
  ('hero_subtitle', 'גלו הנחות בלעדיות, מבצעי זק וקופונים שפשוט אסור לפספס', 'תת-כותרת הגיבור'),
  ('contact_email', 'support@mycoupon.co.il', 'אימייל ליצירת קשר')
ON CONFLICT (key) DO NOTHING;

INSERT INTO stores (name, slug, logo_url, website_url, description, short_description, is_featured, display_order) VALUES
  ('KSP', 'ksp', 'https://placehold.co/80x80/000000/FFFFFF?text=KSP', 'https://ksp.co.il', 'רשת המחשבים הסלולר המובילה בישראל. מצאו אלפי מוצרים', 'רשת המחשבים הסלולר המובילה', true, 1),
  ('Amazon', 'amazon', 'https://placehold.co/80x80/FF9900/FFFFFF?text=AMZ', 'https://amazon.com', 'קנו מכל העולם במחירים הכי טובים', 'קניות אונליין עולמיות', true, 2),
  ('Nike', 'nike', 'https://placehold.co/80x80/000000/FFFFFF?text=NIKE', 'https://nike.com', 'ציוד ספורט ואופנה מהמותג המוביל בעולם', 'מותג ספורט ואופנה עולמי', true, 3),
  ('Shein', 'shein', 'https://placehold.co/80x80/000000/FFFFFF?text=SHEIN', 'https://shein.com', 'אופנה מסין במחירים שלא תאמינו', 'אופנה במחירים נמוכים', true, 4),
  ('Ivory', 'ivory', 'https://placehold.co/80x80/333333/FFFFFF?text=IVY', 'https://ivory.co.il', 'מחשבים סלולריים ואלקטרוניקה', 'מחשבים סלולריים', true, 5),
  ('Asos', 'asos', 'https://placehold.co/80x80/000000/FFFFFF?text=ASOS', 'https://asos.com', 'מותגי אופנה בינלאומיים', 'אופנה בינלאומית', true, 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO coupons (store_id, title, slug, description, code, discount_type, discount_value, discount_label, coupon_type, badge, is_featured, expires_at)
SELECT s.id, '15% הנחה על מחלקת הגיימינג', 'ksp-gaming-15', 'קבלו הנחה המשמעותית על עכברים, מקלדות, מסכים וכיסאות גיימינג', 'GAME15', 'percent', 15, '15% OFF', 'code', 'exclusive', true, NOW() + INTERVAL '30 days'
FROM stores s WHERE s.slug = 'ksp' LIMIT 1;

INSERT INTO coupons (store_id, title, slug, description, code, discount_type, discount_value, discount_label, coupon_type, badge, is_featured, expires_at)
SELECT s.id, '100 ש"ח מתנה בקניית מוצרי חשמל', 'ksp-electric-100', 'קופון הנחה לקניית מוצרי חשמל לבית', 'ELEC100', 'fixed', 100, '₪100', 'code', 'verified', true, NOW() + INTERVAL '14 days'
FROM stores s WHERE s.slug = 'ksp' LIMIT 1;

INSERT INTO coupons (store_id, title, slug, description, code, discount_type, discount_value, discount_label, coupon_type, badge, is_featured, expires_at)
SELECT s.id, '20% הנחה על כל מחלקת הריצה', 'nike-running-20', 'הנחה על כל קולקציית הנעליים החדשה', 'RUN20', 'percent', 20, '20% OFF', 'code', 'popular', true, NOW() + INTERVAL '48 hours'
FROM stores s WHERE s.slug = 'nike' LIMIT 1;

INSERT INTO coupons (store_id, title, slug, description, discount_type, discount_value, discount_label, coupon_type, badge, is_featured, expires_at)
SELECT s.id, 'משלוח חינם עד הבית', 'ksp-free-shipping', 'משלוח חינם לכל הזמנה מעל 299 ש"ח', 'free_shipping', 0, 'FREE', 'free_shipping', 'verified', false, NOW() + INTERVAL '60 days'
FROM stores s WHERE s.slug = 'ksp' LIMIT 1;

INSERT INTO coupons (store_id, title, slug, description, code, discount_type, discount_value, discount_label, coupon_type, badge, is_featured, expires_at)
SELECT s.id, '15% הנחה נוספת על פריטי Outlet', 'asos-outlet-15', 'הנחה נוספת על כל פריטי הסייל', 'OUTLET15', 'percent', 15, '15% OFF', 'code', 'exclusive', true, NOW() + INTERVAL '7 days'
FROM stores s WHERE s.slug = 'asos' LIMIT 1;

INSERT INTO faqs (store_id, question, answer, display_order)
SELECT s.id, 'האם ניתן להשתמש ביותר מקופון אחד בקנייה ב-KSP?', 'ברוב המקרים, אתר KSP מאפשר שימוש בקוד קופון אחד בלבד למעמד. עם זאת, ניתן לצבור קופונים למוצרים שונים, אלא אם אכן אין אפשרות בתקנון הקופון הספציפי.', 1
FROM stores s WHERE s.slug = 'ksp' LIMIT 1;

INSERT INTO faqs (store_id, question, answer, display_order)
SELECT s.id, 'איך אני יודע אם הקופון עדיין בתוקף?', 'אנחנו בודקים בדדיקות ובמדיות מדי יום. קופונים שפג תוקפם יוסרו מהרשימה. אנחנו גם מתעדכנים לגבי מקורות ראשיות ומאפשנות, וניידע אם הקופון עבר.', 2
FROM stores s WHERE s.slug = 'ksp' LIMIT 1;

INSERT INTO faqs (store_id, question, answer, display_order)
SELECT s.id, 'האם יש קופונים מיוחדים לאפליקציה של KSP?', 'כן, לעיתים קרובות קופוני KSP משתתפים בלעדיים לרכישה דרך האפליקציה. אנחנו דואגים לציין בלעדיים אלה בתוך בתוך כאשר אתה נמצא.', 3
FROM stores s WHERE s.slug = 'ksp' LIMIT 1;
