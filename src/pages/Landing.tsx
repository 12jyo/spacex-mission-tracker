import { Button, Card, Container, PasswordInput, TextInput, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { useAuth } from '../store/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async () => {
    try {
      setError('');
      await login(form.values.email, form.values.password);
      navigate('/launches');
    } catch (err: any) {
      console.error(err);
      const errorCode = err.code || '';
      switch (errorCode) {
        case 'auth/user-not-found':
          setError('No user found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <Container size="xs" mt="xl" className="login-container">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md" align="center">
          Login
        </Title>
        <form onSubmit={form.onSubmit(handleLogin)}>
          <TextInput
            label="Email"
            placeholder="email@example.com"
            {...form.getInputProps('email')}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            {...form.getInputProps('password')}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button fullWidth mt="xl" type="submit">
            Login
          </Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </Card>
    </Container>
  );
}