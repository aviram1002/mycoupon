export const dynamic = 'force-dynamic';
import { getSupabaseServerClient } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function CategoriesPage() {
  const db = getSupabaseServerClient();
  const { data: categories } = await db.from('categories').select('*').order('display_order');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">ניהול קטגוריות</h1>
          <p className="text-muted-foreground text-sm mt-1">{categories?.length || 0} קטגוריות</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new" className="gap-2 flex items-center">
            <Plus className="h-4 w-4" /> קטגוריה חדשה
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="text-right px-4 py-3 font-semibold">אייקון</th>
              <th className="text-right px-4 py-3 font-semibold">שם</th>
              <th className="text-right px-4 py-3 font-semibold">Slug</th>
              <th className="text-right px-4 py-3 font-semibold">סדר</th>
              <th className="text-right px-4 py-3 font-semibold">סטטוס</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories?.map(cat => (
              <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-2xl">{cat.icon}</td>
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{cat.display_order}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.is_active ? 'פעיל' : 'לא פעיל'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/categories/${cat.id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
