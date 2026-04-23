import { notFound } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import { CategoryForm } from '@/components/admin/category-form';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getSupabaseServerClient();
  const { data: category } = await db.from('categories').select('*').eq('id', id).single();
  if (!category) notFound();

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-black mb-6">עריכת {category.name}</h1>
      <CategoryForm category={category} />
    </div>
  );
}
