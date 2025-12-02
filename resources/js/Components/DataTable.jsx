import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/Components/UI';
import clsx from 'clsx';

export function DataTable({
    columns,
    data,
    onEdit,
    onDelete,
    onView,
    searchable = true,
    pagination = true,
    actions = true,
}) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const filteredData = data.filter((item) =>
        columns.some((col) =>
            String(item[col.key] || '').toLowerCase().includes(search.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredData.length / perPage);
    const paginatedData = pagination
        ? filteredData.slice((currentPage - 1) * perPage, currentPage * perPage)
        : filteredData;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {searchable && (
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    {col.label}
                                </th>
                            ))}
                            {actions && <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                                    Tidak ada data
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, index) => (
                                <motion.tr
                                    key={item.id || index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50"
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                                            {col.render ? col.render(item[col.key], item) : item[col.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(item)}
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Menampilkan {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, filteredData.length)} dari {filteredData.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium">{currentPage} / {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
