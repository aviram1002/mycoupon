'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label, Switch } from '@/components/ui/form-elements';

interface Category {
  id?: string;
  name?: string;
  slug?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const isEdit = !!category?.id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    icon: category?.icon || '🏷️',
    display_order: category?.display_order ?? 0,
    is_active: category?.is_active ?? true,
  });

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '').replace(/--+/g, '-');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/categories/${category!.id}` : '/api/admin/categories';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(isEdit ? 'הקטגוריה עודכנה' : 'הקטגוריה נוצרה');
      router.push('/admin/categories');
      router.refresh();
    } catch {
      toast.error('שגיאה בשמירה');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-2xl border p-6">
      <div className="space-y-2">
        <Label>שם הקטגוריה *</Label>
        <Input value={form.name} required
          onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: !isEdit ? autoSlug(e.target.value) : f.slug }))} />
      </div>
      <div className="space-y-2">
        <Label>Slug *</Label>
        <Input value={form.slug} required onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>אייקון (אמוג׳י)</Label>
        <Input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🏷️" />
      </div>
      <div className="space-y-2">
        <Label>סדר תצוגה</Label>
        <Input type="number" value={form.display_order}
          onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
      </div>
      <div className="flex items-center justify-between">
        <Label>פעיל</Label>
        <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>ביטול</Button>
        <Button type="submit" disabled={loading}>{loading ? 'שומר...' : isEdit ? 'שמור' : 'צור קטגוריה'}</Button>
      </div>
    </form>
  );
}
