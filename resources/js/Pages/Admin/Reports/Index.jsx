import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, TrendingUp, Calendar, DollarSign, Users, Download, 
    FileSpreadsheet, File, BarChart3, PieChart, ArrowUpRight, 
    ArrowDownRight, Clock, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Modal } from '@/Components/UI';

export default function ReportsIndex({ stats = {}, monthlyStats = [] }) {
    const [exportModal, setExportModal] = useState({ open: false, type: null });
    const [exportForm, setExportForm] = useState({
        startDate: '',
        endDate: '',
        format: 'xlsx',
    });

    const defaultStats = {
        totalRevenue: stats.totalRevenue || 0,
        totalBookings: stats.totalBookings || 0,
        completedBookings: stats.completedBookings || 0,
        cancelledBookings: stats.cancelledBookings || 0,
        newCustomers: stats.newCustomers || 0,
    };

    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;

    const exportTypes = {
        booking: { 
            title: 'Laporan Booking', 
            description: 'Data lengkap semua booking pelanggan termasuk status dan detail layanan',
            icon: Calendar,
            color: 'indigo'
        },
        revenue: { 
            title: 'Laporan Pendapatan', 
            description: 'Ringkasan pendapatan dari booking yang telah selesai',
            icon: DollarSign,
            color: 'emerald'
        },
        customer: { 
            title: 'Laporan Pelanggan', 
            description: 'Data pelanggan terdaftar beserta informasi kontak',
            icon: Users,
            color: 'violet'
        },
    };

    const openExportModal = (type) => {
        setExportForm({ startDate: '', endDate: '', format: 'xlsx' });
        setExportModal({ open: true, type });
    };

    const handleExport = () => {
        const params = new URLSearchParams({
            type: exportModal.type,
            format: exportForm.format,
            ...(exportForm.startDate && { start_date: exportForm.startDate }),
            ...(exportForm.endDate && { end_date: exportForm.endDate }),
        });
        
        window.open(`/admin/reports/export?${params.toString()}`, '_blank');
        setExportModal({ open: false, type: null });
    };

    // Calculate growth percentage (mock data for demo)
    const calculateGrowth = (current, previous) => {
        if (!previous) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    // Get completion rate
    const completionRate = defaultStats.totalBookings > 0 
        ? ((defaultStats.completedBookings / defaultStats.totalBookings) * 100).toFixed(1)
        : 0;

    return (
        <AdminLayout title="Laporan & Analitik">
            <Head title="Laporan" />

            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard Laporan</h1>
                        <p className="text-gray-500 mt-1">Pantau performa bisnis dan unduh laporan</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Pendapatan"
                        value={formatPrice(defaultStats.totalRevenue)}
                        icon={DollarSign}
                        color="emerald"
                        trend={12.5}
                        trendLabel="vs bulan lalu"
                    />
                    <StatCard
                        title="Total Booking"
                        value={defaultStats.totalBookings}
                        icon={Calendar}
                        color="blue"
                        trend={8.2}
                        trendLabel="vs bulan lalu"
                    />
                    <StatCard
                        title="Tingkat Penyelesaian"
                        value={`${completionRate}%`}
                        icon={CheckCircle2}
                        color="violet"
                        subtitle={`${defaultStats.completedBookings} dari ${defaultStats.totalBookings} booking`}
                    />
                    <StatCard
                        title="Pelanggan Baru"
                        value={defaultStats.newCustomers}
                        icon={Users}
                        color="amber"
                        trend={5.3}
                        trendLabel="bulan ini"
                    />
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickStat 
                        label="Booking Selesai" 
                        value={defaultStats.completedBookings} 
                        icon={CheckCircle2}
                        color="green"
                    />
                    <QuickStat 
                        label="Booking Pending" 
                        value={defaultStats.totalBookings - defaultStats.completedBookings - defaultStats.cancelledBookings} 
                        icon={AlertCircle}
                        color="yellow"
                    />
                    <QuickStat 
                        label="Booking Batal" 
                        value={defaultStats.cancelledBookings} 
                        icon={XCircle}
                        color="red"
                    />
                    <QuickStat 
                        label="Rata-rata/Booking" 
                        value={defaultStats.completedBookings > 0 
                            ? formatPrice(Math.round(defaultStats.totalRevenue / defaultStats.completedBookings))
                            : 'Rp 0'
                        } 
                        icon={BarChart3}
                        color="blue"
                    />
                </div>

                {/* Export Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-violet-50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <FileText className="w-7 h-7 text-primary-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Export Laporan</h2>
                                <p className="text-gray-600 mt-0.5">Unduh laporan dalam format Excel atau PDF profesional</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid md:grid-cols-3 gap-5">
                            {Object.entries(exportTypes).map(([key, type]) => (
                                <ExportCard
                                    key={key}
                                    title={type.title}
                                    description={type.description}
                                    icon={type.icon}
                                    color={type.color}
                                    onClick={() => openExportModal(key)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Stats Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Statistik Bulanan</h2>
                                    <p className="text-sm text-gray-500">Performa 6 bulan terakhir</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Bulan
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Total Booking
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Selesai
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Batal
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Pendapatan
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Tingkat Sukses
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {monthlyStats.length > 0 ? (
                                    monthlyStats.map((row, i) => {
                                        const successRate = row.bookings > 0 
                                            ? ((row.completed / row.bookings) * 100).toFixed(0)
                                            : 0;
                                        return (
                                            <motion.tr 
                                                key={i} 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-gray-900">{row.month}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-700 font-semibold rounded-lg">
                                                        {row.bookings}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 font-medium rounded-full text-sm">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        {row.completed}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 font-medium rounded-full text-sm">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        {row.cancelled}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-bold text-gray-900">{formatPrice(row.revenue)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full rounded-full ${
                                                                    successRate >= 80 ? 'bg-green-500' :
                                                                    successRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${successRate}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-sm font-semibold ${
                                                            successRate >= 80 ? 'text-green-600' :
                                                            successRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                                                        }`}>
                                                            {successRate}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <BarChart3 className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-medium">Belum ada data statistik</p>
                                                <p className="text-sm text-gray-400">Data akan muncul setelah ada transaksi</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Export Modal */}
            <Modal
                isOpen={exportModal.open}
                onClose={() => setExportModal({ open: false, type: null })}
                title={exportModal.type ? `Export ${exportTypes[exportModal.type]?.title}` : 'Export'}
                size="md"
            >
                <div className="space-y-6">
                    {/* Type Info */}
                    {exportModal.type && (
                        <div className={`p-4 rounded-xl ${
                            exportTypes[exportModal.type].color === 'indigo' ? 'bg-indigo-50' :
                            exportTypes[exportModal.type].color === 'emerald' ? 'bg-emerald-50' : 'bg-violet-50'
                        }`}>
                            <div className="flex items-start gap-3">
                                {(() => {
                                    const IconComponent = exportTypes[exportModal.type].icon;
                                    const colorClass = exportTypes[exportModal.type].color === 'indigo' ? 'text-indigo-600' :
                                        exportTypes[exportModal.type].color === 'emerald' ? 'text-emerald-600' : 'text-violet-600';
                                    return <IconComponent className={`w-5 h-5 ${colorClass} mt-0.5`} />;
                                })()}
                                <div>
                                    <h4 className="font-semibold text-gray-900">{exportTypes[exportModal.type].title}</h4>
                                    <p className="text-sm text-gray-600 mt-0.5">{exportTypes[exportModal.type].description}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Date Range */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Rentang Tanggal (Opsional)
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Dari Tanggal</label>
                                <input
                                    type="date"
                                    value={exportForm.startDate}
                                    onChange={(e) => setExportForm({ ...exportForm, startDate: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Sampai Tanggal</label>
                                <input
                                    type="date"
                                    value={exportForm.endDate}
                                    onChange={(e) => setExportForm({ ...exportForm, endDate: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Kosongkan untuk mengunduh semua data</p>
                    </div>

                    {/* Format Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Format File
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label
                                className={`relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                    exportForm.format === 'xlsx'
                                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="format"
                                    value="xlsx"
                                    checked={exportForm.format === 'xlsx'}
                                    onChange={(e) => setExportForm({ ...exportForm, format: e.target.value })}
                                    className="sr-only"
                                />
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    exportForm.format === 'xlsx' ? 'bg-primary-100' : 'bg-gray-100'
                                }`}>
                                    <FileSpreadsheet className={`w-6 h-6 ${exportForm.format === 'xlsx' ? 'text-primary-600' : 'text-gray-400'}`} />
                                </div>
                                <div>
                                    <p className={`font-semibold ${exportForm.format === 'xlsx' ? 'text-primary-700' : 'text-gray-700'}`}>
                                        Excel
                                    </p>
                                    <p className="text-xs text-gray-500">.csv spreadsheet</p>
                                </div>
                                {exportForm.format === 'xlsx' && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                            </label>
                            <label
                                className={`relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                    exportForm.format === 'pdf'
                                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="format"
                                    value="pdf"
                                    checked={exportForm.format === 'pdf'}
                                    onChange={(e) => setExportForm({ ...exportForm, format: e.target.value })}
                                    className="sr-only"
                                />
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    exportForm.format === 'pdf' ? 'bg-primary-100' : 'bg-gray-100'
                                }`}>
                                    <File className={`w-6 h-6 ${exportForm.format === 'pdf' ? 'text-primary-600' : 'text-gray-400'}`} />
                                </div>
                                <div>
                                    <p className={`font-semibold ${exportForm.format === 'pdf' ? 'text-primary-700' : 'text-gray-700'}`}>
                                        PDF
                                    </p>
                                    <p className="text-xs text-gray-500">.pdf document</p>
                                </div>
                                {exportForm.format === 'pdf' && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setExportModal({ open: false, type: null })}
                            className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition font-medium"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition font-medium flex items-center gap-2 shadow-lg shadow-primary-500/25"
                        >
                            <Download className="w-4 h-4" />
                            Download Laporan
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon: Icon, color, trend, trendLabel, subtitle }) {
    const colors = {
        emerald: {
            bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            light: 'bg-emerald-50',
            text: 'text-emerald-600',
        },
        blue: {
            bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
            light: 'bg-blue-50',
            text: 'text-blue-600',
        },
        violet: {
            bg: 'bg-gradient-to-br from-violet-500 to-violet-600',
            light: 'bg-violet-50',
            text: 'text-violet-600',
        },
        amber: {
            bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
            light: 'bg-amber-50',
            text: 'text-amber-600',
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colors[color].bg} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            {trendLabel && <p className="text-xs text-gray-400 mt-1">{trendLabel}</p>}
        </motion.div>
    );
}

function QuickStat({ label, value, icon: Icon, color }) {
    const colors = {
        green: 'bg-green-50 text-green-600 border-green-100',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
        red: 'bg-red-50 text-red-600 border-red-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
    };

    return (
        <div className={`p-4 rounded-xl border ${colors[color]} flex items-center gap-3`}>
            <Icon className="w-5 h-5" />
            <div>
                <p className="text-lg font-bold">{value}</p>
                <p className="text-xs opacity-80">{label}</p>
            </div>
        </div>
    );
}

function ExportCard({ title, description, icon: Icon, color, onClick }) {
    const colors = {
        indigo: {
            bg: 'hover:bg-indigo-50',
            border: 'hover:border-indigo-300',
            icon: 'bg-indigo-100 text-indigo-600',
        },
        emerald: {
            bg: 'hover:bg-emerald-50',
            border: 'hover:border-emerald-300',
            icon: 'bg-emerald-100 text-emerald-600',
        },
        violet: {
            bg: 'hover:bg-violet-50',
            border: 'hover:border-violet-300',
            icon: 'bg-violet-100 text-violet-600',
        },
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-5 border-2 border-gray-200 rounded-xl ${colors[color].bg} ${colors[color].border} transition-all cursor-pointer group`} 
            onClick={onClick}
        >
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${colors[color].icon} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
                </div>
                <Download className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
        </motion.div>
    );
}
