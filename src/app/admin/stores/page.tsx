import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminGetStores } from '@/lib/db';

export default async function AdminStoresPage() {
  const stores = await adminGetStores();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">ניהול חנויות</h1>
          <p className="text-muted-foreground text-sm mt-1">{stores.length} חנויות במערכת</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/stores/new"><Plus className="h-4 w-4" />הוסף חנות</Link>
        </Button>
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b bg-muted/30 text-xs font-semibold text-muted-foreground">
          <div className="col-span-4">חנות</div>
          <div className="col-span-2">קטגוריה</div>
          <div className="col-span-2 text-center">קופונים</div>
          <div className="col-span-2 text-center">מוצג</div>
          <div className="col-span-2 text-center">פעולות</div>
        </div>

        <div className="divide-y">
          {stores.map(store => (
            <div key={store.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted border overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {store.logo_url ? (
                    <Image src={store.logo_url} alt={store.name} width={40} height={40} className="object-contain" />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">{store.name[0]}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{store.name}</p>
                  <p className="text-xs text-muted-foreground">/store/{store.slug}</p>
                </div>
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">
                {store.category?.name || '—'}
              </div>
              <div className="col-span-2 text-center text-sm font-medium">{store.coupon_count}</div>
              <div className="col-span-2 flex justify-center">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${store.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {store.is_active ? 'פעיל' : 'מושבת'}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-2">
                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                  <Link href={`/admin/stores/${store.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <AdminDeleteStore storeId={store.id} storeName={store.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDeleteStore({ storeId, storeName }: { storeId: string; storeName: string }) {
  return (
    <form action={`/api/admin/stores/${storeId}/delete`} method="POST"
      onSubmit={(e) => { if (!confirm(`למחוק את ${storeName}?`)) e.preventDefault(); }}>
      <button type="submit" className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
