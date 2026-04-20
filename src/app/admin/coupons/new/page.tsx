import { CouponForm } from '@/components/admin/coupon-form';
import { adminGetStores } from '@/lib/db';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NewCouponPage() {
  const stores = await adminGetStores();
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/coupons" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-3.5 w-3.5" />קופונים
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">קופון חדש</span>
      </div>
      <h1 className="text-2xl font-black mb-6">הוסף קופון חדש</h1>
      <CouponForm stores={stores} />
    </div>
  );
}
