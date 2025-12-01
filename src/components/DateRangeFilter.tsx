'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
}

const DateRangeFilter = ({
  startDate,
  endDate,
  onDateChange,
}: DateRangeFilterProps) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  const handleApply = () => {
    if (localStartDate && localEndDate) {
      onDateChange(localStartDate, localEndDate);
    }
  };

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    const newStartDate = format(start, 'yyyy-MM-dd');
    const newEndDate = format(end, 'yyyy-MM-dd');
    
    setLocalStartDate(newStartDate);
    setLocalEndDate(newEndDate);
    onDateChange(newStartDate, newEndDate);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Quick Select</p>
        <div className="flex flex-wrap gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => handleQuickSelect(days)}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Last {days} days
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleApply}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
      >
        Apply Date Range
      </button>
    </div>
  );
};

export default DateRangeFilter;