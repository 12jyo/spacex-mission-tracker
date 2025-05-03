import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Container, Title, Text, Loader, Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../store/auth'; 
import '../styles/LaunchDetail.css';

export default function LaunchDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const { logout } = useAuth();
  const { data: launch, isLoading } = useQuery(['launch', id], () =>
    fetch(`https://api.spacexdata.com/v4/launches/${id}`).then((res) => res.json())
  );

  const { data: rocket } = useQuery(['rocket', launch?.rocket], () =>
    launch?.rocket
      ? fetch(`https://api.spacexdata.com/v4/rockets/${launch.rocket}`).then((res) => res.json())
      : Promise.resolve(null)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading || !launch) return <Loader />;

  return (
    <Container className='launchdetail-container'>
      <Card shadow="sm" padding="lg" radius="md" withBorder className='launchdetail-card'>
        <Group position="apart" mb="md">
          <Title order={2}>{launch.name}</Title>
          <div>
            <Button onClick={handleBack} variant="outline" mr="sm">
              Back
            </Button>
            <Button onClick={handleLogout} color="red">
              Logout
            </Button>
          </div>
        </Group>
        <Text size="sm">Date: {new Date(launch.date_utc).toLocaleString()}</Text>
        <Text size="sm">Success: {launch.success ? 'Yes' : 'No'}</Text>
        <Text size="sm">Rocket: {rocket?.name || 'Loading...'}</Text>
      </Card>
    </Container>
  );
}