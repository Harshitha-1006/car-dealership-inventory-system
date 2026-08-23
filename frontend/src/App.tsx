import { useEffect, useState } from 'react';
import './App.css';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { VehicleDashboard } from './components/VehicleDashboard';
import { AdminVehicleForm } from './components/AdminVehicleForm';
import { useAuth } from './hooks/useAuth';
import {
  createVehicle,
  deleteVehicle,
  fetchVehicles,
  loginUser,
  purchaseVehicle,
  registerUser,
  restockVehicle,
  type Vehicle,
} from './services/api';

type View = 'register' | 'login' | 'dashboard';

const emptyVehicleForm = {
  make: '',
  model: '',
  category: '',
  price: '',
  quantity: '',
};

function App() {
  const [view, setView] = useState<View>('register');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState(emptyVehicleForm);
  const [restockValues, setRestockValues] = useState<Record<number, number>>({});

  const { token, role, login, logout } = useAuth();

  const fetchInventory = async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchVehicles(token);
      setVehicles(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'dashboard' && token) {
      void fetchInventory();
    }
  }, [view, token]);

  const handleRegister = async (payload: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setError('');
    setSuccess('');

    try {
      await registerUser({
        email: payload.email,
        password: payload.password,
      });

      setSuccess('Account created successfully. Please sign in.');
      setView('login');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLogin = async (payload: { email: string; password: string }) => {
    setError('');
    setSuccess('');

    try {
      const data = await loginUser(payload);
      login(data.token, data.role);
      setView('dashboard');
      setSuccess('Login successful');
      await fetchInventory();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLogout = () => {
    logout();
    setView('login');
    setSuccess('');
    setError('');
  };

  const handlePurchase = async (vehicleId: number) => {
    if (!token) {
      setError('Please log in to purchase a vehicle.');
      return;
    }

    try {
      await purchaseVehicle(token, vehicleId);
      setSuccess('Vehicle purchased successfully');
      await fetchInventory();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddVehicle = async (payload: {
    make: string;
    model: string;
    category: string;
    price: string;
    quantity: string;
  }) => {
    if (!token) {
      setError('Please log in to add a vehicle.');
      return;
    }

    setError('');
    setSuccess('');

    try {
      await createVehicle(token, {
        ...payload,
        price: Number(payload.price),
        quantity: Number(payload.quantity),
      });

      setSuccess('Vehicle added successfully');
      setNewVehicle(emptyVehicleForm);
      setShowAddVehicle(false);
      await fetchInventory();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleRestock = async (vehicleId: number, quantity: number) => {
    if (!token) {
      setError('Please log in to restock a vehicle.');
      return;
    }

    try {
      await restockVehicle(token, vehicleId, quantity);
      setSuccess('Vehicle restocked successfully');
      await fetchInventory();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    if (!token) {
      setError('Please log in to delete a vehicle.');
      return;
    }

    try {
      await deleteVehicle(token, vehicleId);
      setSuccess('Vehicle deleted successfully');
      await fetchInventory();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (view === 'register') {
    return <Register onSubmit={handleRegister} onGoToLogin={() => setView('login')} error={error} success={success} />;
  }

  if (view === 'login') {
    return <Login onSubmit={handleLogin} onGoToRegister={() => setView('register')} error={error} success={success} />;
  }

  return (
    <>
      {role === 'admin' && (
        <AdminVehicleForm
          isOpen={showAddVehicle}
          onToggle={() => setShowAddVehicle((current) => !current)}
          onSubmit={handleAddVehicle}
          form={newVehicle}
          onFieldChange={(field, value) =>
            setNewVehicle((current) => ({
              ...current,
              [field]: value,
            }))
          }
        />
      )}

      <VehicleDashboard
        vehicles={vehicles}
        search={search}
        setSearch={setSearch}
        loading={loading}
        role={role}
        restockValues={restockValues}
        setRestockValues={setRestockValues}
        onSearch={() => fetchInventory()}
        onPurchase={handlePurchase}
        onRestock={handleRestock}
        onDelete={handleDeleteVehicle}
        onLogout={handleLogout}
      />

      {error && <div className="form-alert error" style={{ maxWidth: 1200, margin: '0 auto 16px' }}>{error}</div>}
      {success && <div className="form-alert success" style={{ maxWidth: 1200, margin: '0 auto 16px' }}>{success}</div>}
    </>
  );
}

export default App;
