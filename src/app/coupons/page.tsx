import type { Metadata } from 'next';
import { SectionTitle } from '@/components/layout/section-title';
import { CouponGrid } from '@/components/coupons/coupon-grid';
import { getCoupons } from '@/lib/db';

export const metadata: Metadata = {
  title: 'כל הקופונים - קופונים מאומתים לחנויות המובילות',
  description: 'גלאו אלפי קופונים מאומתים לחנויות המובילות. חסכו כסף עם קודי הנחה בלעדיים.',
};

export default async function CouponsPage() {
  const coupons = await getCoupons({ limit: 50 });

  return (
    <div className="container py-8">
      <SectionTitle
        title="כל הקופונים"
        subtitle={`${coupons.length} קופונים מאומתים`}
      />
      <CouponGrid coupons={coupons} showStore />
    </div>
  );
}
