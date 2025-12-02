import { router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button, Input, Textarea, Select } from '@/Components/UI';

export default function ServiceForm({ service, categories = [], onSuccess }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(service?.image_url || null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const [data, setData] = useState({
        category_id: service?.category_id || '',
        name: service?.name || '',
        description: service?.description || '',
        price: service?.price || '',
        duration: service?.duration || '',
        image: null,
        remove_image: false,
        is_active: service?.is_active ?? true,
    });

    const handleChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('category_id', data.category_id);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('duration', data.duration);
        formData.append('is_active', data.is_active ? '1' : '0');

        if (data.remove_image) {
            formData.append('remove_image', '1');
        } else if (data.image) {
            formData.append('image', data.image);
        }

        if (service) {
            // For update, use POST with _method spoofing
            formData.append('_method', 'PUT');
            router.post(`/admin/services/${service.id}`, formData, {
                forceFormData: true,
                onSuccess: () => {
                    setProcessing(false);
                    onSuccess?.();
                },
                onError: (errs) => {
                    setProcessing(false);
                    setErrors(errs);
                },
            });
        } else {
            router.post('/admin/services', formData, {
                forceFormData: true,
                onSuccess: () => {
                    setProcessing(false);
                    onSuccess?.();
                },
                onError: (errs) => {
                    setProcessing(false);
                    setErrors(errs);
                },
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleChange('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        handleChange('image', null);
        handleChange('remove_image', true);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    return (
        <form onSubmit={submit} className="space-y-5">
            <Select
                label="Kategori"
                placeholder="Pilih kategori"
                options={categoryOptions}
                value={data.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
                error={errors.category_id}
            />

            <Input
                label="Nama Layanan"
                placeholder="Contoh: Potong Rambut"
                value={data.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
            />

            <Textarea
                label="Deskripsi"
                placeholder="Deskripsi layanan..."
                rows={3}
                value={data.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={errors.description}
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Harga (Rp)"
                    type="number"
                    placeholder="50000"
                    value={data.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    error={errors.price}
                />

                <Input
                    label="Durasi (menit)"
                    type="number"
                    placeholder="30"
                    value={data.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    error={errors.duration}
                />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gambar Layanan</label>
                
                {preview ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition"
                    >
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Klik untuk upload gambar</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (max 2MB)</p>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            </div>

            <label className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>

            <div className="flex gap-3 pt-4">
                <Button type="submit" loading={processing} className="flex-1">
                    {service ? 'Update' : 'Simpan'}
                </Button>
            </div>
        </form>
    );
}
