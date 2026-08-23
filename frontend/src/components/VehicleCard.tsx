import type { Dispatch, SetStateAction } from 'react';
import type { Vehicle } from '../services/api';

type Props = {
  vehicle: Vehicle;
  role: string;
  restockValues: Record<number, number>;
  onPurchase: (vehicleId: number) => Promise<void> | void;
  onRestock: (vehicleId: number, quantity: number) => Promise<void> | void;
  onDelete: (vehicleId: number) => Promise<void> | void;
  setRestockValues: Dispatch<SetStateAction<Record<number, number>>>;
};

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export function VehicleCard({
  vehicle,
  role,
  restockValues,
  onPurchase,
  onRestock,
  onDelete,
  setRestockValues,
}: Props) {
  return (
    <article className="vehicle-card" key={vehicle.id}>
      <div className="vehicle-card-header">
        <div>
          <p className="mini-label">MAKE</p>
          <h3>{vehicle.make.toUpperCase()}</h3>
        </div>
        <div>
          <p className="mini-label">MODEL</p>
          <h3>{vehicle.model.toUpperCase()}</h3>
        </div>
      </div>

      <div className="vehicle-meta">
        <p>
          <span className="meta-label">CATEGORY</span>
          {vehicle.category}
        </p>
        <p>
          <span className="meta-label">PRICE</span>
          {formatPrice(vehicle.price)}
        </p>
        <p>
          <span className="meta-label">STOCK</span>
          {vehicle.quantity}
        </p>
      </div>

      <div className="vehicle-card-actions">
        {vehicle.quantity === 0 ? (
          <button type="button" className="stock-button disabled" disabled>
            OUT OF STOCK
          </button>
        ) : (
          <button type="button" className="primary-button small" onClick={() => onPurchase(vehicle.id)}>
            Purchase
          </button>
        )}

        {role === 'admin' && (
          <div className="admin-actions">
            <div className="restock-row">
              <input
                type="number"
                min="1"
                value={restockValues[vehicle.id] ?? 1}
                onChange={(event) =>
                  setRestockValues((current) => ({
                    ...current,
                    [vehicle.id]: Number(event.target.value),
                  }))
                }
              />
              <button
                type="button"
                className="secondary-button"
                onClick={() => onRestock(vehicle.id, Number(restockValues[vehicle.id] ?? 1))}
              >
                RESTOCK
              </button>
            </div>
            <button type="button" className="danger-button" onClick={() => onDelete(vehicle.id)}>
              DELETE
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
