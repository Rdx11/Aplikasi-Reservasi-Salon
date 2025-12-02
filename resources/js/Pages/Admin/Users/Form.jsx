import { useForm } from '@inertiajs/react';
import { Button, Input, Textarea, Select } from '@/Components/UI';

export default function UserForm({ user, roles = [], onSuccess }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        password: '',
        password_confirmation: '',
        role: user?.roles?.[0]?.name || 'Customer',
        is_active: user?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (user) {
            put(`/admin/users/${user.id}`, { onSuccess });
        } else {
            post('/admin/users', { onSuccess });
        }
    };

    const roleOptions = roles.map((role) => ({
        value: role.name,
        label: role.name,
    }));

    return (
        <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Nama Lengkap"
                    placeholder="Nama user"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="No. Telepon"
                    placeholder="08xxxxxxxxxx"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    error={errors.phone}
                />

                <Select
                    label="Role"
                    options={roleOptions}
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value)}
                    error={errors.role}
                />
            </div>

            <Textarea
                label="Alamat"
                placeholder="Alamat lengkap..."
                rows={2}
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                error={errors.address}
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label={user ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
                    type="password"
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <Input
                    label="Konfirmasi Password"
                    type="password"
                    placeholder="••••••••"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                />
            </div>

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
                    {user ? 'Update' : 'Simpan'}
                </Button>
            </div>
        </form>
    );
}
