import type { Dispatch, SetStateAction } from 'react';
import { VehicleCard } from './VehicleCard';
import type { Vehicle } from '../services/api';

type Props = {
  vehicles: Vehicle[];
  search: string;
  setSearch: (value: string) => void;
  loading: boolean;
  role: string;
  restockValues: Record<number, number>;
  setRestockValues: Dispatch<SetStateAction<Record<number, number>>>;
  onSearch: () => Promise<void> | void;
  onPurchase: (vehicleId: number) => Promise<void> | void;
  onRestock: (vehicleId: number, quantity: number) => Promise<void> | void;
  onDelete: (vehicleId: number) => Promise<void> | void;
  onLogout: () => void;
};

export function VehicleDashboard({
  vehicles,
  search,
  setSearch,
  loading,
  role,
  restockValues,
  setRestockValues,
  onSearch,
  onPurchase,
  onRestock,
  onDelete,
  onLogout,
}: Props) {
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!search.trim()) {
      return true;
    }

    const query = search.toLowerCase();
    return (
      vehicle.make.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      vehicle.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <div className="brand-row">
            <span className="brand-mark">C</span>
            <span className="brand-name">CAR DEALERSHIP</span>
          </div>
          <p className="header-subtitle">Vehicle Inventory Management System</p>
        </div>

        <div className="header-actions">
          <span className="role-badge">{role}</span>
          <button type="button" className="ghost-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-topbar">
          <div>
            <p className="section-eyebrow">Fleet overview</p>
            <h2>VEHICLE INVENTORY</h2>
            <p className="section-subtitle">Manage and monitor showroom vehicles</p>
          </div>
        </section>

        <section className="search-panel">
          <div className="search-header">
            <h3>SEARCH VEHICLES</h3>
          </div>
          <div className="search-controls">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by make, model or category..."
            />
            <button type="button" className="primary-button" onClick={() => onSearch()}>
              Search
            </button>
          </div>
        </section>

        {loading ? (
          <div className="loading-box">Loading vehicles...</div>
        ) : (
          <section className="vehicle-grid">
            {filteredVehicles.length === 0 ? (
              <div className="empty-state">No vehicles match your search.</div>
            ) : (
              filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  role={role}
                  restockValues={restockValues}
                  setRestockValues={setRestockValues}
                  onPurchase={onPurchase}
                  onRestock={onRestock}
                  onDelete={onDelete}
                />
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}
