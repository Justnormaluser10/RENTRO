import React, { createContext, useContext, useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { calculateDurationHours } from '../lib/utils';

interface SearchState {
  vehicleType: 'all' | 'car' | 'bike';
  pickupLocationId: string;
  returnLocationId: string;
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:mm
  returnDate: string; // YYYY-MM-DD
  returnTime: string; // HH:mm
}

interface BookingContextType {
  searchState: SearchState;
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>;
  updateSearch: (updates: Partial<SearchState>) => void;
  startDateTimeISO: string;
  endDateTimeISO: string;
  durationHours: number;
  draftVehicle: Vehicle | null;
  setDraftVehicle: (vehicle: Vehicle | null) => void;
  applyQuickDurationPreset: (preset: '1h' | '6h' | '1d' | '2d' | '3d' | '7d') => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Helper to format Date to YYYY-MM-DD
function formatYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default search state: Tomorrow 10:00 AM to Day after tomorrow 10:00 AM (2 days default)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const twoDaysLater = new Date(tomorrow);
  twoDaysLater.setDate(twoDaysLater.getDate() + 2);

  const [searchState, setSearchState] = useState<SearchState>({
    vehicleType: 'all',
    pickupLocationId: 'loc-1',
    returnLocationId: 'loc-1',
    pickupDate: formatYYYYMMDD(tomorrow),
    pickupTime: '10:00',
    returnDate: formatYYYYMMDD(twoDaysLater),
    returnTime: '10:00',
  });

  const [draftVehicle, setDraftVehicle] = useState<Vehicle | null>(null);

  const updateSearch = (updates: Partial<SearchState>) => {
    setSearchState(prev => ({ ...prev, ...updates }));
  };

  const startDateTimeISO = useMemo(() => {
    return `${searchState.pickupDate}T${searchState.pickupTime}:00`;
  }, [searchState.pickupDate, searchState.pickupTime]);

  const endDateTimeISO = useMemo(() => {
    return `${searchState.returnDate}T${searchState.returnTime}:00`;
  }, [searchState.returnDate, searchState.returnTime]);

  const durationHours = useMemo(() => {
    return calculateDurationHours(startDateTimeISO, endDateTimeISO);
  }, [startDateTimeISO, endDateTimeISO]);

  const applyQuickDurationPreset = (preset: '1h' | '6h' | '1d' | '2d' | '3d' | '7d') => {
    const start = new Date(`${searchState.pickupDate}T${searchState.pickupTime}:00`);
    const end = new Date(start);

    switch (preset) {
      case '1h':
        end.setHours(end.getHours() + 1);
        break;
      case '6h':
        end.setHours(end.getHours() + 6);
        break;
      case '1d':
        end.setDate(end.getDate() + 1);
        break;
      case '2d':
        end.setDate(end.getDate() + 2);
        break;
      case '3d':
        end.setDate(end.getDate() + 3);
        break;
      case '7d':
        end.setDate(end.getDate() + 7);
        break;
    }

    setSearchState(prev => ({
      ...prev,
      returnDate: formatYYYYMMDD(end),
      returnTime: `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`,
    }));
  };

  return (
    <BookingContext.Provider
      value={{
        searchState,
        setSearchState,
        updateSearch,
        startDateTimeISO,
        endDateTimeISO,
        durationHours,
        draftVehicle,
        setDraftVehicle,
        applyQuickDurationPreset,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
