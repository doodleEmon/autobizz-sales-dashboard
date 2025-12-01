'use client';

import React, { useState } from 'react';
import { Filters } from '@/lib/types';

interface FilterControlsProps {
    filters: Filters;
    onFilterChange: (filters: Partial<Filters>) => void;
}

const FilterControls = ({
    filters,
    onFilterChange,
}: FilterControlsProps) => {
    const [localFilters, setLocalFilters] = useState({
        priceMin: filters.priceMin,
        email: filters.email,
        phone: filters.phone,
    });

    const handleChange = (key: keyof typeof localFilters, value: string) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        onFilterChange(localFilters);
    };

    const handleClear = () => {
        const clearedFilters = {
            priceMin: '',
            email: '',
            phone: '',
        };
        setLocalFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Price
                </label>
                <input
                    type="number"
                    min="0"
                    value={localFilters.priceMin}
                    onChange={(e) => handleChange('priceMin', e.target.value)}
                    placeholder="e.g., 100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email
                </label>
                <input
                    type="email"
                    value={localFilters.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g., john@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                </label>
                <input
                    type="tel"
                    value={localFilters.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="e.g., +1111111"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleApply}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                    Apply Filters
                </button>
                <button
                    onClick={handleClear}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default FilterControls;