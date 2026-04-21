import { NextRequest, NextResponse } from 'next/server';
import { adminUpdateStore, adminDeleteStore } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // נקה שדות ריקים
    const cleanBody = Object.fromEntries(
      Object.entries(body).map(([k, v]) => [k, v === '' ? null : v])
    );

    const store = await adminUpdateStore(id, cleanBody);
    return NextResponse.json(store);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await adminDeleteStore(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}