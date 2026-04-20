export type DiscountType = 'percent' | 'fixed' | 'free_shipping' | 'gift' | 'other';
export type CouponType = 'code' | 'deal' | 'free_shipping';
export type CouponBadge = 'exclusive' | 'verified' | 'popular' | 'new' | null;

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  affiliate_url?: string;
  description?: string;
  short_description?: string;
  seo_title?: string;
  seo_description?: string;
  category_id?: string;
  is_featured: boolean;
  is_active: boolean;
  coupon_count: number;
  display_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  coupons?: Coupon[];
}

export interface Coupon {
  id: string;
  store_id: string;
  title: string;
  slug: string;
  description?: string;
  code?: string;
  affiliate_url?: string;
  image_url?: string;
  discount_type: DiscountType;
  discount_value?: number;
  discount_label?: string;
  coupon_type: CouponType;
  badge?: CouponBadge;
  is_featured: boolean;
  is_active: boolean;
  expires_at?: string;
  starts_at?: string;
  uses_count: number;
  last_verified_at?: string;
  created_at: string;
  updated_at: string;
  store?: Store;
}

export interface FAQ {
  id: string;
  store_id?: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value?: string;
  description?: string;
  updated_at: string;
}

export interface SiteSettings {
  site_name: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  contact_email: string;
}

// Filter types for store pages
export interface CouponFilters {
  type?: CouponType | 'all';
  status?: 'active' | 'expired' | 'all';
  sort?: 'newest' | 'popular' | 'expiring';
}

// Admin form types
export interface StoreFormData {
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  affiliate_url?: string;
  description?: string;
  short_description?: string;
  seo_title?: string;
  seo_description?: string;
  category_id?: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export interface CouponFormData {
  store_id: string;
  title: string;
  slug: string;
  description?: string;
  code?: string;
  affiliate_url?: string;
  image_url?: string;
  discount_type: DiscountType;
  discount_value?: number;
  discount_label?: string;
  coupon_type: CouponType;
  badge?: CouponBadge;
  is_featured: boolean;
  is_active: boolean;
  expires_at?: string;
}
