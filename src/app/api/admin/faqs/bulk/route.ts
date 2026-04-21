import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { store_id, faqs } = await req.json();
    const db = getSupabaseServerClient();

    // מחק שאלות קיימות של החנות
    await db.from('faqs').delete().eq('store_id', store_id);

    // הוסף שאלות חדשות
    if (faqs && faqs.length > 0) {
      const { error } = await db.from('faqs').insert(faqs);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}