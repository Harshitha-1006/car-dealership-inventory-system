import type { FormEvent } from 'react';

type Props = {
  isOpen: boolean;
  onSubmit: (payload: {
    make: string;
    model: string;
    category: string;
    price: string;
    quantity: string;
  }) => Promise<void> | void;
  onToggle: () => void;
  form: {
    make: string;
    model: string;
    category: string;
    price: string;
    quantity: string;
  };
  onFieldChange: (field: string, value: string) => void;
};

export function AdminVehicleForm({ isOpen, onSubmit, onToggle, form, onFieldChange }: Props) {
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <section className="admin-panel">
      <div className="panel-header-row">
        <h3>ADMIN CONTROL</h3>
        <button type="button" className="primary-button small" onClick={onToggle}>
          + ADD VEHICLE
        </button>
      </div>

      {isOpen && (
        <form className="add-vehicle-form" onSubmit={handleSubmit}>
          <div className="input-grid">
            <input
              type="text"
              placeholder="Make"
              value={form.make}
              onChange={(event) => onFieldChange('make', event.target.value)}
            />
            <input
              type="text"
              placeholder="Model"
              value={form.model}
              onChange={(event) => onFieldChange('model', event.target.value)}
            />
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(event) => onFieldChange('category', event.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(event) => onFieldChange('price', event.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(event) => onFieldChange('quantity', event.target.value)}
            />
          </div>
          <button type="submit" className="primary-button small">
            SAVE VEHICLE
          </button>
        </form>
      )}
    </section>
  );
}
