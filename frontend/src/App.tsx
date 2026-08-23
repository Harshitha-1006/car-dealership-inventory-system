import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';

type View = 'register' | 'login' | 'dashboard';

type Vehicle = {
  id: number;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
};

const API_URL = 'http://localhost:3000/api';

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const isValidGmail = (value: string) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value.trim());

const isValidPassword = (value: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
};

function App() {
  const [view, setView] = useState<View>('register');
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const [registerErrors, setRegisterErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    category: '',
    price: '',
    quantity: '',
  });

  const [restockValues, setRestockValues] = useState<Record<number, number>>({});

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/vehicles`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vehicles');
      }

      setVehicles(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'dashboard' && token) {
      fetchVehicles();
    }
  }, [view, token]);

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

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const nextErrors = {
      email: '',
      password: '',
      confirmPassword: '',
    };

    const trimmedEmail = registerForm.email.trim();

    if (!trimmedEmail || !isValidGmail(trimmedEmail)) {
      nextErrors.email = 'Use a valid Gmail address ending in @gmail.com';
    }

    if (!registerForm.password || !isValidPassword(registerForm.password)) {
      nextErrors.password =
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
    }

    if (!registerForm.confirmPassword || registerForm.confirmPassword !== registerForm.password) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setRegisterErrors(nextErrors);

    if (nextErrors.email || nextErrors.password || nextErrors.confirmPassword) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          password: registerForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setRegisterForm({ email: '', password: '', confirmPassword: '' });
      setRegisterErrors({ email: '', password: '', confirmPassword: '' });
      setSuccess('Account created successfully. Please sign in.');
      setView('login');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email.trim(),
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setRole(data.role);
      setLoginForm({ email: '', password: '' });
      setView('dashboard');
      setSuccess('Login successful');
      fetchVehicles();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLogout = () => {
    setToken('');
    setRole('');
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
      const response = await fetch(`${API_URL}/vehicles/${vehicleId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Purchase failed');
      }

      setSuccess('Vehicle purchased successfully');
      fetchVehicles();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddVehicle = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newVehicle,
          price: Number(newVehicle.price),
          quantity: Number(newVehicle.quantity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to add vehicle');
      }

      setSuccess('Vehicle added successfully');
      setNewVehicle({ make: '', model: '', category: '', price: '', quantity: '' });
      setShowAddVehicle(false);
      fetchVehicles();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleRestock = async (vehicleId: number) => {
    const quantity = Number(restockValues[vehicleId] ?? 1);

    try {
      const response = await fetch(`${API_URL}/vehicles/${vehicleId}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Restock failed');
      }

      setSuccess('Vehicle restocked successfully');
      fetchVehicles();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    try {
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

      setSuccess('Vehicle deleted successfully');
      fetchVehicles();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (view === 'register') {
    return (
      <div className="auth-page">
        <div className="auth-overlay" />
        <div className="auth-card">
          <div className="brand-block">
            <div className="brand-icon">C</div>
            <h1>CAR DEALERSHIP</h1>
            <p>Vehicle Inventory Management System</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="field-group">
              <label htmlFor="register-email">Gmail</label>
              <input
                id="register-email"
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm({ ...registerForm, email: event.target.value })
                }
              />
              {registerErrors.email && <span className="field-error">{registerErrors.email}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm({ ...registerForm, password: event.target.value })
                }
              />
              {registerErrors.password && (
                <span className="field-error">{registerErrors.password}</span>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="register-confirm">Confirm Password</label>
              <input
                id="register-confirm"
                type="password"
                value={registerForm.confirmPassword}
                onChange={(event) =>
                  setRegisterForm({ ...registerForm, confirmPassword: event.target.value })
                }
              />
              {registerErrors.confirmPassword && (
                <span className="field-error">{registerErrors.confirmPassword}</span>
              )}
            </div>

            {error && <div className="form-alert error">{error}</div>}
            {success && <div className="form-alert success">{success}</div>}

            <button type="submit" className="primary-button">
              CREATE ACCOUNT
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <button type="button" className="link-button" onClick={() => setView('login')}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="auth-page">
        <div className="auth-overlay" />
        <div className="auth-card">
          <div className="brand-block">
            <div className="brand-icon">C</div>
            <h1>CAR DEALERSHIP</h1>
            <p>Vehicle Inventory Management System</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="field-group">
              <label htmlFor="login-email">Gmail</label>
              <input
                id="login-email"
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
              />
            </div>

            <div className="field-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              />
            </div>

            {error && <div className="form-alert error">{error}</div>}
            {success && <div className="form-alert success">{success}</div>}

            <button type="submit" className="primary-button">
              SIGN IN
            </button>
          </form>

          <p className="auth-switch">
            Need an account?{' '}
            <button type="button" className="link-button" onClick={() => setView('register')}>
              Register
            </button>
          </p>
        </div>
      </div>
    );
  }

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
          <button type="button" className="ghost-button" onClick={handleLogout}>
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
            <button type="button" className="primary-button" onClick={() => fetchVehicles()}>
              Search
            </button>
          </div>
        </section>

        {role === 'admin' && (
          <section className="admin-panel">
            <div className="panel-header-row">
              <h3>ADMIN CONTROL</h3>
              <button type="button" className="primary-button small" onClick={() => setShowAddVehicle(!showAddVehicle)}>
                + ADD VEHICLE
              </button>
            </div>

            {showAddVehicle && (
              <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
                <div className="input-grid">
                  <input
                    type="text"
                    placeholder="Make"
                    value={newVehicle.make}
                    onChange={(event) => setNewVehicle({ ...newVehicle, make: event.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={newVehicle.model}
                    onChange={(event) => setNewVehicle({ ...newVehicle, model: event.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newVehicle.category}
                    onChange={(event) => setNewVehicle({ ...newVehicle, category: event.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newVehicle.price}
                    onChange={(event) => setNewVehicle({ ...newVehicle, price: event.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newVehicle.quantity}
                    onChange={(event) => setNewVehicle({ ...newVehicle, quantity: event.target.value })}
                  />
                </div>
                <button type="submit" className="primary-button small">
                  SAVE VEHICLE
                </button>
              </form>
            )}
          </section>
        )}

        {error && <div className="form-alert error">{error}</div>}
        {success && <div className="form-alert success">{success}</div>}

        {loading ? (
          <div className="loading-box">Loading vehicles...</div>
        ) : (
          <section className="vehicle-grid">
            {filteredVehicles.length === 0 ? (
              <div className="empty-state">No vehicles match your search.</div>
            ) : (
              filteredVehicles.map((vehicle) => (
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
                      <button type="button" className="primary-button small" onClick={() => handlePurchase(vehicle.id)}>
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
                              setRestockValues({
                                ...restockValues,
                                [vehicle.id]: Number(event.target.value),
                              })
                            }
                          />
                          <button type="button" className="secondary-button" onClick={() => handleRestock(vehicle.id)}>
                            RESTOCK
                          </button>
                        </div>
                        <button type="button" className="danger-button" onClick={() => handleDeleteVehicle(vehicle.id)}>
                          DELETE
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
