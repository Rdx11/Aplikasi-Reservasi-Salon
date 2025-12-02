<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Booking</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #1f2937;
            line-height: 1.5;
        }
        .container {
            padding: 30px;
        }
        /* Header */
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #6366f1;
        }
        .header h1 {
            font-size: 24px;
            color: #4f46e5;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .header .subtitle {
            font-size: 14px;
            color: #6b7280;
        }
        .header .company {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        /* Info Box */
        .info-box {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        .info-row {
            display: inline-block;
            width: 48%;
            margin-bottom: 5px;
        }
        .info-label {
            color: #6b7280;
            font-size: 10px;
            text-transform: uppercase;
        }
        .info-value {
            font-weight: bold;
            color: #1f2937;
        }
        /* Summary Cards */
        .summary {
            margin-bottom: 25px;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }
        .summary-table td {
            width: 25%;
            padding: 15px;
            text-align: center;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
        }
        .summary-number {
            font-size: 22px;
            font-weight: bold;
            color: #4f46e5;
        }
        .summary-label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            margin-top: 5px;
        }
        /* Table */
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table.data-table thead th {
            background: #4f46e5;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        table.data-table thead th:first-child {
            border-radius: 8px 0 0 0;
        }
        table.data-table thead th:last-child {
            border-radius: 0 8px 0 0;
        }
        table.data-table tbody td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        table.data-table tbody tr:nth-child(even) {
            background: #f9fafb;
        }
        table.data-table tbody tr:hover {
            background: #f3f4f6;
        }
        /* Status Badges */
        .status {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            display: inline-block;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #dbeafe; color: #1e40af; }
        .status-in_progress { background: #e0e7ff; color: #3730a3; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        /* Footer */
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 9px;
            color: #9ca3af;
        }
        .page-number {
            text-align: right;
            font-size: 9px;
            color: #9ca3af;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="company">{{ config('app.name', 'Salon Booking') }}</div>
            <h1>Laporan Booking</h1>
            <div class="subtitle">
                @if($startDate && $endDate)
                    Periode: {{ \Carbon\Carbon::parse($startDate)->format('d M Y') }} - {{ \Carbon\Carbon::parse($endDate)->format('d M Y') }}
                @else
                    Semua Data
                @endif
            </div>
        </div>

        <!-- Info Box -->
        <div class="info-box">
            <div class="info-row">
                <div class="info-label">Tanggal Cetak</div>
                <div class="info-value">{{ now()->format('d F Y, H:i') }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Total Data</div>
                <div class="info-value">{{ $data->count() }} Booking</div>
            </div>
        </div>

        <!-- Summary -->
        <div class="summary">
            <table class="summary-table">
                <tr>
                    <td>
                        <div class="summary-number">{{ $data->count() }}</div>
                        <div class="summary-label">Total Booking</div>
                    </td>
                    <td>
                        <div class="summary-number">{{ $data->where('status', 'completed')->count() }}</div>
                        <div class="summary-label">Selesai</div>
                    </td>
                    <td>
                        <div class="summary-number">{{ $data->where('status', 'pending')->count() }}</div>
                        <div class="summary-label">Pending</div>
                    </td>
                    <td>
                        <div class="summary-number">{{ $data->where('status', 'cancelled')->count() }}</div>
                        <div class="summary-label">Dibatalkan</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Data Table -->
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 5%">No</th>
                    <th style="width: 15%">Kode Booking</th>
                    <th style="width: 18%">Pelanggan</th>
                    <th style="width: 20%">Layanan</th>
                    <th style="width: 12%">Tanggal</th>
                    <th style="width: 10%">Waktu</th>
                    <th style="width: 10%" class="text-right">Total</th>
                    <th style="width: 10%" class="text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($data as $index => $booking)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td class="font-bold">{{ $booking->booking_code }}</td>
                    <td>{{ $booking->user->name ?? '-' }}</td>
                    <td>{{ $booking->service->name ?? '-' }}</td>
                    <td>{{ $booking->booking_date->format('d/m/Y') }}</td>
                    <td>{{ $booking->booking_time }}</td>
                    <td class="text-right">Rp {{ number_format($booking->total_price, 0, ',', '.') }}</td>
                    <td class="text-center">
                        <span class="status status-{{ $booking->status }}">
                            {{ ucfirst(str_replace('_', ' ', $booking->status)) }}
                        </span>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="text-center">Tidak ada data booking</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
            <p>Dokumen ini digenerate secara otomatis oleh sistem {{ config('app.name') }}</p>
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
