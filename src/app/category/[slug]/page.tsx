import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SectionTitle } from '@/components/layout/section-title';
import { StoreCard } from '@/components/stores/store-card';
import { CouponGrid } from '@/components/coupons/coupon-grid';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { getCategories, getStores, getCoupons } from '@/lib/db';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cats = await getCategories();
  const cat = cats.find(c => c.slug === slug);
  if (!cat) return {};
  return {
    title: `קטגוריית ${cat.name} - קופונים והנחות`,
    description: `גלאו את הקופונים וההנחות הכי טובים לקטגוריית ${cat.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === slug);
  if (!category) notFound();

  const [stores, coupons] = await Promise.all([
    getStores(),
    getCoupons({ limit: 12 }),
  ]);

  // Filter stores by category
  // (In production, stores have category_id, so we'd filter by that)
  // Here we show all for demo
  const catStores = stores.slice(0, 6);
  const catCoupons = coupons.slice(0, 9);

  return (
    <div className="container py-8">
      <Breadcrumbs items={[
        { label: 'ראשי', href: '/' },
        { label: 'קטגוריות', href: '/categories' },
        { label: category.name },
      ]} />

      <div className="mt-6 flex items-center gap-4 mb-8">
        <div className="text-5xl">{category.icon}</div>
        <div>
          <h1 className="text-3xl font-black">{category.name}</h1>
          <p className="text-muted-foreground mt-1">קופונים והנחות לקטגוריית {category.name}</p>
        </div>
      </div>

      {catStores.length > 0 && (
        <section className="mb-12">
          <SectionTitle title={`חנויות ${category.name}`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {catStores.map(store => (
              <StoreCard key={store.id} store={store} size="sm" />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionTitle title={`קופונים ל${category.name}`} />
        <CouponGrid coupons={catCoupons} showStore />
      </section>
    </div>
  );
}
