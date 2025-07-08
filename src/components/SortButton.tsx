import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { SortState } from '../types';

interface SortButtonProps {
  column: string;
  currentSort: SortState;
  onClick: () => void;
}

export default function SortButton({ column, currentSort, onClick }: SortButtonProps) {
  const getSortIcon = () => {
    switch (currentSort) {
      case 'asc':
        return <ChevronUp className="h-4 w-4" />;
      case 'desc':
        return <ChevronDown className="h-4 w-4" />;
      default:
        return <ChevronsUpDown className="h-4 w-4" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
    >
      <span className="font-medium">{column}</span>
      {getSortIcon()}
    </button>
  );
}