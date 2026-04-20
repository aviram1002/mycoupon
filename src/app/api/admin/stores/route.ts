import { NextRequest, NextResponse } from 'next/server';
import { adminCreateStore, adminGetStores } from '@/lib/db';

export async function GET() {
  try {
    const stores = await adminGetStores();
    return NextResponse.json(stores);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const store = await adminCreateStore(body);
    return NextResponse.json(store, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
