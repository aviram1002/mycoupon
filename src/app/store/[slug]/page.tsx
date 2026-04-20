import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Tag } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { SectionTitle } from '@/components/layout/section-title';
import { CouponGrid } from '@/components/coupons/coupon-grid';
import { CouponFiltersBar } from '@/components/coupons/coupon-filters';
import { FAQSection } from '@/components/stores/faq-section';
import { StoreCard } from '@/components/stores/store-card';
import { Button } from '@/components/ui/button';
import {
  getStoreBySlug, getCoupons, getFAQsByStore, getSimilarStores, getAllStoreSlugs,
} from '@/lib/db';
import { generateStoreSchema } from '@/lib/schema';
import type { CouponFilters } from '@/types';

interface StorePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string; status?: string; sort?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllStoreSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  return {
    title: store.seo_title || `קופונים ל-${store.name} | ${new Date().getFullYear()}`,
    description: store.seo_description || `כל הקופונים והדילים המשתלמים ל-${store.name}. חסכו בקניות עם קוד קופון מאומת!`,
    alternates: { canonical: `${siteUrl}/store/${slug}` },
    openGraph: {
      title: store.seo_title || `קופונים ל-${store.name}`,
      description: store.seo_description || store.short_description || '',
      images: store.logo_url ? [{ url: store.logo_url }] : [],
    },
  };
}

export default async function StorePage({ params, searchParams }: StorePageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const filters: CouponFilters = {
    type: (sp.type as CouponFilters['type']) || 'all',
    status: (sp.status as CouponFilters['status']) || 'all',
    sort: (sp.sort as CouponFilters['sort']) || 'newest',
  };

  const [coupons, faqs, similarStores] = await Promise.all([
    getCoupons({ storeId: store.id, filters }),
    getFAQsByStore(store.id),
    getSimilarStores(store.id, store.category_id, 5),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const schemas = generateStoreSchema(store, faqs, siteUrl);
  const hasFilters = sp.type || sp.status || sp.sort;
  const canonical = `${siteUrl}/store/${slug}`;

  return (
    <>
      {/* JSON-LD */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* Canonical for filtered pages */}
      {hasFilters && (
        <link rel="canonical" href={canonical} />
      )}

      <div className="container py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'ראשי', href: '/' },
            { label: 'חנויות', href: '/stores' },
            { label: store.name },
          ]}
        />

        {/* Store Hero */}
        <div className="mt-6 bg-card rounded-2xl border p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl bg-muted border flex items-center justify-center overflow-hidden flex-shrink-0">
              {store.logo_url ? (
                <Image src={store.logo_url} alt={store.name} width={96} height={96} className="object-contain" />
              ) : (
                <span className="text-3xl font-black text-muted-foreground">{store.name[0]}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-black">{store.name}</h1>
                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                  חנות מאושרת
                </span>
              </div>

              {store.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-2xl">
                  {store.description}
                </p>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <a href={store.affiliate_url || store.website_url || '#'} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    לאתר החנות
                  </a>
                </Button>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  {coupons.length} קופונים זמינים
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <aside className="md:col-span-1">
            <CouponFiltersBar filters={filters} />
          </aside>

          {/* Coupon Grid */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                קופונים זמינים ({coupons.length})
              </h2>
            </div>
            <CouponGrid
              coupons={coupons}
              emptyMessage={`אין קופונים זמינים ל-${store.name} עם הסינון הנוכחי`}
            />
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection faqs={faqs} storeName={store.name} />

        {/* SEO Text */}
        {store.description && (
          <section className="mt-12 bg-muted/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">
              קופונים ל-{store.name}: כל מה שצריך לדעת לחסוך
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
              <p>
                {store.name} {store.description} אנחנו מרכזים את כל הקופונים המאומתים, הנחות לעדויות ומבצעים
                שאי אפספסס לאתרים המובילים בישראל ובעולם כדי שתוכלו לקנות יותר בפחות.
              </p>
              <p className="mt-3">
                איך משתמשים בקופון ב-{store.name}? פשוט מאוד – בחרו קופון, לחצו על &quot;קבל קוד&quot;,
                העתיקו את הקוד ולחצו &quot;מעבר לחנות&quot;. הדביקו את הקוד בשדה הייעודי בקופה. המערכת שלנו
                בודקת את הקופונים מדי יום כדי להבטיח שאתם תמיד מקבלים הנחות שעובדות.
              </p>
            </div>
          </section>
        )}

        {/* Similar Stores */}
        {similarStores.length > 0 && (
          <section className="mt-12">
            <SectionTitle
              title="חנויות דומות שיעניינו אותך"
              viewAllHref="/stores"
              viewAllLabel="+ צפה בכל המנויות"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {similarStores.map(s => (
                <StoreCard key={s.id} store={s} size="sm" />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
