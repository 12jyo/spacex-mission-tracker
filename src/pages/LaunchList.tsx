import { useQuery } from '@tanstack/react-query';
import { Table, TextInput, Container, Button, Group, Title } from '@mantine/core';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import '../styles/LaunchList.css';

export type Launch = {
  id: string;
  name: string;
  date_utc: string;
};

export default function LaunchList() {
  const [search, setSearch] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<Launch[]>(['launches'], () =>
    fetch('https://api.spacexdata.com/v4/launches').then((res) => res.json())
  );

  const filtered = data?.filter((launch: Launch) =>
    launch.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <Group position="apart" mb="md" className='launchlist-header'>
        <Title order={2}>SpaceX Launches</Title>
        <Button onClick={handleLogout} color="red">
          Logout
        </Button>
      </Group>
      <TextInput
        placeholder="Search by mission name"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="md"
        className='launchlist-search'
      />
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Mission</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={2}>Loading...</td>
            </tr>
          ) : (
            filtered?.map((launch: Launch) => (
              <tr key={launch.id}>
                <td>
                  <Link to={`/launch/${launch.id}`}>{launch.name}</Link>
                </td>
                <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}