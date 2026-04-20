import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminGetFAQs } from '@/lib/db';

export default async function AdminFAQsPage() {
  const faqs = await adminGetFAQs();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">ניהול שאלות נפוצות</h1>
          <p className="text-muted-foreground text-sm mt-1">{faqs.length} שאלות במערכת</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/faqs/new"><Plus className="h-4 w-4" />הוסף שאלה</Link>
        </Button>
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b bg-muted/30 text-xs font-semibold text-muted-foreground">
          <div className="col-span-5">שאלה</div>
          <div className="col-span-3">חנות</div>
          <div className="col-span-2 text-center">סדר</div>
          <div className="col-span-2 text-center">פעולות</div>
        </div>
        <div className="divide-y">
          {faqs.map(faq => (
            <div key={faq.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-muted/20">
              <div className="col-span-5 text-sm font-medium line-clamp-2">{faq.question}</div>
              <div className="col-span-3 text-sm text-muted-foreground">
                {(faq as any).store?.name || 'כללי'}
              </div>
              <div className="col-span-2 text-center text-sm text-muted-foreground">{faq.display_order}</div>
              <div className="col-span-2 flex items-center justify-center gap-2">
                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                  <Link href={`/admin/faqs/${faq.id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link>
                </Button>
                <button className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
