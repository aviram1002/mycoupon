import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, ExternalLink, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { CouponGrid } from '@/components/coupons/coupon-grid';
import { getCouponBySlug, getCoupons, getAllCouponSlugs } from '@/lib/db';
import { generateCouponSchema } from '@/lib/schema';
import {
  getDiscountDisplay, getCouponAffiliateUrl, getCouponImageUrl,
  getBadgeLabel, getBadgeColor, formatDate, isExpired, isExpiringSoon,
} from '@/lib/utils';

interface CouponPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCouponSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: CouponPageProps): Promise<Metadata> {
  const { slug } = await params;
  const coupon = await getCouponBySlug(slug);
  if (!coupon) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  return {
    title: `${coupon.title} | ${coupon.store?.name || ''}`,
    description: coupon.description || `השתמשו בקוד ${coupon.code || ''} לקבלת ${getDiscountDisplay(coupon)} ב-${coupon.store?.name || ''}`,
    alternates: { canonical: `${siteUrl}/coupon/${slug}` },
  };
}

export default async function CouponPage({ params }: CouponPageProps) {
  const { slug } = await params;
  const coupon = await getCouponBySlug(slug);
  if (!coupon) notFound();

  const store = coupon.store;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const schema = generateCouponSchema(coupon, siteUrl);
  const discountDisplay = getDiscountDisplay(coupon);
  const affiliateUrl = getCouponAffiliateUrl(coupon, store);
  const imageUrl = getCouponImageUrl(coupon, store);
  const expired = isExpired(coupon.expires_at);
  const expiringSoon = isExpiringSoon(coupon.expires_at);

  // Related coupons from same store
  const relatedCoupons = store
    ? await getCoupons({ storeId: store.id, limit: 6 })
    : [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="container py-6">
        <Breadcrumbs
          items={[
            { label: 'ראשי', href: '/' },
            ...(store ? [{ label: store.name, href: `/store/${store.slug}` }] : []),
            { label: coupon.title },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Coupon Hero */}
            <div className="bg-card rounded-2xl border overflow-hidden">
              {/* Image */}
              <div className="relative h-48 bg-muted">
                <Image src={imageUrl} alt={coupon.title} fill className="object-cover" />
                {coupon.badge && (
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm ${getBadgeColor(coupon.badge)}`}>
                      {getBadgeLabel(coupon.badge)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                {store && (
                  <Link href={`/store/${store.slug}`} className="flex items-center gap-2 mb-4 group">
                    {store.logo_url && (
                      <Image src={store.logo_url} alt={store.name} width={28} height={28} className="rounded-lg" />
                    )}
                    <span className="text-sm text-muted-foreground group-hover:text-brand transition-colors font-medium">
                      {store.name}
                    </span>
                    <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )}

                <h1 className="text-2xl font-black mb-2">{coupon.title}</h1>
                {coupon.description && (
                  <p className="text-muted-foreground leading-relaxed mb-4">{coupon.description}</p>
                )}

                {/* Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  {coupon.expires_at && (
                    <span className={`flex items-center gap-1.5 ${expiringSoon ? 'text-amber-600 font-medium' : ''} ${expired ? 'text-red-500' : ''}`}>
                      <Clock className="h-4 w-4" />
                      {expired ? 'הקופון פג תוקף' : `בתוקף עד: ${formatDate(coupon.expires_at)}`}
                    </span>
                  )}
                  {coupon.uses_count > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {coupon.uses_count.toLocaleString('he-IL')} פעמים נוצל
                    </span>
                  )}
                  {coupon.last_verified_at && (
                    <span className="flex items-center gap-1.5 text-green-600">
                      <ShieldCheck className="h-4 w-4" />
                      נבדק: {formatDate(coupon.last_verified_at)}
                    </span>
                  )}
                </div>

                {/* Code */}
                {coupon.code && !expired && (
                  <div className="border-2 border-dashed border-brand/30 rounded-2xl bg-brand-50 p-4 mb-4">
                    <p className="text-xs text-center text-muted-foreground mb-2">קוד הקופון:</p>
                    <p className="text-2xl font-mono font-black text-center tracking-widest text-foreground select-all">
                      {coupon.code}
                    </p>
                  </div>
                )}

                {/* CTA */}
                {!expired && (
                  <Button asChild size="lg" className="w-full gap-2 h-12 text-base font-bold rounded-2xl">
                    <a href={affiliateUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      מעבר לחנות למימוש ההנחה
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-1">
            {/* Discount Highlight */}
            {discountDisplay && (
              <div className="bg-brand rounded-2xl p-6 text-white text-center mb-4">
                <p className="text-sm font-medium opacity-80 mb-1">ההנחה שלך</p>
                <p className="text-4xl font-black">{discountDisplay}</p>
              </div>
            )}

            {store && (
              <div className="bg-card rounded-2xl border p-4">
                <p className="text-sm font-semibold mb-3">אודות החנות</p>
                <Link href={`/store/${store.slug}`} className="flex items-center gap-3 group">
                  <div className="w-12 h-12 rounded-xl bg-muted border flex items-center justify-center overflow-hidden flex-shrink-0">
                    {store.logo_url ? (
                      <Image src={store.logo_url} alt={store.name} width={48} height={48} className="object-contain" />
                    ) : (
                      <span className="font-bold text-muted-foreground">{store.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm group-hover:text-brand transition-colors">{store.name}</p>
                    <p className="text-xs text-muted-foreground">{store.coupon_count} קופונים</p>
                  </div>
                </Link>
                <Button asChild variant="outline" size="sm" className="w-full mt-3">
                  <Link href={`/store/${store.slug}`}>כל הקופונים של {store.name}</Link>
                </Button>
              </div>
            )}
          </aside>
        </div>

        {/* Related Coupons */}
        {relatedCoupons.length > 1 && (
          <section className="mt-12">
            <h2 className="text-xl font-black mb-6">קופונים נוספים מ-{store?.name}</h2>
            <CouponGrid coupons={relatedCoupons.filter(c => c.id !== coupon.id).slice(0, 3)} />
          </section>
        )}
      </div>
    </>
  );
}
