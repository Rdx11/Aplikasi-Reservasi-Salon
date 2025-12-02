import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, Calendar, Sparkles, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Eye } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats = {}, chartData = {}, recentBookings = [], popularServices = [] }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Pelanggan"
                        value={stats.totalUsers || 0}
                        icon={Users}
                        color="primary"
                    />
                    <StatCard
                        title="Total Booking"
                        value={stats.totalBookings || 0}
                        icon={Calendar}
                        color="blue"
                        growth={stats.bookingsGrowth}
                    />
                    <StatCard
                        title="Layanan Aktif"
                        value={stats.totalServices || 0}
                        icon={Sparkles}
                        color="gold"
                    />
                    <StatCard
                        title="Pendapatan"
                        value={formatCurrency(stats.revenue || 0)}
                        icon={TrendingUp}
                        color="green"
                        growth={stats.revenueGrowth}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Booking Trend Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tren Booking & Pendapatan</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData.monthly || []}>
                                    <defs>
                                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                    <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        formatter={(value, name) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Pendapatan' : 'Booking']}
                                    />
                                    <Area yAxisId="left" type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
                                    <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Booking Status Pie Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Booking</h3>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.status || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {(chartData.status || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [value, 'Booking']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {(chartData.status || []).map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Popular Services & Recent Bookings */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Popular Services */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Layanan Populer</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={popularServices} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                                    <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={80} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        formatter={(value) => [value, 'Booking']}
                                    />
                                    <Bar dataKey="bookings" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Booking Terbaru</h3>
                            <Link href="/admin/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="p-6">
                            {recentBookings.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>Belum ada booking</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-500">
                                                <th className="pb-4 font-medium">Kode</th>
                                                <th className="pb-4 font-medium">Pelanggan</th>
                                                <th className="pb-4 font-medium">Layanan</th>
                                                <th className="pb-4 font-medium">Tanggal</th>
                                                <th className="pb-4 font-medium">Total</th>
                                                <th className="pb-4 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {recentBookings.map((booking) => (
                                                <tr key={booking.id} className="border-t border-gray-50">
                                                    <td className="py-4 font-medium text-primary-600">{booking.booking_code}</td>
                                                    <td className="py-4 text-gray-900">{booking.customer_name}</td>
                                                    <td className="py-4 text-gray-600">{booking.service_name}</td>
                                                    <td className="py-4 text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <span>{booking.booking_date}</span>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="text-xs text-gray-500">{booking.booking_time}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-gray-900 font-medium">{formatCurrency(booking.total_price)}</td>
                                                    <td className="py-4">
                                                        <StatusBadge status={booking.status} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pending Bookings Alert */}
                {stats.pendingBookings > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-medium text-amber-800">
                                    {stats.pendingBookings} booking menunggu konfirmasi
                                </p>
                                <p className="text-sm text-amber-600">Segera proses booking yang pending</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/bookings"
                            className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition text-sm font-medium"
                        >
                            Lihat Booking
                        </Link>
                    </motion.div>
                )}
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon: Icon, color, growth }) {
    const colors = {
        primary: 'bg-primary-50 text-primary-600',
        blue: 'bg-blue-50 text-blue-600',
        gold: 'bg-amber-50 text-amber-600',
        green: 'bg-green-50 text-green-600',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
                {growth !== undefined && growth !== 0 && (
                    <div className={`flex items-center gap-1 text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>{Math.abs(growth)}%</span>
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{title}</p>
            </div>
        </motion.div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const labels = {
        pending: 'Pending',
        confirmed: 'Dikonfirmasi',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
    };

    return (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
            {labels[status] || status}
        </span>
    );
}
