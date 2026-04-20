import { StoreForm } from '@/components/admin/store-form';
import { getCategories } from '@/lib/db';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NewStorePage() {
  const categories = await getCategories();
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/stores" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" />
          חנויות
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">חנות חדשה</span>
      </div>
      <h1 className="text-2xl font-black mb-6">הוסף חנות חדשה</h1>
      <StoreForm categories={categories} />
    </div>
  );
}
