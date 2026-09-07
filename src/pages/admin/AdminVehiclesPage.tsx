import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Vehicle, Location, VehicleType, FuelType, TransmissionType, VehicleStatus, VehicleCategory } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { 
  Car, 
  Bike, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Wrench, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Fuel,
  Gauge
} from 'lucide-react';

export const AdminVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'car' | 'bike'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchVehicles = async () => {
    setIsLoading(true);
    const [vList, lList] = await Promise.all([
      apiService.getVehicles(),
      apiService.getLocations(),
    ]);
    setVehicles(vList);
    setLocations(lList);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAdd = () => {
    setEditingVehicle({
      brand: '',
      model: '',
      registration_number: '',
      type: 'car',
      category: 'suv',
      year: 2024,
      fuel: 'petrol',
      transmission: 'automatic',
      seats: 5,
      description: 'Well-maintained self-drive vehicle with clean interiors and complete service history.',
      features: ['Air Conditioning', 'Bluetooth Audio', 'Fastag Enabled', 'ABS & Airbags'],
      location_id: locations[0]?.id || 'loc-1',
      status: 'AVAILABLE',
      pricing: {
        vehicle_id: '',
        hourly_rate: 250,
        six_hour_rate: 1000,
        daily_rate: 1800,
        weekly_rate: 9500,
        security_deposit: 3000,
        tax_rate_percent: 18,
      },
      images: [
        {
          id: 'img-new',
          vehicle_id: '',
          image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
          is_primary: true,
          display_order: 1,
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle({ ...v });
    setIsModalOpen(true);
  };

  const handleToggleMaintenance = async (v: Vehicle) => {
    const newStatus: VehicleStatus = v.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    await apiService.adminSaveVehicle({ ...v, status: newStatus });
    await fetchVehicles();
  };

  const handleDelete = async (vehicleId: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle from the active fleet?')) {
      await apiService.adminDeleteVehicle(vehicleId);
      await fetchVehicles();
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    setIsSaving(true);
    await apiService.adminSaveVehicle(editingVehicle);
    setIsSaving(false);
    setIsModalOpen(false);
    await fetchVehicles();
  };

  const filtered = vehicles.filter((v) => {
    if (typeFilter !== 'all' && v.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.registration_number.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Fleet Vehicle Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add new inventory, configure hourly/daily pricing, and toggle maintenance status.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 font-bold text-xs bg-emerald-600 hover:bg-emerald-500">
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({vehicles.length})
          </button>
          <button
            onClick={() => setTypeFilter('car')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'car' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Cars ({vehicles.filter(v => v.type === 'car').length})
          </button>
          <button
            onClick={() => setTypeFilter('bike')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'bike' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            Bikes ({vehicles.filter(v => v.type === 'bike').length})
          </button>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search make, model, reg..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-xs"
            leftIcon={<Search className="w-4 h-4 text-slate-500" />}
          />
        </div>
      </div>

      {/* Fleet Vehicles Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700 bg-slate-900/50 font-semibold">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Reg No.</th>
                <th className="p-4">Category</th>
                <th className="p-4">Hub Location</th>
                <th className="p-4">Configured Rates</th>
                <th className="p-4">Security Deposit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-750/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={v.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80'}
                        alt={v.model}
                        className="w-12 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">{v.brand}</span>
                        <span className="font-bold text-white text-sm">{v.model}</span>
                        <span className="text-[10px] text-slate-500 block capitalize">{v.year} • {v.fuel} • {v.transmission}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-300">{v.registration_number}</td>
                  <td className="p-4 uppercase font-semibold text-[11px] text-slate-400">{v.category}</td>
                  <td className="p-4 text-slate-300">{v.location?.name?.split(' ')[0] || 'SG Highway'}</td>
                  <td className="p-4 space-y-0.5">
                    <div className="font-bold text-white">{formatCurrency(v.pricing.daily_rate)}/day</div>
                    <div className="text-[10px] text-slate-400">₹{v.pricing.hourly_rate}/hr • ₹{v.pricing.six_hour_rate}/6hr</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-300">{formatCurrency(v.pricing.security_deposit)}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold ${
                      v.status === 'AVAILABLE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      v.status === 'BOOKED' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                      v.status === 'MAINTENANCE' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleMaintenance(v)}
                      title={v.status === 'MAINTENANCE' ? 'Mark Available' : 'Mark Maintenance'}
                      className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(v)}
                      title="Edit vehicle & pricing"
                      className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      title="Delete vehicle"
                      className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && editingVehicle && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title={editingVehicle.id ? `Edit ${editingVehicle.brand} ${editingVehicle.model}` : 'Add New Vehicle to Fleet'}
          description="Configure vehicle details, specifications, and tiered pricing schedule."
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveSubmit} className="space-y-5 text-slate-900">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Brand / Manufacturer"
                value={editingVehicle.brand}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
                placeholder="e.g. Hyundai, Royal Enfield"
                required
              />
              <Input
                label="Model Name"
                value={editingVehicle.model}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                placeholder="e.g. Creta SX (O)"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Registration Plate Number"
                value={editingVehicle.registration_number}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, registration_number: e.target.value })}
                placeholder="e.g. GJ 01 AB 1234"
                required
              />
              <Select
                label="Vehicle Type"
                value={editingVehicle.type}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, type: e.target.value as VehicleType })}
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
              </Select>
              <Select
                label="Category"
                value={editingVehicle.category}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value as VehicleCategory })}
              >
                <option value="suv">SUV</option>
                <option value="sedan">Sedan</option>
                <option value="hatchback">Hatchback</option>
                <option value="cruiser">Cruiser</option>
                <option value="scooter">Scooter</option>
                <option value="sport">Sport</option>
                <option value="electric">Electric</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                label="Year"
                type="number"
                value={editingVehicle.year}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, year: Number(e.target.value) })}
                required
              />
              <Select
                label="Fuel"
                value={editingVehicle.fuel}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel: e.target.value as FuelType })}
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="cng">CNG</option>
              </Select>
              <Select
                label="Transmission"
                value={editingVehicle.transmission}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, transmission: e.target.value as TransmissionType })}
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </Select>
              <Input
                label="Seats"
                type="number"
                value={editingVehicle.seats}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, seats: Number(e.target.value) })}
                required
              />
            </div>

            {/* Hub Location & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Assigned Hub Location"
                value={editingVehicle.location_id}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, location_id: e.target.value })}
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Status"
                value={editingVehicle.status}
                onChange={(e) => setEditingVehicle({ ...editingVehicle, status: e.target.value as VehicleStatus })}
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="BOOKED">BOOKED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
              </Select>
            </div>

            {/* Configurable Pricing Matrix */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Configurable Pricing Rates (INR ₹)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Input
                  label="Hourly Rate"
                  type="number"
                  value={editingVehicle.pricing?.hourly_rate}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      pricing: { ...editingVehicle.pricing!, hourly_rate: Number(e.target.value) },
                    })
                  }
                  required
                />
                <Input
                  label="6-Hour Rate"
                  type="number"
                  value={editingVehicle.pricing?.six_hour_rate}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      pricing: { ...editingVehicle.pricing!, six_hour_rate: Number(e.target.value) },
                    })
                  }
                  required
                />
                <Input
                  label="Daily Rate"
                  type="number"
                  value={editingVehicle.pricing?.daily_rate}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      pricing: { ...editingVehicle.pricing!, daily_rate: Number(e.target.value) },
                    })
                  }
                  required
                />
                <Input
                  label="Weekly Rate"
                  type="number"
                  value={editingVehicle.pricing?.weekly_rate}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      pricing: { ...editingVehicle.pricing!, weekly_rate: Number(e.target.value) },
                    })
                  }
                  required
                />
                <Input
                  label="Deposit"
                  type="number"
                  value={editingVehicle.pricing?.security_deposit}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      pricing: { ...editingVehicle.pricing!, security_deposit: Number(e.target.value) },
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Image URL & Description */}
            <div className="space-y-4">
              <Input
                label="Primary Vehicle Photo URL"
                value={editingVehicle.images?.[0]?.image_url || ''}
                onChange={(e) =>
                  setEditingVehicle({
                    ...editingVehicle,
                    images: [
                      {
                        id: 'img-1',
                        vehicle_id: editingVehicle.id || '',
                        image_url: e.target.value,
                        is_primary: true,
                        display_order: 1,
                      },
                    ],
                  })
                }
                placeholder="https://images.unsplash.com/..."
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingVehicle.description}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" isLoading={isSaving} className="font-bold">
                Save Vehicle
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
