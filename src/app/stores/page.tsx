import type { Metadata } from 'next';
import { SectionTitle } from '@/components/layout/section-title';
import { StoreCard } from '@/components/stores/store-card';
import { getStores, getCategories } from '@/lib/db';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'כל החנויות - קופונים לחנויות המובילות',
  description: 'מצאו קופונים להנחות לכל החנויות המובילות בישראל ובעולם.',
};

export default async function StoresPage() {
  const [stores, categories] = await Promise.all([getStores(), getCategories()]);

  return (
    <div className="container py-8">
      <SectionTitle title="חנויות מובילות" subtitle="בחרו חנות וגלו את הקופונים הכי טובים" />

      {/* Categories filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/stores" className="inline-flex items-center rounded-full border bg-brand text-white px-4 py-1.5 text-sm font-medium">
          הכל
        </Link>
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="inline-flex items-center rounded-full border bg-card hover:border-brand/30 hover:bg-brand-50 px-4 py-1.5 text-sm font-medium transition-colors gap-1.5"
          >
            <span>{cat.icon}</span>
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {stores.map(store => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}
