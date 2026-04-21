import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { store_id, faqs } = await req.json();
    const db = getSupabaseServerClient();

    // מחק שאלות קיימות של החנות
    await db.from('faqs').delete().eq('store_id', store_id);

    // הוסף שאלות חדשות
    const validFaqs = faqs
      .filter((f: any) => f.question && f.answer)
      .map((f: any, i: number) => ({
        store_id,
        question: f.question,
        answer: f.answer,
        display_order: i,
        is_active: true,
      }));

    if (validFaqs.length > 0) {
      const { error } = await db.from('faqs').insert(validFaqs);
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true, count: validFaqs.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}