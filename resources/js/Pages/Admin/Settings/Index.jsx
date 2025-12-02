import AdminLayout from '@/Layouts/AdminLayout';
import { Settings, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function SettingsIndex() {
    return (
        <AdminLayout title="Pengaturan">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <Settings className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pengaturan Sistem</h2>
                        <p className="text-gray-500 mb-8">Fitur pengaturan akan segera tersedia</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Bell className="w-6 h-6 text-primary-500 mb-2" />
                                <h3 className="font-medium text-gray-900">Notifikasi</h3>
                                <p className="text-sm text-gray-500">Atur preferensi notifikasi</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Shield className="w-6 h-6 text-primary-500 mb-2" />
                                <h3 className="font-medium text-gray-900">Keamanan</h3>
                                <p className="text-sm text-gray-500">Pengaturan keamanan akun</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Palette className="w-6 h-6 text-primary-500 mb-2" />
                                <h3 className="font-medium text-gray-900">Tampilan</h3>
                                <p className="text-sm text-gray-500">Kustomisasi tampilan</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Globe className="w-6 h-6 text-primary-500 mb-2" />
                                <h3 className="font-medium text-gray-900">Bahasa</h3>
                                <p className="text-sm text-gray-500">Pilih bahasa aplikasi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
