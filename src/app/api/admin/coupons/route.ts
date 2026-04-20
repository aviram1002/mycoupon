import { NextRequest, NextResponse } from 'next/server';
import { adminCreateCoupon, adminGetCoupons } from '@/lib/db';

export async function GET() {
  try {
    const coupons = await adminGetCoupons();
    return NextResponse.json(coupons);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const coupon = await adminCreateCoupon(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
