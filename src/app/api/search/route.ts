import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  const db = getSupabaseServerClient();

  // Search coupons
  const { data: coupons } = await db
    .from('coupons')
    .select('id, title, description, code, discount_value, discount_type, coupon_type, slug, store:stores(name, logo_url, slug)')
    .eq('is_active', true)
    .or(`title.ilike.%${q}%,description.ilike.%${q}%,code.ilike.%${q}%`)
    .order('uses_count', { ascending: false })
    .limit(10);

  // Search stores
  const { data: stores } = await db
    .from('stores')
    .select('id, name, logo_url, slug')
    .eq('is_active', true)
    .ilike('name', `%${q}%`)
    .limit(5);

  const couponResults = (coupons ?? []).map(c => ({ ...c, type: 'coupon' as const }));
  const storeResults = (stores ?? []).map(s => ({ ...s, type: 'store' as const }));

  // Stores first, then coupons
  return NextResponse.json([...storeResults, ...couponResults]);
}
