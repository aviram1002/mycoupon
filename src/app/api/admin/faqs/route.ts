import { NextRequest, NextResponse } from 'next/server';
import { adminCreateFAQ, adminGetFAQs } from '@/lib/db';

export async function GET() {
  try {
    const faqs = await adminGetFAQs();
    return NextResponse.json(faqs);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const faq = await adminCreateFAQ(body);
    return NextResponse.json(faq, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
