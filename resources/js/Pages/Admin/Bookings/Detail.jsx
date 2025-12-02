export default function BookingDetail({ booking }) {
    if (!booking) return null;

    const formatPrice = (price) => `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Kode Booking</p>
                    <p className="text-xl font-bold text-gray-900">{booking.booking_code}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Informasi Pelanggan</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Nama</span>
                            <span className="font-medium">{booking.user?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium">{booking.user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Telepon</span>
                            <span className="font-medium">{booking.user?.phone || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Informasi Layanan</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Layanan</span>
                            <span className="font-medium">{booking.service?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Kategori</span>
                            <span className="font-medium">{booking.service?.category?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Durasi</span>
                            <span className="font-medium">{booking.service?.duration} menit</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="font-medium">{formatDate(booking.booking_date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Jam</span>
                    <span className="font-medium">{booking.booking_time}</span>
                </div>
                {booking.notes && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Catatan</span>
                        <span className="font-medium">{booking.notes}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(booking.total_price)}</span>
                </div>
            </div>
        </div>
    );
}
