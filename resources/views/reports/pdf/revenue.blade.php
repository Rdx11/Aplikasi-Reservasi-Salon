<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Pendapatan</title>
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
            border-bottom: 3px solid #10b981;
        }
        .header h1 {
            font-size: 24px;
            color: #059669;
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
        /* Revenue Highlight */
        .revenue-highlight {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 25px;
        }
        .revenue-highlight .amount {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .revenue-highlight .label {
            font-size: 12px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
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
            width: 33.33%;
            padding: 15px;
            text-align: center;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
        }
        .summary-number {
            font-size: 20px;
            font-weight: bold;
            color: #059669;
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
            background: #059669;
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
        table.data-table tfoot td {
            padding: 12px 8px;
            background: #f0fdf4;
            font-weight: bold;
            border-top: 2px solid #059669;
        }
        /* Footer */
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
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
            <h1>Laporan Pendapatan</h1>
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
                <div class="info-label">Total Transaksi</div>
                <div class="info-value">{{ $data->count() }} Transaksi</div>
            </div>
        </div>

        <!-- Revenue Highlight -->
        <div class="revenue-highlight">
            <div class="amount">Rp {{ number_format($data->sum('total_price'), 0, ',', '.') }}</div>
            <div class="label">Total Pendapatan</div>
        </div>

        <!-- Summary -->
        <div class="summary">
            <table class="summary-table">
                <tr>
                    <td>
                        <div class="summary-number">{{ $data->count() }}</div>
                        <div class="summary-label">Total Transaksi</div>
                    </td>
                    <td>
                        <div class="summary-number">Rp {{ number_format($data->avg('total_price'), 0, ',', '.') }}</div>
                        <div class="summary-label">Rata-rata Transaksi</div>
                    </td>
                    <td>
                        <div class="summary-number">Rp {{ number_format($data->max('total_price'), 0, ',', '.') }}</div>
                        <div class="summary-label">Transaksi Tertinggi</div>
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
                    <th style="width: 20%">Pelanggan</th>
                    <th style="width: 25%">Layanan</th>
                    <th style="width: 15%">Tanggal</th>
                    <th style="width: 20%" class="text-right">Pendapatan</th>
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
                    <td class="text-right font-bold">Rp {{ number_format($booking->total_price, 0, ',', '.') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="text-center">Tidak ada data pendapatan</td>
                </tr>
                @endforelse
            </tbody>
            @if($data->count() > 0)
            <tfoot>
                <tr>
                    <td colspan="5" class="text-right">TOTAL PENDAPATAN</td>
                    <td class="text-right">Rp {{ number_format($data->sum('total_price'), 0, ',', '.') }}</td>
                </tr>
            </tfoot>
            @endif
        </table>

        <!-- Footer -->
        <div class="footer">
            <p>Dokumen ini digenerate secara otomatis oleh sistem {{ config('app.name') }}</p>
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
