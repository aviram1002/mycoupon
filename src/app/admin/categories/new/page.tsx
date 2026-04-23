import { CategoryForm } from '@/components/admin/category-form';

export default function NewCategoryPage() {
  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-black mb-6">קטגוריה חדשה</h1>
      <CategoryForm />
    </div>
  );
}
