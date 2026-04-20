import { NextRequest, NextResponse } from 'next/server';
import { adminUpdateSetting, adminGetSettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = await adminGetSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    // body is { key: value, key: value, ... }
    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        adminUpdateSetting(key, String(value))
      )
    );
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
