import { useMutation } from '@tanstack/react-query';
import { type LoginRequest, type LoginResponse} from '../utils/api'

async function login({ username, password }: LoginRequest): Promise<LoginResponse> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || 'Login failed');
  }
  return res.json();
}

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
  });
}
