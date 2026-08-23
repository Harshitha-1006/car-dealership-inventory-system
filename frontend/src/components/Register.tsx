import { useState } from 'react';
import type { FormEvent } from 'react';

type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  onSubmit: (payload: RegisterForm) => Promise<void> | void;
  onGoToLogin: () => void;
  error: string;
  success: string;
};

const isValidGmail = (value: string) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value.trim());

const isValidPassword = (value: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);

export function Register({ onSubmit, onGoToLogin, error, success }: Props) {
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [registerErrors, setRegisterErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

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

    await onSubmit({
      email: trimmedEmail,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
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
            <label htmlFor="register-email">Gmail</label>
            <input
              id="register-email"
              type="email"
              value={registerForm.email}
              onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
            />
            {registerErrors.email && <span className="field-error">{registerErrors.email}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={registerForm.password}
              onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
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
          <button type="button" className="link-button" onClick={onGoToLogin}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
