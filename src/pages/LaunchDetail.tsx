import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Container,
  Title,
  Text,
  Loader,
  Button,
  Group,
  Badge,
  Stack,
  Box,
  Grid,
  Image,
  Divider,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '../store/auth';
import ProfileMenu from '../components/ProfileMenu';
import '../styles/LaunchDetail.css';

export default function LaunchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: launch, isLoading: isLaunchLoading } = useQuery(['launch', id], () =>
    fetch(`https://api.spacexdata.com/v4/launches/${id}`).then(res => res.json())
  );

  const { data: rocket, isLoading: isRocketLoading } = useQuery(['rocket', launch?.rocket], () =>
    launch?.rocket
      ? fetch(`https://api.spacexdata.com/v4/rockets/${launch.rocket}`).then(res => res.json())
      : Promise.resolve(null)
  );

  const handleBack = () => navigate(-1);

  if (isLaunchLoading || !launch) return (
    <Container size="xs" mt="lg">
      <Loader size="lg" />
    </Container>
  );

  return (
    <Container size="md" className="launchdetail-container">
      <Group position="apart" mt="md">
        <Button
          leftIcon={<IconArrowLeft />}
          onClick={handleBack}
          variant="light"
          size="sm"
        >
          Back
        </Button>
        <ProfileMenu />
      </Group>

      <Card shadow="md" radius="md" mt="lg" withBorder padding="xl" className="launchdetail-card">
        <Stack spacing="md">
          <Group position="apart">
            <Title order={2}>{launch.name}</Title>
            <Badge
              color={launch.success ? 'green' : launch.upcoming ? 'blue' : 'red'}
              size="lg"
              variant="filled"
            >
              {launch.success ? 'Success' : launch.upcoming ? 'Upcoming' : 'Failure'}
            </Badge>
          </Group>

          <Text size="sm" color="dimmed">
            {new Date(launch.date_utc).toLocaleString()}
          </Text>

          <Divider />

          <Grid gutter="md">
            <Grid.Col span={6}>
              <Box>
                <Text fw={500} mb={4}>Rocket:</Text>
                <Text>{rocket?.name || 'Loading...'}</Text>
              </Box>
              <Box mt="sm">
                <Text fw={500} mb={4}>Launchpad:</Text>
                <Text>{launch.launchpad || 'Unknown'}</Text>
              </Box>
              <Box mt="sm">
                <Text fw={500} mb={4}>Flight Number:</Text>
                <Text>{launch.flight_number}</Text>
              </Box>
            </Grid.Col>

            {rocket?.flickr_images?.[0] && (
              <Grid.Col span={6}>
                <Image
                  src={rocket.flickr_images[0]}
                  alt={`${rocket.name} image`}
                  radius="md"
                  withPlaceholder
                />
              </Grid.Col>
            )}
          </Grid>

          {launch.details && (
            <Box mt="md">
              <Text fw={500} mb={4}>Details:</Text>
              <Text size="sm">{launch.details}</Text>
            </Box>
          )}
        </Stack>
      </Card>
    </Container>
  );
}