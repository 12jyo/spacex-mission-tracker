import { useState } from 'react';
import { Button, Container, TextInput, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import '../styles/Landing.scss';

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password: any) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }

    if (!hasUpperCase || !hasLowerCase || !hasDigits) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one digit';
    }

    return '';
  };

  const handleLogin = () => {
    setPasswordError('');
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setError('');
    login();
    navigate('/launches');
  };

  return (
    <Container className="login-container">
      <Title align="center" mb="lg">Login</Title>

      <TextInput
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
        error={error && !username.trim() ? 'Required' : false}
        mb="sm"
      />

      <TextInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        error={passwordError || (error && !password.trim() ? 'Required' : false)}
        mb="sm"
      />

      <Button onClick={handleLogin} fullWidth>
        Login
      </Button>
    </Container>
  );
}