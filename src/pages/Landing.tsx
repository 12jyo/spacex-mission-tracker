import { Button, Container, TextInput, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import '../styles/Landing.scss';

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/launches');
  };

  return (
    <Container className="login-container">
      <Title align="center" mb="lg">Login</Title>
      <TextInput label="Username" mb="sm" />
      <TextInput label="Password" type="password" mb="sm" />
      <Button onClick={handleLogin} fullWidth>
        Login
      </Button>
    </Container>
  );
}
