import { adminGetStores, adminGetCoupons } from '@/lib/db';
import { Store, Tag, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [stores, coupons] = await Promise.all([
    adminGetStores(),
    adminGetCoupons(),
  ]);

  const activeStores = stores.filter(s => s.is_active).length;
  const activeCoupons = coupons.filter(c => c.is_active).length;
  const featuredCoupons = coupons.filter(c => c.is_featured).length;

  const stats = [
    { label: 'חנויות פעילות', value: activeStores, icon: Store, color: 'bg-blue-50 text-blue-600', href: '/admin/stores' },
    { label: 'סה"כ קופונים', value: activeCoupons, icon: Tag, color: 'bg-green-50 text-green-600', href: '/admin/coupons' },
    { label: 'קופונים מובחרים', value: featuredCoupons, icon: TrendingUp, color: 'bg-purple-50 text-purple-600', href: '/admin/coupons' },
    { label: 'משתמשים', value: '—', icon: Users, color: 'bg-orange-50 text-orange-600', href: '/admin' },
  ];

  const recentCoupons = coupons.slice(0, 8);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black">סקירה כללית</h1>
        <p className="text-muted-foreground text-sm mt-1">ברוכים הבאים לממשק הניהול</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href}
            className="bg-card rounded-2xl border p-5 hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black group-hover:text-brand transition-colors">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Coupons */}
      <div className="bg-card rounded-2xl border">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold">קופונים אחרונים</h2>
          <Link href="/admin/coupons" className="text-sm text-brand hover:underline">צפה בהכל</Link>
        </div>
        <div className="divide-y">
          {recentCoupons.map(coupon => (
            <div key={coupon.id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{coupon.title}</p>
                <p className="text-xs text-muted-foreground">{coupon.store?.name}</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {coupon.is_active ? 'פעיל' : 'לא פעיל'}
              </span>
              <Link href={`/admin/coupons/${coupon.id}/edit`} className="text-xs text-brand hover:underline flex-shrink-0">
                ערוך
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
