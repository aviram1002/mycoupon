'use client';
import { useState } from 'react';
import { CouponCard } from './coupon-card';
import { CouponPopup } from './coupon-popup';
import type { Coupon } from '@/types';

interface CouponGridProps {
  coupons: Coupon[];
  showStore?: boolean;
  emptyMessage?: string;
}

export function CouponGrid({ coupons, showStore = false, emptyMessage }: CouponGridProps) {
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  if (coupons.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <div className="text-4xl mb-3">🎫</div>
        <p className="font-medium">{emptyMessage || 'אין קופונים זמינים כרגע'}</p>
        <p className="text-sm mt-1">בדקו שוב בקרוב!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(coupon => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            showStore={showStore}
            onOpenPopup={setActiveCoupon}
          />
        ))}
      </div>

      <CouponPopup
        coupon={activeCoupon}
        open={!!activeCoupon}
        onClose={() => setActiveCoupon(null)}
      />
    </>
  );
}
