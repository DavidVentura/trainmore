import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLogin } from '../hooks/useLogin';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { mutate: login, isPending, error, isError} = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password }, {
      onSuccess: (data) => {
        localStorage.setItem('access_token', data.access_token);
        navigate('/');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isPending}>Login</button>
      {isError && <div style={{color: 'red'}}>{error?.message || 'Login failed'}</div>}
    </form>
  );
}
