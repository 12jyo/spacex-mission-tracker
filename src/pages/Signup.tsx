import { useRef, useState } from 'react';
import { Container, Title, TextInput, Button, Text, Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import '../styles/Landing.scss';

export default function Signup() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase || !hasLowerCase || !hasDigits) {
      return 'Password must contain uppercase, lowercase, and a digit';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    setError('');
    setPasswordError('');

    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    try {
      await signup(email, password);
      navigate('/launches');
    } catch (err) {
      setError('🚫 Failed to create an account. Please try again.');
    }
  };

  return (
    <Container className="login-container">
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Title align="center" mb="lg">Create an Account</Title>

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            ref={emailRef}
            placeholder="you@example.com"
            required
            mb="sm"
          />

          <TextInput
            label="Password"
            ref={passwordRef}
            type="password"
            placeholder="Password"
            required
            error={passwordError}
            mb="sm"
          />

          {error && <Text color="red" size="sm" mt="xs">{error}</Text>}

          <Button fullWidth mt="md" type="submit">
            Sign Up
          </Button>
        </form>

        <Text align="center" mt="md" size="sm">
          Already have an account? <a href="/login">Login here</a>
        </Text>
      </Paper>
    </Container>
  );
}