'use client';

import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { Filters, SalesResponse } from '@/lib/types';
import { fetchSales } from '@/lib/api';
import SalesTable from '@/components/SalesTable';
import Pagination from '@/components/Pagination';
import FilterControls from '@/components/FilterControls';
import TimeSeriesChart from '@/components/TimeSeriesChart';
import DateRangeFilter from '@/components/DateRangeFilter';

const Dashboard = () => {
    const [filters, setFilters] = useState<Filters>({
        startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        priceMin: '',
        email: '',
        phone: '',
        sortBy: 'date',
        sortOrder: 'desc',
    });

    const [salesData, setSalesData] = useState<SalesResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Adding pagination history to track tokens for going back
    const [paginationHistory, setPaginationHistory] = useState<string[]>([]);

    const fetchData = async (newFilters?: Partial<Filters>, resetPage: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            const finalFilters = newFilters ? { ...filters, ...newFilters } : filters;
            const data = await fetchSales(finalFilters);
            setSalesData(data);

            if (newFilters) {
                setFilters(finalFilters);
            }

            if (resetPage) {
                setCurrentPage(1);
                setPaginationHistory([]); // Clearing history when resetting
            }
        } catch (err) {
            setError('Failed to fetch sales data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDateChange = (start: string, end: string) => {
        fetchData({
            startDate: start,
            endDate: end,
            after: undefined,
            before: undefined
        }, true);
    };

    const handleFilterChange = (newFilters: Partial<Filters>) => {
        fetchData({
            ...newFilters,
            after: undefined,
            before: undefined
        }, true);
    };

    const handleSort = (column: 'date' | 'price') => {
        const newSortOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
        fetchData({
            sortBy: column,
            sortOrder: newSortOrder,
            after: undefined,
            before: undefined
        }, true);
    };

    const handleNextPage = () => {
        if (!salesData?.pagination.after) return;

        const afterToken = salesData.pagination.after;
        const beforeToken = salesData.pagination.before;

        // Saving the AFTER token to go forward
        // This becomes the BEFORE token to come back to this page
        setPaginationHistory(prev => [...prev, afterToken]);

        setCurrentPage(page => page + 1);
        fetchData({
            after: afterToken,
            before: undefined
        });
    };

    const handlePrevPage = () => {
        if (currentPage <= 1) return;

        if (currentPage === 2) {
            // Going back to page 1 - fresh request with no pagination tokens
            setCurrentPage(1);
            setPaginationHistory([]);
            fetchData({
                after: undefined,
                before: undefined
            });
        } else {
            // Going back to previous page - using the saved after token as before token
            const tokenForPrevPage = paginationHistory[paginationHistory.length - 2];

            setCurrentPage(prev => prev - 1);
            setPaginationHistory(prev => prev.slice(0, -1));

            fetchData({
                after: tokenForPrevPage,
                before: undefined
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">AutoBizz Sales Dashboard</h1>
                <p className="text-gray-600 mt-2">Real-time sales analytics and management</p>
            </header>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Date Range</h2>
                        <DateRangeFilter
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            onDateChange={handleDateChange}
                        />
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
                        <FilterControls
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h2>
                        {loading && !salesData ? (
                            <div className="h-80 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <TimeSeriesChart data={salesData?.results.TotalSales || []} />
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Sales Records</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                {loading && !salesData ? (
                                    'Loading...'
                                ) : (
                                    <>
                                        Showing {salesData?.results.Sales.length || 0} sales on page {currentPage}
                                    </>
                                )}
                            </p>
                        </div>

                        {loading && !salesData ? (
                            <div className="p-8 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : salesData?.results.Sales.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No sales found for the selected filters
                            </div>
                        ) : (
                            <>
                                <SalesTable
                                    sales={salesData?.results.Sales || []}
                                    sortBy={filters.sortBy}
                                    sortOrder={filters.sortOrder}
                                    onSort={handleSort}
                                />

                                {salesData && (
                                    <Pagination
                                        pagination={salesData.pagination}
                                        loading={loading}
                                        currentPage={currentPage}
                                        totalResults={salesData.results.Sales.length}
                                        onNext={handleNextPage}
                                        onPrev={handlePrevPage}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;