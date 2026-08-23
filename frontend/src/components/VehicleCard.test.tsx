import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VehicleCard } from './VehicleCard';

const vehicle = {
  id: 1,
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 2500000,
  quantity: 0,
};

describe('VehicleCard', () => {
  it('disables the purchase button when the vehicle is out of stock', () => {
    render(
      <VehicleCard
        vehicle={vehicle}
        role="user"
        restockValues={{}}
        onPurchase={vi.fn()}
        onRestock={vi.fn()}
        onDelete={vi.fn()}
        setRestockValues={vi.fn()}
      />
    );

    const button = screen.getByRole('button', {
      name: /out of stock/i,
    });

    expect(button).toBeDisabled();
  });
});