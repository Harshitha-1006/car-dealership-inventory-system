import { useState } from 'react';
import type { FormEvent } from 'react';

type Props = {
  onSubmit: (payload: { email: string; password: string }) => Promise<void> | void;
  onGoToRegister: () => void;
  error: string;
  success: string;
};

export function Login({ onSubmit, onGoToRegister, error, success }: Props) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-overlay" />
      <div className="auth-card">
        <div className="brand-block">
          <div className="brand-icon">C</div>
          <h1>CAR DEALERSHIP</h1>
          <p>Vehicle Inventory Management System</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
          <button type="button" className="link-button" onClick={onGoToRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
