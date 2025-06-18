import React from 'react';
import { useNavigate } from 'react-router';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  return <>{children}</>;
}
