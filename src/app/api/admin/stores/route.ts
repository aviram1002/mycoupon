import { NextRequest, NextResponse } from 'next/server';
import { adminCreateStore, adminGetStores } from '@/lib/db';

export async function GET() {
  try {
    const stores = await adminGetStores();
    return NextResponse.json(stores);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // נקה שדות ריקים
    const cleanBody = Object.fromEntries(
      Object.entries(body).map(([k, v]) => [k, v === '' ? null : v])
    );

    const store = await adminCreateStore(cleanBody);
    return NextResponse.json(store, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}