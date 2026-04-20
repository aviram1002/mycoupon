import { MetadataRoute } from 'next';
import { getAllStoreSlugs, getAllCouponSlugs, getCategories } from '@/lib/db';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mycoupon.co.il';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [storeSlugs, couponSlugs, categories] = await Promise.all([
    getAllStoreSlugs(),
    getAllCouponSlugs(),
    getCategories(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/stores`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/coupons`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const storePages: MetadataRoute.Sitemap = storeSlugs.map(slug => ({
    url: `${siteUrl}/store/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const couponPages: MetadataRoute.Sitemap = couponSlugs.map(slug => ({
    url: `${siteUrl}/coupon/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...storePages, ...couponPages, ...categoryPages];
}
