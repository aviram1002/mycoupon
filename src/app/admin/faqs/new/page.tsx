import { FAQForm } from '@/components/admin/faq-form';
import { adminGetStores } from '@/lib/db';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NewFAQPage() {
  const stores = await adminGetStores();
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/faqs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-3.5 w-3.5" />שאלות נפוצות
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">שאלה חדשה</span>
      </div>
      <h1 className="text-2xl font-black mb-6">הוסף שאלה נפוצה</h1>
      <FAQForm stores={stores} />
    </div>
  );
}
