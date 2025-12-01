'use client';

import React from 'react';
import { SaleItem } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface SalesTableProps {
    sales: SaleItem[];
    sortBy: 'date' | 'price';
    sortOrder: 'asc' | 'desc';
    onSort: (column: 'date' | 'price') => void;
}

const SalesTable = ({
    sales,
    sortBy,
    sortOrder,
    onSort,
}: SalesTableProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateTime = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'MMM d, yyyy HH:mm');
        } catch {
            return dateStr;
        }
    };

    const SortIcon = ({ column }: { column: 'date' | 'price' }) => {
        if (sortBy !== column) return <span className="text-gray-400">↕</span>;

        return sortOrder === 'asc' ? (
            <span className="text-blue-600">↑</span>
        ) : (
            <span className="text-blue-600">↓</span>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                            <button
                                onClick={() => onSort('date')}
                                className="ml-2 focus:outline-none"
                            >
                                <SortIcon column="date" />
                            </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                            <button
                                onClick={() => onSort('price')}
                                className="ml-2 focus:outline-none"
                            >
                                <SortIcon column="price" />
                            </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sale ID
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sales.map((sale) => (
                        <tr key={sale._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDateTime(sale.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(sale.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <a
                                    href={`mailto:${sale.customerEmail}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    {sale.customerEmail}
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {sale.customerPhone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                {sale._id.substring(0, 8)}...
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesTable;