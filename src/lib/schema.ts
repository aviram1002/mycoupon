import type { Store, Coupon, FAQ } from '@/types';

export function generateStoreSchema(store: Store, faqs: FAQ[], siteUrl: string) {
  const schemas = [];

  // Organization schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: store.name,
    url: store.website_url,
    logo: store.logo_url,
    description: store.description,
  });

  // WebPage schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: store.seo_title || `קופונים ל-${store.name}`,
    description: store.seo_description || store.short_description,
    url: `${siteUrl}/store/${store.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ראשי', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'חנויות', item: `${siteUrl}/stores` },
        { '@type': 'ListItem', position: 3, name: store.name, item: `${siteUrl}/store/${store.slug}` },
      ],
    },
  });

  // FAQ schema
  if (faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return schemas;
}

export function generateCouponSchema(coupon: Coupon, siteUrl: string) {
  const store = coupon.store;
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: coupon.title,
    description: coupon.description,
    url: `${siteUrl}/coupon/${coupon.slug}`,
    seller: store ? {
      '@type': 'Organization',
      name: store.name,
      url: store.website_url,
    } : undefined,
    validThrough: coupon.expires_at,
    ...(coupon.discount_type === 'percent' && coupon.discount_value ? {
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceType: 'https://schema.org/SalePrice',
      },
    } : {}),
  };
}

export function generateSiteSchema(siteUrl: string, siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
