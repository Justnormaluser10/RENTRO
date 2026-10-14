import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Vehicle, VehicleCategoryFilter } from '../types';
import { AhmedabadTrip } from '../services/mockData';
import { useBooking } from '../context/BookingContext';
import { Hero } from '../components/home/Hero';
import { TheProblem } from '../components/home/TheProblem';
import { MeetRentroSolution } from '../components/home/MeetRentroSolution';
import { CustomerJourney } from '../components/home/CustomerJourney';
import { VehicleCategories } from '../components/home/VehicleCategories';
import { PopularVehicles } from '../components/home/PopularVehicles';
import { WhyRentro } from '../components/home/WhyRentro';
import { AppExperience } from '../components/home/AppExperience';
import { LaunchPlan } from '../components/home/LaunchPlan';
import { AhmedabadFuturisticMap } from '../components/home/AhmedabadFuturisticMap';
import { AhmedabadTrips } from '../components/home/AhmedabadTrips';
import { CustomerPartnerValue } from '../components/home/CustomerPartnerValue';
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

  const handleCategorySelect = (category: VehicleCategoryFilter) => {
    updateSearch({ vehicleType: category });
    onNavigate('/vehicles');
  };

  const handleCitySelect = (city: 'Vadodara' | 'Ahmedabad') => {
    updateSearch({ city });
    onNavigate('/vehicles');
  };

  const handleSelectHubFromMap = (hubId: string) => {
    updateSearch({ city: 'Ahmedabad', pickupLocationId: hubId, returnLocationId: hubId });
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

  const handleScrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#080c14] text-white">
      {/* 1. PDF Page 1 — Brand and Hero with Search Widget */}
      <Hero
        onSearch={handleSearchTrigger}
        onBrowse={() => onNavigate('/vehicles')}
        onExploreAhmedabad={handleScrollToMap}
      />

      {/* 2. PDF Page 2 — 01 • THE PROBLEM */}
      <TheProblem />

      {/* 3. PDF Page 3 — 02 • OUR SOLUTION (Meet RENTRO) */}
      <MeetRentroSolution onSelectCategory={handleCategorySelect} />

      {/* 4. PDF Page 4 — 03 • CUSTOMER JOURNEY (4 Simple Steps) */}
      <CustomerJourney
        onSearchClick={handleScrollToSearch}
        onBrowseClick={() => onNavigate('/vehicles')}
      />

      {/* 5. PDF Page 5 — 04 • WHAT YOU CAN RENT (Bikes, Scooters, Cars, EVs) */}
      <VehicleCategories onSelectCategory={handleCategorySelect} />

      {/* 6. Real Vehicle Inventory Showcase (shows real fleet or empty state) */}
      <PopularVehicles
        vehicles={vehicles}
        onSelectVehicle={onSelectVehicle}
        onBrowseAll={() => onNavigate('/vehicles')}
        onExploreMap={handleScrollToMap}
      />

      {/* 7. PDF Page 6 — 05 • WHY RENTRO (Quotation Banner & 4 Numbered Features) */}
      <WhyRentro />

      {/* 8. PDF Page 7 — 06 • APP EXPERIENCE (6 Effortless Interface Cards) */}
      <AppExperience
        onSearchClick={handleScrollToSearch}
        onBrowseClick={() => onNavigate('/vehicles')}
      />

      {/* 9. PDF Page 8 — 07 • LAUNCH PLAN (Vadodara Pilot + Ahmedabad Expansion) */}
      <LaunchPlan onSelectCity={handleCitySelect} />

      {/* 10. Futuristic Ahmedabad Map & Scenic Trips */}
      <div id="ahmedabad-map">
        <AhmedabadFuturisticMap
          vehicles={vehicles}
          onSelectHub={handleSelectHubFromMap}
        />
      </div>

      <AhmedabadTrips onPlanTrip={handlePlanTrip} />

      {/* 11. PDF Page 9 — 08 • VALUE (Why Customers and Partners Win) */}
      <CustomerPartnerValue />

      {/* 12. PDF Page 10 — Final Call to Action */}
      <FinalCTA onBrowse={() => onNavigate('/vehicles')} />
    </div>
  );
};

export default HomePage;
