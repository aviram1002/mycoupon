export const dynamic = 'force-dynamic';
import { getSupabaseServerClient } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Pencil, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function PagesAdminPage() {
  const db = getSupabaseServerClient();
  const { data: pages } = await db.from('pages').select('*').order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">ניהול דפים</h1>
          <p className="text-muted-foreground text-sm mt-1">{pages?.length || 0} דפים</p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new" className="gap-2 flex items-center">
            <Plus className="h-4 w-4" /> דף חדש
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        {(!pages || pages.length === 0) && (
          <p className="text-center text-muted-foreground py-12 text-sm">אין דפים עדיין — לחץ "דף חדש"</p>
        )}
        <table className="w-full text-sm">
          {pages && pages.length > 0 && (
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="text-right px-4 py-3 font-semibold">כותרת</th>
                <th className="text-right px-4 py-3 font-semibold">Slug (כתובת)</th>
                <th className="text-right px-4 py-3 font-semibold">סטטוס</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
          )}
          <tbody>
            {pages?.map(page => (
              <tr key={page.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium">{page.title}</td>
                <td className="px-4 py-3 text-muted-foreground">/{page.slug}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${page.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {page.is_published ? 'מפורסם' : 'טיוטה'}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center gap-2 justify-end">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/${page.slug}`} target="_blank"><ExternalLink className="h-3.5 w-3.5" /></Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/pages/${page.id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link>
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
