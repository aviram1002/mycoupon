export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = getSupabaseServerClient();
  const { data } = await db.from('pages').select('title, seo_title, seo_description').eq('slug', slug).eq('is_published', true).single();
  if (!data) return {};
  return { title: data.seo_title || data.title, description: data.seo_description || '' };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reserved = ['admin', 'api', 'stores', 'coupons', 'categories', 'store', 'coupon', 'category', 'search'];
  if (reserved.includes(slug)) notFound();

  const db = getSupabaseServerClient();
  const { data: page } = await db.from('pages').select('*').eq('slug', slug).eq('is_published', true).single();
  if (!page) notFound();

  return (
    <div className="container max-w-3xl py-12 px-4">
      <h1 className="text-3xl font-black mb-8">{page.title}</h1>
      <div
        className="prose prose-sm max-w-none text-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: page.content || '' }}
      />
    </div>
  );
}
