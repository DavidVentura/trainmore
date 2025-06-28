import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  TextField,
  Button,
  Text,
  Flex,
  Container,
} from '@radix-ui/themes';
import { useLogin } from '../hooks/useLogin';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { mutate: login, isPending, error, isError } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { username, password },
      {
        onSuccess: (data) => {
          localStorage.setItem('access_token', data.access_token);
          navigate('/');
        },
      }
    );
  };

  return (
    <Container
      size="1"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card size="3" style={{ width: '100%', maxWidth: '400px' }}>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <Text size="6" weight="bold" align="center">
              Login
            </Text>

            <TextField.Root
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              size="3"
            />

            <TextField.Root
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              size="3"
            />

            <Button type="submit" disabled={isPending} size="3">
              {isPending ? 'Logging in...' : 'Login'}
            </Button>

            {isError && (
              <Text color="red" size="2" align="center">
                {error?.message || 'Login failed'}
              </Text>
            )}
          </Flex>
        </form>
      </Card>
    </Container>
  );
}
