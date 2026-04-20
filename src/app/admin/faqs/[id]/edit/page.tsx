import { notFound } from 'next/navigation';
import { FAQForm } from '@/components/admin/faq-form';
import { adminGetFAQs, adminGetStores } from '@/lib/db';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function EditFAQPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [faqs, stores] = await Promise.all([adminGetFAQs(), adminGetStores()]);
  const faq = faqs.find(f => f.id === id);
  if (!faq) notFound();

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/faqs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-3.5 w-3.5" />שאלות נפוצות
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">עריכה</span>
      </div>
      <h1 className="text-2xl font-black mb-6">עריכת שאלה נפוצה</h1>
      <FAQForm faq={faq} stores={stores} />
    </div>
  );
}
