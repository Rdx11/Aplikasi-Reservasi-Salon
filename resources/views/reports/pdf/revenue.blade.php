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
        /* Revenue Highlight */
        .revenue-highlight {
            border: 2px solid #000000;
            padding: 15px;
            text-align: center;
            margin-bottom: 20px;
        }
        .revenue-highlight .amount {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 3px;
        }
        .revenue-highlight .label {
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
            width: 33.33%;
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
        table.data-table tfoot td {
            padding: 8px 5px;
            font-weight: bold;
            border: 1px solid #000000;
            background: #f0f0f0;
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
            <h1>Laporan Pendapatan</h1>
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
                    <td class="label">Total Transaksi</td>
                    <td>: {{ $data->count() }} Transaksi</td>
                </tr>
            </table>
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
                    <td class="text-center">{{ $index + 1 }}</td>
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
