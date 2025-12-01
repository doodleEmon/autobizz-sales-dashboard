'use client';

import { PaginationTokens } from '@/lib/types';

interface PaginationProps {
    pagination: PaginationTokens;
    loading: boolean;
    onNext: (afterToken: string) => void;
    onPrev: (beforeToken: string) => void;
}

const Pagination = ({
    pagination,
    loading,
    onNext,
    onPrev,
}: PaginationProps) => {
    const hasNext = !!pagination.after;
    const hasPrev = !!pagination.before;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
                {hasNext || hasPrev ? (
                    <span>Using token-based pagination (before/after tokens)</span>
                ) : (
                    <span>First page - navigate to see more records</span>
                )}
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => onPrev(pagination.before!)}
                    disabled={!hasPrev || loading}
                    className={`
            inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg
            transition-colors duration-200
            ${hasPrev && !loading
                            ? 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
                        }
          `}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Page
                </button>

                <div className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded">
                    Token: {pagination.after ? '↗' : pagination.before ? '↖' : '•'}
                </div>

                <button
                    onClick={() => onNext(pagination.after!)}
                    disabled={!hasNext || loading}
                    className={`
            inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg
            transition-colors duration-200
            ${hasNext && !loading
                            ? 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
                        }
          `}
                >
                    Next Page
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;