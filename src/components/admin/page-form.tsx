'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label, Switch } from '@/components/ui/form-elements';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Link, Quote,
  AlignRight, AlignCenter, AlignLeft,
  Undo, Redo
} from 'lucide-react';

interface Page {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  is_published?: boolean;
}

type ToolbarButton = {
  icon: React.ReactNode;
  title: string;
  action: () => void;
  active?: boolean;
} | { separator: true };

export function PageForm({ page }: { page?: Page }) {
  const router = useRouter();
  const isEdit = !!page?.id;
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    seo_title: page?.seo_title || '',
    seo_description: page?.seo_description || '',
    is_published: page?.is_published ?? false,
  });

  useEffect(() => {
    if (editorRef.current && page?.content) {
      editorRef.current.innerHTML = page.content;
    }
  }, []);

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '').replace(/--+/g, '-');
  }

  function exec(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  function insertLink() {
    const url = prompt('הכנס כתובת URL:');
    if (url) exec('createLink', url);
  }

  const toolbar: ToolbarButton[] = [
    { icon: <Undo className="h-4 w-4" />, title: 'בטל', action: () => exec('undo') },
    { icon: <Redo className="h-4 w-4" />, title: 'חזור', action: () => exec('redo') },
    { separator: true },
    { icon: <Heading1 className="h-4 w-4" />, title: 'כותרת 1', action: () => exec('formatBlock', 'h1') },
    { icon: <Heading2 className="h-4 w-4" />, title: 'כותרת 2', action: () => exec('formatBlock', 'h2') },
    { icon: <Heading3 className="h-4 w-4" />, title: 'כותרת 3', action: () => exec('formatBlock', 'h3') },
    { separator: true },
    { icon: <Bold className="h-4 w-4" />, title: 'מודגש', action: () => exec('bold') },
    { icon: <Italic className="h-4 w-4" />, title: 'נטוי', action: () => exec('italic') },
    { icon: <Underline className="h-4 w-4" />, title: 'קו תחתון', action: () => exec('underline') },
    { icon: <Strikethrough className="h-4 w-4" />, title: 'קו חוצה', action: () => exec('strikeThrough') },
    { separator: true },
    { icon: <List className="h-4 w-4" />, title: 'רשימה', action: () => exec('insertUnorderedList') },
    { icon: <ListOrdered className="h-4 w-4" />, title: 'רשימה ממוספרת', action: () => exec('insertOrderedList') },
    { icon: <Quote className="h-4 w-4" />, title: 'ציטוט', action: () => exec('formatBlock', 'blockquote') },
    { icon: <Link className="h-4 w-4" />, title: 'קישור', action: insertLink },
    { separator: true },
    { icon: <AlignRight className="h-4 w-4" />, title: 'יישור ימין', action: () => exec('justifyRight') },
    { icon: <AlignCenter className="h-4 w-4" />, title: 'מרכז', action: () => exec('justifyCenter') },
    { icon: <AlignLeft className="h-4 w-4" />, title: 'יישור שמאל', action: () => exec('justifyLeft') },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const content = editorRef.current?.innerHTML || '';
      const url = isEdit ? `/api/admin/pages/${page!.id}` : '/api/admin/pages';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, content }),
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
      {/* תוכן */}
      <div className="bg-card rounded-2xl border p-6 space-y-4">
        <h2 className="font-bold">תוכן הדף</h2>

        <div className="space-y-2">
          <Label>כותרת *</Label>
          <Input value={form.title} required
            onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: !isEdit ? autoSlug(e.target.value) : f.slug }))} />
        </div>

        <div className="space-y-2">
          <Label>כתובת URL *</Label>
          <Input value={form.slug} required dir="ltr" placeholder="about / blog / contact"
            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
          <p className="text-xs text-muted-foreground">הדף יהיה זמין בכתובת: /{form.slug}</p>
        </div>

        {/* Editor */}
        <div className="space-y-1">
          <Label>תוכן</Label>
          <div className="border border-border rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/30">
              {toolbar.map((btn, i) => {
                if ('separator' in btn) {
                  return <div key={i} className="w-px h-5 bg-border mx-1" />;
                }
                return (
                  <button
                    key={i}
                    type="button"
                    title={btn.title}
                    onMouseDown={e => { e.preventDefault(); btn.action(); }}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {btn.icon}
                  </button>
                );
              })}
            </div>

            {/* Editable area */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              dir="rtl"
              className="min-h-64 p-4 text-sm leading-relaxed focus:outline-none prose prose-sm max-w-none"
              style={{ direction: 'rtl' }}
              data-placeholder="התחל לכתוב את תוכן הדף כאן..."
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-card rounded-2xl border p-6 space-y-4">
        <h2 className="font-bold">SEO</h2>
        <div className="space-y-2">
          <Label>כותרת SEO</Label>
          <Input value={form.seo_title} onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>תיאור Meta</Label>
          <Textarea value={form.seo_description} rows={3}
            onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} />
        </div>
      </div>

      {/* פרסום */}
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
