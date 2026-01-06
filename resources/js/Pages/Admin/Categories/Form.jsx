import { useForm } from '@inertiajs/react';
import { Button, Input, Textarea } from '@/Components/UI';

export default function CategoryForm({ category, onSuccess }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        description: category?.description || '',
        icon: category?.icon || '',
        is_active: category?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (category) {
            put(`/admin/categories/${category.id_category}`, { onSuccess });
        } else {
            post('/admin/categories', { onSuccess });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            <Input
                label="Nama Kategori"
                placeholder="Contoh: Perawatan Rambut"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                error={errors.name}
            />

            <Textarea
                label="Deskripsi"
                placeholder="Deskripsi kategori..."
                rows={3}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                error={errors.description}
            />

            <Input
                label="Icon (opsional)"
                placeholder="Nama icon"
                value={data.icon}
                onChange={(e) => setData('icon', e.target.value)}
                error={errors.icon}
            />

            <label className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>

            <div className="flex gap-3 pt-4">
                <Button type="submit" loading={processing} className="flex-1">
                    {category ? 'Update' : 'Simpan'}
                </Button>
            </div>
        </form>
    );
}
