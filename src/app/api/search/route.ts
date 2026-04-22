import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  const db = getSupabaseServerClient();

  const { data, error } = await db
    .from('coupons')
    .select('id, title, description, code, discount_value, discount_type, coupon_type, slug, store:stores(name, logo_url, slug)')
    .eq('is_active', true)
    .or(`title.ilike.%${q}%,description.ilike.%${q}%,code.ilike.%${q}%`)
    .order('uses_count', { ascending: false })
    .limit(20);

  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(data ?? []);
}
