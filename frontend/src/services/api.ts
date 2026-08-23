export type Vehicle = {
  id: number;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
};

export const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const fetchVehicles = async (token: string): Promise<Vehicle[]> => {
  const response = await fetch(`${API_URL}/vehicles`, {
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch vehicles');
  }

  return data;
};

export const registerUser = async (payload: { email: string; password: string }) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data as { token: string; role: string };
};

export const purchaseVehicle = async (token: string, vehicleId: number) => {
  const response = await fetch(`${API_URL}/vehicles/${vehicleId}/purchase`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Purchase failed');
  }

  return data;
};

export const createVehicle = async (token: string, vehicle: Record<string, string | number>) => {
  const response = await fetch(`${API_URL}/vehicles`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(vehicle),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to add vehicle');
  }

  return data;
};

export const restockVehicle = async (token: string, vehicleId: number, quantity: number) => {
  const response = await fetch(`${API_URL}/vehicles/${vehicleId}/restock`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ quantity }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Restock failed');
  }

  return data;
};

export const deleteVehicle = async (token: string, vehicleId: number) => {
  const response = await fetch(`${API_URL}/vehicles/${vehicleId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Delete failed');
  }

  return data;
};
