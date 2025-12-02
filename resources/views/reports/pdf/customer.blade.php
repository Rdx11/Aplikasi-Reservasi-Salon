<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Pelanggan</title>
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
            border-bottom: 3px solid #8b5cf6;
        }
        .header h1 {
            font-size: 24px;
            color: #7c3aed;
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
        /* Customer Highlight */
        .customer-highlight {
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 25px;
        }
        .customer-highlight .amount {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .customer-highlight .label {
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
            width: 50%;
            padding: 15px;
            text-align: center;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
        }
        .summary-number {
            font-size: 20px;
            font-weight: bold;
            color: #7c3aed;
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
            background: #7c3aed;
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
            <h1>Laporan Pelanggan</h1>
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
                <div class="info-label">Total Pelanggan</div>
                <div class="info-value">{{ $data->count() }} Pelanggan</div>
            </div>
        </div>

        <!-- Customer Highlight -->
        <div class="customer-highlight">
            <div class="amount">{{ $data->count() }}</div>
            <div class="label">Total Pelanggan Terdaftar</div>
        </div>

        <!-- Summary -->
        @php
            $thisMonth = $data->filter(function($user) {
                return $user->created_at->isCurrentMonth();
            })->count();
            $lastMonth = $data->filter(function($user) {
                return $user->created_at->isLastMonth();
            })->count();
        @endphp
        <div class="summary">
            <table class="summary-table">
                <tr>
                    <td>
                        <div class="summary-number">{{ $thisMonth }}</div>
                        <div class="summary-label">Pelanggan Baru Bulan Ini</div>
                    </td>
                    <td>
                        <div class="summary-number">{{ $lastMonth }}</div>
                        <div class="summary-label">Pelanggan Baru Bulan Lalu</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Data Table -->
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 5%">No</th>
                    <th style="width: 25%">Nama</th>
                    <th style="width: 30%">Email</th>
                    <th style="width: 20%">Telepon</th>
                    <th style="width: 20%">Tanggal Daftar</th>
                </tr>
            </thead>
            <tbody>
                @forelse($data as $index => $customer)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td class="font-bold">{{ $customer->name }}</td>
                    <td>{{ $customer->email }}</td>
                    <td>{{ $customer->phone ?? '-' }}</td>
                    <td>{{ $customer->created_at->format('d/m/Y H:i') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="text-center">Tidak ada data pelanggan</td>
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
