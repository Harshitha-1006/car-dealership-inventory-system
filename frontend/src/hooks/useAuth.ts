import { useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');

  const login = (nextToken: string, nextRole: string) => {
    setToken(nextToken);
    setRole(nextRole);
  };

  const logout = () => {
    setToken('');
    setRole('');
  };

  return {
    token,
    role,
    setToken,
    setRole,
    login,
    logout,
  };
}
