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
  Undo, Redo, Type
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

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 28, 32, 36];

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

  function insertHeading(tag: string, size: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const el = document.createElement(tag);
    el.style.fontSize = size;
    el.style.fontWeight = 'bold';
    el.style.margin = '8px 0';
    if (selection.toString()) {
      el.appendChild(range.extractContents());
    } else {
      el.innerHTML = '&nbsp;';
    }
    range.deleteContents();
    range.insertNode(el);
    // Move cursor after element
    range.setStartAfter(el);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    editorRef.current?.focus();
  }

  function setFontSize(size: string) {
    exec('fontSize', '7');
    const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
    fontElements?.forEach(el => {
      (el as HTMLElement).removeAttribute('size');
      (el as HTMLElement).style.fontSize = size + 'px';
    });
    editorRef.current?.focus();
  }

  function insertLink() {
    const url = prompt('הכנס כתובת URL:');
    if (url) exec('createLink', url);
  }

  type ToolbarItem =
    | { icon: React.ReactNode; title: string; action: () => void }
    | { separator: true }
    | { fontSize: true };

  const toolbar: ToolbarItem[] = [
    { icon: <Undo className="h-4 w-4" />, title: 'בטל', action: () => exec('undo') },
    { icon: <Redo className="h-4 w-4" />, title: 'חזור', action: () => exec('redo') },
    { separator: true },
    { icon: <span className="text-xs font-bold">H1</span>, title: 'כותרת 1 (25px)', action: () => insertHeading('h1', '25px') },
    { icon: <span className="text-xs font-bold">H2</span>, title: 'כותרת 2 (22px)', action: () => insertHeading('h2', '22px') },
    { icon: <span className="text-xs font-bold">H3</span>, title: 'כותרת 3 (21px)', action: () => insertHeading('h3', '21px') },
    { separator: true },
    { fontSize: true },
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
    { icon: <AlignRight className="h-4 w-4" />, title: 'ימין', action: () => exec('justifyRight') },
    { icon: <AlignCenter className="h-4 w-4" />, title: 'מרכז', action: () => exec('justifyCenter') },
    { icon: <AlignLeft className="h-4 w-4" />, title: 'שמאל', action: () => exec('justifyLeft') },
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

        <div className="space-y-1">
          <Label>תוכן</Label>
          <div className="border border-border rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/30">
              {toolbar.map((item, i) => {
                if ('separator' in item) {
                  return <div key={i} className="w-px h-5 bg-border mx-1" />;
                }
                if ('fontSize' in item) {
                  return (
                    <select
                      key={i}
                      title="גודל פונט"
                      onMouseDown={e => e.preventDefault()}
                      onChange={e => { setFontSize(e.target.value); e.target.value = ''; }}
                      className="h-7 px-1 text-xs rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <option value="">גודל</option>
                      {FONT_SIZES.map(s => (
                        <option key={s} value={s}>{s}px</option>
                      ))}
                    </select>
                  );
                }
                return (
                  <button
                    key={i}
                    type="button"
                    title={item.title}
                    onMouseDown={e => { e.preventDefault(); item.action(); }}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors min-w-[28px] flex items-center justify-center"
                  >
                    {item.icon}
                  </button>
                );
              })}
            </div>

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              dir="rtl"
              className="min-h-72 p-4 text-sm leading-relaxed focus:outline-none"
              style={{ direction: 'rtl' }}
            />
          </div>
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
          <Textarea value={form.seo_description} rows={3}
            onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} />
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
