import { useRef, useState } from 'react';
import { Container, Title, TextInput, Button, Text, Paper, PasswordInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import '../styles/Landing.scss';

export default function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
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

    if (password.length < minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase || !hasLowerCase || !hasDigits) {
      return 'Password must contain uppercase, lowercase, and a digit';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const username = usernameRef.current?.value || '';
    setError('');
    setPasswordError('');
  
    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }
  
    try {
      await signup(email, password, username);
      navigate('/launches');
    } catch (err: any) {
      console.error(err);
      const errorCode = err.code || '';
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setError('📧 An account with this email already exists.');
          break;
        case 'auth/invalid-email':
          setError('❗ Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('🔒 Password is too weak.');
          break;
        default:
          setError('🚫 Failed to create an account. Please try again.');
      }
    }
  };  

  return (
    <Container className="login-container">
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Title align="center" mb="lg">Create an Account</Title>

        <form onSubmit={handleSubmit}>
          <TextInput label="Username" ref={usernameRef} required mb="sm" />
          <TextInput label="Email" ref={emailRef} required mb="sm" />
          <PasswordInput label="Password" ref={passwordRef} required mb="sm" error={passwordError} />
          {error && <Text color="red" size="sm">{error}</Text>}

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