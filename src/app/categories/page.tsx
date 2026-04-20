import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionTitle } from '@/components/layout/section-title';
import { getCategories } from '@/lib/db';

export const metadata: Metadata = {
  title: 'קטגוריות - מצאו קופונים לפי תחום',
  description: 'חפשו קופונים לפי קטגוריה: אופנה, אלקטרוניקה, אוכל, טיולים ועוד.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container py-8">
      <SectionTitle title="כל הקטגוריות" subtitle="בחרו תחום ומצאו קופונים מותאמים אישית" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center p-6 bg-card rounded-2xl border hover:border-brand/30 hover:shadow-md transition-all hover:-translate-y-0.5 group text-center"
          >
            <span className="text-4xl mb-3">{cat.icon}</span>
            <span className="text-sm font-bold group-hover:text-brand transition-colors">{cat.name}</span>
            {cat.description && (
              <span className="text-xs text-muted-foreground mt-1 leading-relaxed">{cat.description}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
