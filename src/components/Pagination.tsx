import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}: PaginationProps) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 p-4 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-700">per page</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => typeof pageNumber === 'number' && onPageChange(pageNumber)}
            disabled={pageNumber === '...'}
            className={`px-3 py-1 rounded-lg border transition-colors ${
              pageNumber === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : pageNumber === '...'
                ? 'border-transparent cursor-default'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}