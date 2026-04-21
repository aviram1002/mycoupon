'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@/components/ui/form-elements';
import type { Coupon, Store } from '@/types';

interface CouponFormProps {
  coupon?: Coupon;
  stores: Store[];
}

export function CouponForm({ coupon, stores }: CouponFormProps) {
  const router = useRouter();
  const isEdit = !!coupon;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    store_id: coupon?.store_id || '',
    title: coupon?.title || '',
    slug: coupon?.slug || '',
    description: coupon?.description || '',
    code: coupon?.code || '',
    affiliate_url: coupon?.affiliate_url || '',
    image_url: coupon?.image_url || '',
    discount_type: coupon?.discount_type || 'percent',
    discount_value: coupon?.discount_value?.toString() || '',
    discount_label: coupon?.discount_label || '',
    coupon_type: coupon?.coupon_type || 'code',
    badge: coupon?.badge || '',
    is_featured: coupon?.is_featured ?? false,
    is_active: coupon?.is_active ?? true,
    expires_at: coupon?.expires_at ? coupon.expires_at.split('T')[0] : '',
  });

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '').replace(/--+/g, '-').substring(0, 60);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        discount_value: form.discount_value ? parseFloat(form.discount_value) : null,
        badge: form.badge === 'none' ? null : form.badge || null,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      };
      const url = isEdit ? `/api/admin/coupons/${coupon!.id}` : '/api/admin/coupons';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(isEdit ? 'הקופון עודכן בהצלחה' : 'הקופון נוצר בהצלחה');
      router.push('/admin/coupons');
      router.refresh();
    } catch {
      toast.error('שגיאה בשמירה');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card rounded-2xl border p-6">
        <h2 className="font-bold mb-4">פרטי קופון</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>חנות *</Label>
            <Select value={form.store_id} onValueChange={v => setForm(f => ({ ...f, store_id: v }))}>
              <SelectTrigger><SelectValue placeholder="בחר חנות" /></SelectTrigger>
              <SelectContent>
                {stores.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>סוג קופון</Label>
            <Select value={form.coupon_type} onValueChange={v => setForm(f => ({ ...f, coupon_type: v as 'code' | 'deal' | 'free_shipping' }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="code">קוד קופון</SelectItem>
                <SelectItem value="deal">דיל</SelectItem>
                <SelectItem value="free_shipping">משלוח חינם</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>כותרת *</Label>
            <Input value={form.title} required
              onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: !isEdit ? autoSlug(e.target.value) : f.slug }))} />
          </div>
          <div className="space-y-2">
            <Label>Slug *</Label>
            <Input value={form.slug} required onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>קוד קופון</Label>
            <Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="GAME15" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>תיאור</Label>
            <Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>לינק אפיליאציה</Label>
            <Input type="url" value={form.affiliate_url} onChange={e => setForm(f => ({ ...f, affiliate_url: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>URL תמונה</Label>
            <Input type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border p-6">
        <h2 className="font-bold mb-4">הנחה</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>סוג הנחה</Label>
            <Select value={form.discount_type} onValueChange={v => setForm(f => ({ ...f, discount_type: v as 'percent'|'fixed'|'free_shipping'|'gift'|'other' }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">אחוזים</SelectItem>
                <SelectItem value="fixed">סכום קבוע</SelectItem>
                <SelectItem value="free_shipping">משלוח חינם</SelectItem>
                <SelectItem value="gift">מתנה</SelectItem>
                <SelectItem value="other">אחר</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>ערך הנחה</Label>
            <Input type="number" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))} placeholder="15" />
          </div>
          <div className="space-y-2">
            <Label>תווית הנחה</Label>
            <Input value={form.discount_label} onChange={e => setForm(f => ({ ...f, discount_label: e.target.value }))} placeholder="15% OFF" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border p-6">
        <h2 className="font-bold mb-4">הגדרות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>תג</Label>
            <Select value={form.badge} onValueChange={v => setForm(f => ({ ...f, badge: v }))}>
              <SelectTrigger><SelectValue placeholder="ללא תג" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">ללא תג</SelectItem>
                <SelectItem value="exclusive">בלעדי</SelectItem>
                <SelectItem value="verified">מאומת</SelectItem>
                <SelectItem value="popular">פופולרי</SelectItem>
                <SelectItem value="new">חדש</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>תאריך תפוגה</Label>
            <Input type="date" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>קופון פעיל</Label>
            <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>קופון מובחר</Label>
            <Switch checked={form.is_featured} onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>ביטול</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'שומר...' : isEdit ? 'שמור שינויים' : 'צור קופון'}
        </Button>
      </div>
    </form>
  );
}
