
import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchFiltersProps {
  searchTerm: string;
  filterType: 'all' | 'introduced' | 'not-introduced';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: 'all' | 'introduced' | 'not-introduced') => void;
}

export const SearchFilters = ({ 
  searchTerm, 
  filterType, 
  onSearchChange, 
  onFilterChange 
}: SearchFiltersProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value as any)}
            className="px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Foods</option>
            <option value="introduced">Introduced</option>
            <option value="not-introduced">Not Introduced</option>
          </select>
        </div>
      </div>
    </div>
  );
};
