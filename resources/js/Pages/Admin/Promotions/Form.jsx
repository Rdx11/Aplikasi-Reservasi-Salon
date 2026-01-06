import { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button, Input, Textarea, Select } from '@/Components/UI';
import { X, Image as ImageIcon } from 'lucide-react';

export default function PromotionForm({ promotion, services = [], onSuccess }) {
    const [imagePreview, setImagePreview] = useState(promotion?.image || null);
    const [removeExistingImage, setRemoveExistingImage] = useState(false);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        title: promotion?.title || '',
        description: promotion?.description || '',
        id_service: promotion?.id_service || '',
        discount_percentage: promotion?.discount_percentage || '',
        image: null,
        promo_date: promotion?.promo_date || '',
        is_active: promotion?.is_active ?? true,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setRemoveExistingImage(false);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        setRemoveExistingImage(true); // Mark that existing image should be removed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (promotion) {
            // Update - use router.post with _method spoofing
            router.post(`/admin/promotions/${promotion.id_promotion}`, {
                _method: 'PUT',
                title: data.title,
                description: data.description,
                id_service: data.id_service || '',
                discount_percentage: data.discount_percentage || '',
                promo_date: data.promo_date,
                is_active: data.is_active ? '1' : '0',
                image: data.image,
                remove_image: removeExistingImage ? '1' : '0',
            }, {
                forceFormData: true,
                onSuccess,
            });
        } else {
            // Create - use useForm's post
            post('/admin/promotions', {
                forceFormData: true,
                onSuccess,
            });
        }
    };

    const serviceOptions = [
        { value: '', label: 'Semua Layanan' },
        ...services.map((s) => ({ value: s.id_service, label: s.name })),
    ];

    return (
        <form onSubmit={submit} className="space-y-5">
            <Input
                label="Judul Promosi"
                placeholder="Contoh: Diskon Akhir Tahun"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                error={errors.title}
            />

            <Textarea
                label="Deskripsi"
                placeholder="Deskripsi promosi..."
                rows={3}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                error={errors.description}
            />

            <Select
                label="Layanan (opsional)"
                options={serviceOptions}
                value={data.id_service}
                onChange={(e) => setData('id_service', e.target.value)}
                error={errors.id_service}
            />

            <Input
                label="Diskon Persentase (%)"
                type="number"
                placeholder="10"
                min="1"
                max="100"
                value={data.discount_percentage}
                onChange={(e) => setData('discount_percentage', e.target.value)}
                error={errors.discount_percentage}
                helperText="Masukkan angka 1-100"
            />

            <Input
                label="Tanggal Promo"
                type="date"
                value={data.promo_date}
                onChange={(e) => setData('promo_date', e.target.value)}
                error={errors.promo_date}
                helperText="Promo hanya berlaku pada tanggal ini"
            />

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Promosi (opsional)
                </label>
                
                {imagePreview ? (
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full max-w-xs h-40 object-cover rounded-xl border border-gray-200 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Klik gambar untuk mengganti</p>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition"
                    >
                        <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Maks. 2MB)</p>
                    </div>
                )}
                
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                />
                
                {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
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
                    {promotion ? 'Update' : 'Simpan'}
                </Button>
            </div>
        </form>
    );
}
