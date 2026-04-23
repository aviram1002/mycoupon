export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import { PageForm } from '@/components/admin/page-form';

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getSupabaseServerClient();
  const { data: page } = await db.from('pages').select('*').eq('id', id).single();
  if (!page) notFound();
  return <div className="p-8 max-w-3xl"><h1 className="text-2xl font-black mb-6">עריכת {page.title}</h1><PageForm page={page} /></div>;
}
