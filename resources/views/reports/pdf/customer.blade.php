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
            color: #000000;
            line-height: 1.5;
        }
        .container {
            padding: 20px 30px;
        }
        /* Kop Surat */
        .kop-surat {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 3px double #000000;
            margin-bottom: 20px;
        }
        .kop-surat .company-name {
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 3px;
        }
        .kop-surat .company-tagline {
            font-size: 12px;
            font-style: italic;
            margin-bottom: 5px;
        }
        .kop-surat .company-address {
            font-size: 10px;
            line-height: 1.4;
        }
        /* Header Laporan */
        .report-header {
            text-align: center;
            margin-bottom: 20px;
            margin-top: 15px;
        }
        .report-header h1 {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: underline;
            margin-bottom: 5px;
        }
        .report-header .periode {
            font-size: 11px;
        }
        /* Info Box */
        .info-box {
            margin-bottom: 20px;
            font-size: 11px;
        }
        .info-box table {
            width: 100%;
        }
        .info-box td {
            padding: 2px 0;
        }
        .info-box .label {
            width: 120px;
        }
        /* Customer Highlight */
        .customer-highlight {
            border: 2px solid #000000;
            padding: 15px;
            text-align: center;
            margin-bottom: 20px;
        }
        .customer-highlight .amount {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 3px;
        }
        .customer-highlight .label {
            font-size: 11px;
            text-transform: uppercase;
        }
        /* Summary Cards */
        .summary {
            margin-bottom: 20px;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }
        .summary-table td {
            width: 50%;
            padding: 10px;
            text-align: center;
            border: 1px solid #000000;
        }
        .summary-number {
            font-size: 16px;
            font-weight: bold;
        }
        .summary-label {
            font-size: 9px;
            text-transform: uppercase;
            margin-top: 3px;
        }
        /* Table */
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table.data-table thead th {
            background: #f0f0f0;
            color: #000000;
            padding: 8px 5px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            border: 1px solid #000000;
        }
        table.data-table tbody td {
            padding: 6px 5px;
            border: 1px solid #000000;
            font-size: 10px;
        }
        table.data-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        /* Signature Section */
        .signature-section {
            margin-top: 40px;
            width: 100%;
        }
        .signature-box {
            float: right;
            width: 200px;
            text-align: center;
        }
        .signature-date {
            margin-bottom: 5px;
            font-size: 11px;
        }
        .signature-title {
            margin-bottom: 60px;
            font-size: 11px;
        }
        .signature-line {
            border-bottom: 1px solid #000000;
            margin-bottom: 5px;
        }
        .signature-name {
            font-weight: bold;
            font-size: 11px;
            text-decoration: underline;
        }
        .signature-role {
            font-size: 10px;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        /* Footer */
        .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #000000;
            text-align: center;
            font-size: 9px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Kop Surat -->
        <div class="kop-surat">
            <div class="company-name">RASTA SALON</div>
            <div class="company-tagline">"Tampil Mempesona & Percaya Diri"</div>
            <div class="company-address">
                Jl. Bugis, Kec. Sumbawa, Kabupaten Sumbawa, Nusa Tenggara Barat 84313<br>
                Telp: +62 813 5342 2461 | Email: info@rastasalon.com
            </div>
        </div>

        <!-- Header Laporan -->
        <div class="report-header">
            <h1>Laporan Pelanggan</h1>
            <div class="periode">
                @if($startDate && $endDate)
                    Periode: {{ \Carbon\Carbon::parse($startDate)->format('d F Y') }} - {{ \Carbon\Carbon::parse($endDate)->format('d F Y') }}
                @else
                    Semua Data
                @endif
            </div>
        </div>

        <!-- Info Box -->
        <div class="info-box">
            <table>
                <tr>
                    <td class="label">Tanggal Cetak</td>
                    <td>: {{ $printedAt->format('d F Y, H:i') }} WIB</td>
                </tr>
                <tr>
                    <td class="label">Total Pelanggan</td>
                    <td>: {{ $data->count() }} Pelanggan</td>
                </tr>
            </table>
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
                    <td class="text-center">{{ $index + 1 }}</td>
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

        <!-- Signature Section -->
        <div class="signature-section clearfix">
            <div class="signature-box">
                <div class="signature-date">Sumbawa, {{ $printedAt->translatedFormat('d F Y') }}</div>
                <div class="signature-title">Penanggung Jawab,</div>
                <div class="signature-line"></div>
                <div class="signature-name">{{ $printedBy->name }}</div>
                <div class="signature-role">{{ $printedBy->roles->first()->name ?? 'Administrator' }}</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Dokumen ini digenerate secara otomatis oleh sistem {{ config('app.name') }}</p>
        </div>
    </div>
</body>
</html>
