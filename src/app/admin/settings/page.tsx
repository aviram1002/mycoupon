import { adminGetSettings } from '@/lib/db';
import { AdminSettingsForm } from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
  const settings = await adminGetSettings();
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black">הגדרות מערכת</h1>
        <p className="text-muted-foreground text-sm mt-1">נהל את הגדרות הפרופיל, תצורת האתר וחיבורים חברתיים.</p>
      </div>
      <AdminSettingsForm settings={settings} />
    </div>
  );
}
