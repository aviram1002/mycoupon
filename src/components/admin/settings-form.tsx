'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label } from '@/components/ui/form-elements';
import type { Setting } from '@/types';

interface AdminSettingsFormProps {
  settings: Setting[];
}

export function AdminSettingsForm({ settings }: AdminSettingsFormProps) {
  const toMap = (arr: Setting[]) =>
    Object.fromEntries(arr.map(s => [s.key, s.value || '']));

  const [form, setForm] = useState(toMap(settings));
  const [loading, setLoading] = useState(false);

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success('ההגדרות נשמרו בהצלחה');
    } catch {
      toast.error('שגיאה בשמירת ההגדרות');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile */}
      <div className="bg-card rounded-2xl border p-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2">👤 הגדרות פרופיל</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>שם מלא</Label>
            <Input value={form.admin_name || ''} onChange={e => set('admin_name', e.target.value)} placeholder="שם מנהל" />
          </div>
          <div className="space-y-2">
            <Label>אימייל להתחברות</Label>
            <Input type="email" value={form.admin_email || ''} onChange={e => set('admin_email', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Site */}
      <div className="bg-card rounded-2xl border p-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2">🌐 הגדרות אתר כלליות</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>שם האתר (SEO Title)</Label>
            <Input value={form.site_name || ''} onChange={e => set('site_name', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>אימייל ליצירת קשר</Label>
            <Input type="email" value={form.contact_email || ''} onChange={e => set('contact_email', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>תיאור SEO (Meta Description)</Label>
            <Textarea rows={3} value={form.site_description || ''} onChange={e => set('site_description', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>כותרת גיבור</Label>
            <Input value={form.hero_title || ''} onChange={e => set('hero_title', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>תת-כותרת גיבור</Label>
            <Textarea rows={2} value={form.hero_subtitle || ''} onChange={e => set('hero_subtitle', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-card rounded-2xl border p-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2">📱 רשתות חברתיות</h2>
        <div className="space-y-4">
          {[
            { key: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
            { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
            { key: 'twitter_url', label: 'Twitter/X', placeholder: 'https://twitter.com/yourprofile' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              <Input type="url" value={form[key] || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? 'שומר...' : '💾 שמור שינויים'}
        </Button>
      </div>
    </form>
  );
}
