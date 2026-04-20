import { notFound } from 'next/navigation';
import { StoreForm } from '@/components/admin/store-form';
import { adminGetStores, getCategories } from '@/lib/db';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [stores, categories] = await Promise.all([adminGetStores(), getCategories()]);
  const store = stores.find(s => s.id === id);
  if (!store) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/stores" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" />
          חנויות
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{store.name}</span>
      </div>
      <h1 className="text-2xl font-black mb-6">עריכת {store.name}</h1>
      <StoreForm store={store} categories={categories} />
    </div>
  );
}
