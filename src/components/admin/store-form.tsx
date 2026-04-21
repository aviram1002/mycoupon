'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label, Switch } from '@/components/ui/form-elements';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/form-elements';
import type { Store, Category } from '@/types';

interface FAQ { id?: string; question: string; answer: string; display_order: number; }

interface StoreFormProps {
  store?: Store;
  categories: Category[];
  initialFaqs?: FAQ[];
}

export function StoreForm({ store, categories, initialFaqs = [] }: StoreFormProps) {
  const router = useRouter();
  const isEdit = !!store;
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs.length > 0 ? initialFaqs : []);

  const [form, setForm] = useState({
    name: store?.name || '',
    slug: store?.slug || '',
    logo_url: store?.logo_url || '',
    website_url: store?.website_url || '',
    affiliate_url: store?.affiliate_url || '',
    description: store?.description || '',
    short_description: store?.short_description || '',
    seo_title: store?.seo_title || '',
    seo_description: store?.seo_description || '',
    category_id: store?.category_id || '',
    is_featured: store?.is_featured ?? false,
    is_active: store?.is_active ?? true,
    display_order: store?.display_order ?? 0,
  });

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '').replace(/--+/g, '-');
  }

  function addFaq() {
    setFaqs(f => [...f, { question: '', answer: '', display_order: f.length }]);
  }

  function removeFaq(i: number) {
    setFaqs(f => f.filter((_, idx) => idx !== i));
  }

  function updateFaq(i: number, field: 'question' | 'answer', value: string) {
    setFaqs(f => f.map((faq, idx) => idx === i ? { ...faq, [field]: value } : faq));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Save store
      const url = isEdit ? `/api/admin/stores/${store!.id}` : '/api/admin/stores';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const savedStore = await res.json();
      const storeId = savedStore.id;

      // Save FAQs
      if (faqs.length > 0) {
        await fetch('/api/admin/faqs/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            store_id: storeId,
            faqs: faqs.filter(f => f.question && f.answer).map((f, i) => ({
              ...f,
              store_id: storeId,
              display_order: i,
              is_active: true,
            })),
          }),
        });
      }

      toast.success(isEdit ? 'החנות עודכנה בהצלחה' : 'החנות נוצרה בהצלחה');
      router.push('/admin/stores');
      router.refresh();
    } catch {
      toast.error('שגיאה בשמירה');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* פרטים בסיסיים */}
      <div className="bg-card rounded-2xl border p-6">
        <h2 className="font-bold mb-4">פרטים בסיסיים</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם החנות *</Label>
            <Input id="name" value={form.name} required
              onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: !isEdit ? autoSlug(e.target.value) : f.slug }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" value={form.slug} required onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website_url">כתובת האתר</Label>
            <Input id="website_url" type="url" value={form.website_url} onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="affiliate_url">לינק אפיליאציה</Label>
            <Input id="affiliate_url" type="url" value={form.affiliate_url} onChange={e => setForm(f => ({ ...f, affiliate_url: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_url">URL לוגו</Label>
            <Input id="logo_url" type="url" value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category_id">קטגוריה</Label>
            <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
              <SelectTrigger><SelectValue placeholder="בחר קטגוריה" /></SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="short_description">תיאור קצר</Label>
            <Input id="short_description" value={form.short_description} onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">תיאור מלא</Label>
            <Textarea id="description" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-card rounded-2xl border p-6">
        <h2 className="font-bold mb-4">SEO</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo_title">SEO Title</Label>
            <Input id="seo_title" value={form.seo_title} onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_description">Meta Description</Label>
            <Textarea id="seo_description" rows={3} value={form.seo_description} onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* שאלות ותשובות */}
      <div className="bg-card rounded-2xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold">שאלות ותשובות</h2>
            <p className="text-xs text-muted-foreground mt-0.5">יוצגו בדף החנות עם סכמת FAQ לגוגל</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addFaq} className="gap-1">
            <Plus className="h-3.5 w-3.5" />
            הוסף שאלה
          </Button>
        </div>

        {faqs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">אין שאלות עדיין — לחץ "הוסף שאלה"</p>
        )}

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-3 relative">
              <button
                type="button"
                onClick={() => removeFaq(i)}
                className="absolute left-3 top-3 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="space-y-2">
                <Label>שאלה {i + 1}</Label>
                <Input
                  value={faq.question}
                  placeholder="מה שעות הפעילות?"
                  onChange={e => updateFaq(i, 'question', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>תשובה</Label>
                <Textarea
                  rows={2}
                  value={faq.answer}
                  placeholder="הזן תשובה..."
                  onChange={e => updateFaq(i, 'answer', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* הגדרות תצוגה */}
      <div className="bg-card rounded-2xl border p-6">
        <h2 className="font-bold mb-4">הגדרות תצוגה</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>חנות פעילה</Label>
              <p className="text-xs text-muted-foreground mt-0.5">הצג חנות זו באתר</p>
            </div>
            <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>חנות מובחרת</Label>
              <p className="text-xs text-muted-foreground mt-0.5">הצג בדף הבית</p>
            </div>
            <Switch checked={form.is_featured} onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="display_order">סדר תצוגה</Label>
            <Input id="display_order" type="number" value={form.display_order}
              onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>ביטול</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'שומר...' : isEdit ? 'שמור שינויים' : 'צור חנות'}
        </Button>
      </div>
    </form>
  );
}