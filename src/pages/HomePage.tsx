import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Vehicle } from '../types';
import { AhmedabadTrip } from '../services/mockData';
import { useBooking } from '../context/BookingContext';
import { Hero } from '../components/home/Hero';
import { PopularVehicles } from '../components/home/PopularVehicles';
import { AhmedabadFuturisticMap } from '../components/home/AhmedabadFuturisticMap';
import { AhmedabadTrips } from '../components/home/AhmedabadTrips';
import { Categories } from '../components/home/Categories';
import { HowItWorks } from '../components/home/HowItWorks';
import { WhyRentro } from '../components/home/WhyRentro';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { FinalCTA } from '../components/home/FinalCTA';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectVehicle }) => {
  const { updateSearch } = useBooking();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const list = await apiService.getVehicles();
      setVehicles(list);
    };
    fetchVehicles();
  }, []);

  const handleSearchTrigger = () => {
    onNavigate('/vehicles');
  };

  const handleCategorySelect = (type: 'all' | 'car' | 'bike', category?: string, fuel?: string) => {
    updateSearch({ vehicleType: type });
    onNavigate('/vehicles');
  };

  const handleSelectHubFromMap = (hubId: string) => {
    updateSearch({ pickupLocationId: hubId, returnLocationId: hubId });
    onNavigate('/vehicles');
  };

  const handlePlanTrip = (_trip: AhmedabadTrip) => {
    onNavigate('/vehicles');
  };

  const handleScrollToMap = () => {
    const el = document.getElementById('ahmedabad-map');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#07080c] text-white">
      {/* 1. Premium Hero (with embedded Search Widget) */}
      <Hero
        onSearch={handleSearchTrigger}
        onBrowse={() => onNavigate('/vehicles')}
        onExploreAhmedabad={handleScrollToMap}
      />

      {/* 2. Available Vehicles (Empty state if 0 real vehicles, real cards if added by admin) */}
      <PopularVehicles
        vehicles={vehicles}
        onSelectVehicle={onSelectVehicle}
        onBrowseAll={() => onNavigate('/vehicles')}
        onExploreMap={handleScrollToMap}
      />

      {/* 3. Futuristic Ahmedabad Map */}
      <div id="ahmedabad-map">
        <AhmedabadFuturisticMap
          vehicles={vehicles}
          onSelectHub={handleSelectHubFromMap}
        />
      </div>

      {/* 4. Explore Ahmedabad with Rentro / Popular Ahmedabad Trips */}
      <AhmedabadTrips onPlanTrip={handlePlanTrip} />

      {/* 5. Categories Showcase */}
      <Categories onSelectCategory={handleCategorySelect} />

      {/* 6. How It Works 4-Step Guide */}
      <HowItWorks />

      {/* 7. Why Rentro Benefits */}
      <WhyRentro />

      {/* 8. Real Customer Reviews from Ahmedabad */}
      <CustomerReviews />

      {/* 9. Final Conversion CTA */}
      <FinalCTA onBrowse={() => onNavigate('/vehicles')} />
    </div>
  );
};
