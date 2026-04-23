'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label, Switch } from '@/components/ui/form-elements';

interface Page {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  is_published?: boolean;
}

export function PageForm({ page }: { page?: Page }) {
  const router = useRouter();
  const isEdit = !!page?.id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    seo_title: page?.seo_title || '',
    seo_description: page?.seo_description || '',
    is_published: page?.is_published ?? false,
  });

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '').replace(/--+/g, '-');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/pages/${page!.id}` : '/api/admin/pages';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(isEdit ? 'הדף עודכן' : 'הדף נוצר');
      router.push('/admin/pages');
      router.refresh();
    } catch {
      toast.error('שגיאה בשמירה');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card rounded-2xl border p-6 space-y-4">
        <h2 className="font-bold">תוכן הדף</h2>
        <div className="space-y-2">
          <Label>כותרת *</Label>
          <Input value={form.title} required
            onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: !isEdit ? autoSlug(e.target.value) : f.slug }))} />
        </div>
        <div className="space-y-2">
          <Label>כתובת URL (slug) *</Label>
          <Input value={form.slug} required dir="ltr" placeholder="about / blog / contact"
            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
          <p className="text-xs text-muted-foreground">הדף יהיה זמין בכתובת: /{form.slug}</p>
        </div>
        <div className="space-y-2">
          <Label>תוכן (תומך HTML)</Label>
          <Textarea value={form.content} rows={12} dir="rtl"
            placeholder="<h2>כותרת</h2><p>טקסט...</p>"
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
        </div>
      </div>

      <div className="bg-card rounded-2xl border p-6 space-y-4">
        <h2 className="font-bold">SEO</h2>
        <div className="space-y-2">
          <Label>כותרת SEO</Label>
          <Input value={form.seo_title} onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>תיאור Meta</Label>
          <Textarea value={form.seo_description} rows={3} onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} />
        </div>
      </div>

      <div className="bg-card rounded-2xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>פרסם דף</Label>
            <p className="text-xs text-muted-foreground mt-0.5">דפים לא מפורסמים לא יהיו גלויים לציבור</p>
          </div>
          <Switch checked={form.is_published} onCheckedChange={v => setForm(f => ({ ...f, is_published: v }))} />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>ביטול</Button>
        <Button type="submit" disabled={loading}>{loading ? 'שומר...' : isEdit ? 'שמור שינויים' : 'צור דף'}</Button>
      </div>
    </form>
  );
}
