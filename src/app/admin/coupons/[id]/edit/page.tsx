import { notFound } from 'next/navigation';
import { CouponForm } from '@/components/admin/coupon-form';
import { adminGetCoupons, adminGetStores } from '@/lib/db';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [coupons, stores] = await Promise.all([adminGetCoupons(), adminGetStores()]);
  const coupon = coupons.find(c => c.id === id);
  if (!coupon) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/coupons" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-3.5 w-3.5" />קופונים
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium line-clamp-1">{coupon.title}</span>
      </div>
      <h1 className="text-2xl font-black mb-6">עריכת קופון</h1>
      <CouponForm coupon={coupon} stores={stores} />
    </div>
  );
}
