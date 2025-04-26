
import React from 'react';
import { Search, X } from 'lucide-react';

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const MenuSearch: React.FC<MenuSearchProps> = ({ value, onChange, className }) => {
  return (
    <div className={className}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search our menu..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-restaurant-green/30"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        {value && (
          <button 
            onClick={() => onChange('')}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuSearch;
