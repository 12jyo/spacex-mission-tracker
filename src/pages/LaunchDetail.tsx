import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Container, Title, Text, Loader } from '@mantine/core';
import '../styles/LaunchDetail.css';

export default function LaunchDetail() {
  const { id } = useParams();
  const { data: launch, isLoading } = useQuery(['launch', id], () =>
    fetch(`https://api.spacexdata.com/v4/launches/${id}`).then((res) => res.json())
  );

  const { data: rocket } = useQuery(['rocket', launch?.rocket], () =>
    launch?.rocket
      ? fetch(`https://api.spacexdata.com/v4/rockets/${launch.rocket}`).then((res) => res.json())
      : Promise.resolve(null)
  );

  if (isLoading || !launch) return <Loader />;

  return (
    <Container>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2}>{launch.name}</Title>
        <Text size="sm">Date: {new Date(launch.date_utc).toLocaleString()}</Text>
        <Text size="sm">Success: {launch.success ? 'Yes' : 'No'}</Text>
        <Text size="sm">Rocket: {rocket?.name || 'Loading...'}</Text>
      </Card>
    </Container>
  );
}