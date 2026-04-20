import { getSupabaseServerClient } from './supabase';
import type { Store, Coupon, Category, FAQ, Setting, SiteSettings, CouponFilters } from '@/types';

const db = () => getSupabaseServerClient();

// ─── Stores ───────────────────────────────────────────────────────────────────

export async function getStores(options?: { featured?: boolean; limit?: number }) {
  let query = db().from('stores').select('*, category:categories(*)').eq('is_active', true);
  if (options?.featured) query = query.eq('is_featured', true);
  query = query.order('display_order').limit(options?.limit || 100);
  const { data, error } = await query;
  if (error) throw error;
  return data as Store[];
}

export async function getStoreBySlug(slug: string) {
  const { data, error } = await db()
    .from('stores')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error) return null;
  return data as Store;
}

export async function getAllStoreSlugs() {
  const { data } = await db().from('stores').select('slug').eq('is_active', true);
  return data?.map(s => s.slug) || [];
}

export async function getSimilarStores(storeId: string, categoryId?: string, limit = 5) {
  let query = db()
    .from('stores')
    .select('*')
    .eq('is_active', true)
    .neq('id', storeId);
  if (categoryId) query = query.eq('category_id', categoryId);
  const { data } = await query.limit(limit);
  return (data || []) as Store[];
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function getCoupons(options?: { 
  storeId?: string; 
  featured?: boolean; 
  limit?: number;
  filters?: CouponFilters;
}) {
  let query = db()
    .from('coupons')
    .select('*, store:stores(*)')
    .eq('is_active', true);

  if (options?.storeId) query = query.eq('store_id', options.storeId);
  if (options?.featured) query = query.eq('is_featured', true);
  
  const filters = options?.filters;
  if (filters?.type && filters.type !== 'all') query = query.eq('coupon_type', filters.type);
  if (filters?.status === 'active') query = query.or('expires_at.is.null,expires_at.gt.now()');
  if (filters?.status === 'expired') query = query.lt('expires_at', new Date().toISOString());

  if (filters?.sort === 'popular') query = query.order('uses_count', { ascending: false });
  else if (filters?.sort === 'expiring') query = query.order('expires_at', { ascending: true });
  else query = query.order('created_at', { ascending: false });

  query = query.limit(options?.limit || 50);
  const { data, error } = await query;
  if (error) throw error;
  return data as Coupon[];
}

export async function getCouponBySlug(slug: string) {
  const { data, error } = await db()
    .from('coupons')
    .select('*, store:stores(*)')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data as Coupon;
}

export async function getAllCouponSlugs() {
  const { data } = await db().from('coupons').select('slug').eq('is_active', true);
  return data?.map(c => c.slug) || [];
}

export async function incrementCouponUses(couponId: string) {
  await db().rpc('increment', { table_name: 'coupons', id: couponId, field: 'uses_count' });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories() {
  const { data } = await db()
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  return (data || []) as Category[];
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export async function getFAQsByStore(storeId: string) {
  const { data } = await db()
    .from('faqs')
    .select('*')
    .eq('store_id', storeId)
    .eq('is_active', true)
    .order('display_order');
  return (data || []) as FAQ[];
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data } = await db().from('settings').select('*');
  const settings: Record<string, string> = {};
  (data || []).forEach((s: Setting) => {
    if (s.key && s.value) settings[s.key] = s.value;
  });
  return {
    site_name: settings.site_name || 'הקופון שלי',
    site_description: settings.site_description || '',
    hero_title: settings.hero_title || 'כל הקופונים השווים במקום אחד',
    hero_subtitle: settings.hero_subtitle || '',
    contact_email: settings.contact_email || '',
  };
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export async function adminGetStores() {
  const { data, error } = await db()
    .from('stores')
    .select('*, category:categories(*)')
    .order('display_order');
  if (error) throw error;
  return data as Store[];
}

export async function adminCreateStore(data: Partial<Store>) {
  const { data: result, error } = await db().from('stores').insert(data).select().single();
  if (error) throw error;
  return result as Store;
}

export async function adminUpdateStore(id: string, data: Partial<Store>) {
  const { data: result, error } = await db().from('stores').update(data).eq('id', id).select().single();
  if (error) throw error;
  return result as Store;
}

export async function adminDeleteStore(id: string) {
  const { error } = await db().from('stores').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetCoupons() {
  const { data, error } = await db()
    .from('coupons')
    .select('*, store:stores(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Coupon[];
}

export async function adminCreateCoupon(data: Partial<Coupon>) {
  const { data: result, error } = await db().from('coupons').insert(data).select().single();
  if (error) throw error;
  return result as Coupon;
}

export async function adminUpdateCoupon(id: string, data: Partial<Coupon>) {
  const { data: result, error } = await db().from('coupons').update(data).eq('id', id).select().single();
  if (error) throw error;
  return result as Coupon;
}

export async function adminDeleteCoupon(id: string) {
  const { error } = await db().from('coupons').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetFAQs(storeId?: string) {
  let query = db().from('faqs').select('*, store:stores(name,slug)').order('display_order');
  if (storeId) query = query.eq('store_id', storeId);
  const { data, error } = await query;
  if (error) throw error;
  return data as FAQ[];
}

export async function adminCreateFAQ(data: Partial<FAQ>) {
  const { data: result, error } = await db().from('faqs').insert(data).select().single();
  if (error) throw error;
  return result as FAQ;
}

export async function adminUpdateFAQ(id: string, data: Partial<FAQ>) {
  const { data: result, error } = await db().from('faqs').update(data).eq('id', id).select().single();
  if (error) throw error;
  return result as FAQ;
}

export async function adminDeleteFAQ(id: string) {
  const { error } = await db().from('faqs').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetSettings() {
  const { data } = await db().from('settings').select('*').order('key');
  return (data || []) as Setting[];
}

export async function adminUpdateSetting(key: string, value: string) {
  const { error } = await db()
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
}
