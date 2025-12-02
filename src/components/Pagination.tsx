'use client';

import { PaginationTokens } from '@/lib/types';
import { BsDot } from 'react-icons/bs';
import { MdKeyboardArrowLeft } from 'react-icons/md';

interface PaginationProps {
    pagination: PaginationTokens;
    loading: boolean;
    currentPage: number;
    totalResults: number;
    onNext: () => void;
    onPrev: () => void;
}

const Pagination = ({
    pagination,
    loading,
    currentPage,
    totalResults,
    onNext,
    onPrev,
}: PaginationProps) => {
    const hasNext = !!pagination.after && !loading;
    const hasPrev = currentPage > 1 && !!pagination.before && !loading;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-600 flex items-center">
                <span className="font-medium text-gray-900">Page {currentPage}</span>
                {totalResults > 0 && (
                    <span className="flex items-center">
                        <BsDot size={20} /> Showing {totalResults} result{totalResults !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className={`
                        inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg
                        transition-all duration-200
                        ${hasPrev
                            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm cursor-pointer'
                            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                        }
                    `}
                    aria-label="Go to previous page"
                >
                    <MdKeyboardArrowLeft 
                        size={20} 
                        className={`mr-1 ${hasPrev ? 'text-gray-700' : 'text-gray-400'}`} 
                    />
                    Previous
                </button>

                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={`
                        inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg
                        transition-all duration-200
                        ${hasNext
                            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm cursor-pointer'
                            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                        }
                    `}
                    aria-label="Go to next page"
                >
                    Next
                    <MdKeyboardArrowLeft 
                        size={20} 
                        className={`ml-1 rotate-180 ${hasNext ? 'text-gray-700' : 'text-gray-400'}`} 
                    />
                </button>
            </div>
        </div>
    );
};

export default Pagination;