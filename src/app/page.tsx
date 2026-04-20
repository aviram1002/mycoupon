import type { Metadata } from 'next';
import { Hero } from '@/components/layout/hero';
import { SectionTitle } from '@/components/layout/section-title';
import { StoreCard } from '@/components/stores/store-card';
import { CouponGrid } from '@/components/coupons/coupon-grid';
import { getStores, getCoupons, getCategories, getSiteSettings } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'הקופון שלי - כל הקופונים השווים במקום אחד',
  description: 'מצא את הקופונים והדילים המשתלמים ביותר בישראל. קופונים מאומתים לחנויות המובילות.',
};

export default async function HomePage() {
  const [settings, stores, coupons, categories] = await Promise.all([
    getSiteSettings(),
    getStores({ featured: true, limit: 6 }),
    getCoupons({ featured: true, limit: 6 }),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <Hero title={settings.hero_title} subtitle={settings.hero_subtitle} />

      {/* Featured Stores */}
      <section className="container py-12">
        <SectionTitle
          title="חנויות מובילות"
          viewAllHref="/stores"
          viewAllLabel="לכל החנויות"
        />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {stores.map(store => (
            <StoreCard key={store.id} store={store} size="sm" />
          ))}
        </div>
      </section>

      {/* Featured Coupons */}
      <section className="container pb-12">
        <SectionTitle
          title="קופונים מובילים"
          subtitle="ההנחות הכי חמות של היום"
          viewAllHref="/coupons"
          viewAllLabel="לכל הקופונים"
        />
        <CouponGrid coupons={coupons} showStore />
      </section>

      {/* Popular Categories */}
      <section className="container pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-foreground text-right">קטגוריות פופולריות</h2>
            <p className="text-sm text-muted-foreground mt-1">חפשו קופונים לפי תחומי עניין וחסכו איפה שצריך</p>
            <div className="w-10 h-0.5 bg-brand mt-2 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center p-5 bg-card rounded-2xl border hover:border-brand/30 hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
