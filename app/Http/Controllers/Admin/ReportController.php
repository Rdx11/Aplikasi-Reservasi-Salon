<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // Monthly stats for last 6 months
        $monthlyStats = collect();
        for ($i = 0; $i < 6; $i++) {
            $date = Carbon::now()->subMonths($i);
            $monthlyStats->push([
                'month' => $date->translatedFormat('F Y'),
                'bookings' => Booking::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'completed' => Booking::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->where('status', 'completed')
                    ->count(),
                'cancelled' => Booking::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->where('status', 'cancelled')
                    ->count(),
                'revenue' => (int) Booking::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->where('status', 'completed')
                    ->sum('total_price'),
            ]);
        }

        return Inertia::render('Admin/Reports/Index', [
            'stats' => [
                'totalRevenue' => (int) Booking::where('status', 'completed')->sum('total_price'),
                'totalBookings' => Booking::count(),
                'completedBookings' => Booking::where('status', 'completed')->count(),
                'cancelledBookings' => Booking::where('status', 'cancelled')->count(),
                'newCustomers' => User::whereHas('roles', fn($q) => $q->where('name', 'Customer'))
                    ->whereMonth('created_at', now()->month)
                    ->count(),
            ],
            'monthlyStats' => $monthlyStats,
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->get('type', 'booking');
        $format = $request->get('format', 'xlsx');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        // Build query based on type
        switch ($type) {
            case 'booking':
                $query = Booking::with(['user', 'service']);
                if ($startDate) {
                    $query->whereDate('booking_date', '>=', $startDate);
                }
                if ($endDate) {
                    $query->whereDate('booking_date', '<=', $endDate);
                }
                $data = $query->orderBy('booking_date', 'desc')->get();
                $filename = 'laporan-booking-' . now()->format('Y-m-d');
                break;

            case 'revenue':
                $query = Booking::where('status', 'completed')->with(['user', 'service']);
                if ($startDate) {
                    $query->whereDate('booking_date', '>=', $startDate);
                }
                if ($endDate) {
                    $query->whereDate('booking_date', '<=', $endDate);
                }
                $data = $query->orderBy('booking_date', 'desc')->get();
                $filename = 'laporan-pendapatan-' . now()->format('Y-m-d');
                break;

            case 'customer':
                $query = User::role('Customer');
                if ($startDate) {
                    $query->whereDate('created_at', '>=', $startDate);
                }
                if ($endDate) {
                    $query->whereDate('created_at', '<=', $endDate);
                }
                $data = $query->orderBy('created_at', 'desc')->get();
                $filename = 'laporan-pelanggan-' . now()->format('Y-m-d');
                break;

            default:
                return back()->with('error', 'Tipe laporan tidak valid');
        }

        // Export based on format
        if ($format === 'pdf') {
            return $this->exportPdf($data, $type, $filename, $startDate, $endDate);
        }

        // Default to Excel/CSV
        return $this->exportExcel($data, $type, $filename);
    }

    private function exportPdf($data, $type, $filename, $startDate = null, $endDate = null)
    {
        $viewData = [
            'data' => $data,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ];

        $pdf = Pdf::loadView("reports.pdf.{$type}", $viewData);
        
        // Set paper size and orientation
        $pdf->setPaper('a4', 'portrait');
        
        // Set options for better rendering
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'defaultFont' => 'DejaVu Sans',
        ]);

        return $pdf->download("{$filename}.pdf");
    }

    private function exportExcel($data, $type, $filename)
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($data, $type) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for Excel UTF-8 compatibility
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            switch ($type) {
                case 'booking':
                    fputcsv($file, ['No', 'Kode Booking', 'Pelanggan', 'Layanan', 'Tanggal', 'Waktu', 'Total (Rp)', 'Status']);
                    foreach ($data as $index => $row) {
                        fputcsv($file, [
                            $index + 1,
                            $row->booking_code,
                            $row->user->name ?? '-',
                            $row->service->name ?? '-',
                            $row->booking_date->format('d/m/Y'),
                            $row->booking_time,
                            number_format($row->total_price, 0, ',', '.'),
                            ucfirst($row->status),
                        ]);
                    }
                    break;

                case 'revenue':
                    fputcsv($file, ['No', 'Kode Booking', 'Pelanggan', 'Layanan', 'Tanggal', 'Total Pendapatan (Rp)']);
                    $total = 0;
                    foreach ($data as $index => $row) {
                        fputcsv($file, [
                            $index + 1,
                            $row->booking_code,
                            $row->user->name ?? '-',
                            $row->service->name ?? '-',
                            $row->booking_date->format('d/m/Y'),
                            number_format($row->total_price, 0, ',', '.'),
                        ]);
                        $total += $row->total_price;
                    }
                    // Add total row
                    fputcsv($file, ['', '', '', '', 'TOTAL', number_format($total, 0, ',', '.')]);
                    break;

                case 'customer':
                    fputcsv($file, ['No', 'Nama', 'Email', 'Telepon', 'Tanggal Daftar']);
                    foreach ($data as $index => $row) {
                        fputcsv($file, [
                            $index + 1,
                            $row->name,
                            $row->email,
                            $row->phone ?? '-',
                            $row->created_at->format('d/m/Y H:i'),
                        ]);
                    }
                    break;
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
