import React, { useEffect } from 'react';
import { VehicleFilters, FilterValues } from './VehicleFilters';
import { Location } from '../../types';
import { Button } from '../ui/Button';
import { X, SlidersHorizontal } from 'lucide-react';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterValues;
  onChange: (updates: Partial<FilterValues>) => void;
  onReset: () => void;
  locations: Location[];
  totalResults: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  locations,
  totalResults,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-900 text-sm">Filters & Sorting</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          <VehicleFilters
            filters={filters}
            onChange={onChange}
            onReset={onReset}
            locations={locations}
            totalResults={totalResults}
          />
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <Button onClick={onClose} className="w-full font-bold">
            Show {totalResults} Vehicles
          </Button>
        </div>
      </div>
    </div>
  );
};
