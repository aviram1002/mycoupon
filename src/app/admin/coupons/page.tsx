import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminGetCoupons } from '@/lib/db';
import { getDiscountDisplay, formatDate, isExpired } from '@/lib/utils';

export default async function AdminCouponsPage() {
  const coupons = await adminGetCoupons();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">ניהול קופונים</h1>
          <p className="text-muted-foreground text-sm mt-1">{coupons.length} קופונים במערכת</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/coupons/new"><Plus className="h-4 w-4" />הוסף קופון</Link>
        </Button>
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b bg-muted/30 text-xs font-semibold text-muted-foreground">
          <div className="col-span-4">קופון</div>
          <div className="col-span-2">חנות</div>
          <div className="col-span-1 text-center">הנחה</div>
          <div className="col-span-2">תפוגה</div>
          <div className="col-span-1 text-center">סטטוס</div>
          <div className="col-span-2 text-center">פעולות</div>
        </div>

        <div className="divide-y">
          {coupons.map(coupon => {
            const expired = isExpired(coupon.expires_at);
            return (
              <div key={coupon.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors">
                <div className="col-span-4">
                  <p className="text-sm font-semibold line-clamp-1">{coupon.title}</p>
                  {coupon.code && <p className="text-xs text-muted-foreground font-mono mt-0.5">{coupon.code}</p>}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">{coupon.store?.name || '—'}</div>
                <div className="col-span-1 text-center text-sm font-bold text-brand">{getDiscountDisplay(coupon)}</div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {coupon.expires_at ? (
                    <span className={expired ? 'text-red-500' : ''}>{formatDate(coupon.expires_at)}</span>
                  ) : '—'}
                </div>
                <div className="col-span-1 flex justify-center">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    !coupon.is_active ? 'bg-gray-100 text-gray-600' :
                    expired ? 'bg-red-100 text-red-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {!coupon.is_active ? 'מושבת' : expired ? 'פג תוקף' : 'פעיל'}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                    <Link href={`/admin/coupons/${coupon.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <button className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
