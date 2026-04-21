'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input } from '@/components/ui/form-elements';
import type { FAQ, Store } from '@/types';

interface FAQFormProps {
  faq?: FAQ;
  stores: Store[];
}

export function FAQForm({ faq, stores }: FAQFormProps) {
  const router = useRouter();
  const isEdit = !!faq;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    store_id: faq?.store_id || '',
    question: faq?.question || '',
    answer: faq?.answer || '',
    display_order: faq?.display_order ?? 0,
    is_active: faq?.is_active ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/faqs/${faq!.id}` : '/api/admin/faqs';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, store_id: form.store_id === 'none' ? null : form.store_id || null }),
      });
      if (!res.ok) throw new Error();
      toast.success(isEdit ? 'השאלה עודכנה' : 'השאלה נוצרה');
      router.push('/admin/faqs');
      router.refresh();
    } catch {
      toast.error('שגיאה בשמירה');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-card rounded-2xl border p-6 space-y-4">
        <div className="space-y-2">
          <Label>חנות (אופציונלי)</Label>
          <Select value={form.store_id} onValueChange={v => setForm(f => ({ ...f, store_id: v }))}>
            <SelectTrigger><SelectValue placeholder="שאלה כללית (לא מקושרת לחנות)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">כללי</SelectItem>
              {stores.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>שאלה *</Label>
          <Textarea rows={2} value={form.question} required
            onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>תשובה *</Label>
          <Textarea rows={5} value={form.answer} required
            onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>סדר תצוגה</Label>
          <Input type="number" value={form.display_order}
            onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>ביטול</Button>
        <Button type="submit" disabled={loading}>{loading ? 'שומר...' : isEdit ? 'שמור' : 'צור שאלה'}</Button>
      </div>
    </form>
  );
}
