import {
  Table,
  TextInput,
  Container,
  Button,
  Group,
  Title,
  Select,
  Pagination,
  Badge,
  Switch,
  Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { useFavorites } from '../store/useFavorites';
import {
  IconStar,
  IconStarFilled,
  IconArrowDown,
  IconArrowUp,
} from '@tabler/icons-react';
import '../styles/LaunchList.css';
import ProfileMenu from '../components/ProfileMenu';

export type Launch = {
  id: string;
  name: string;
  date_utc: string;
  success: boolean;
  upcoming: boolean;
};

export default function LaunchList() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { favorites, addFavorite, removeFavorite, isFavorite, loadFavorites } = useFavorites();

  const { data, isLoading } = useQuery<Launch[]>(['launches'], () =>
    fetch('https://api.spacexdata.com/v4/launches').then((res) => res.json())
  );

  useEffect(() => {
    loadFavorites();
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];

    let launches = [...data].filter((launch) =>
      launch.name.toLowerCase().includes(search.toLowerCase())
    );

    if (yearFilter) {
      launches = launches.filter(
        (launch) =>
          new Date(launch.date_utc).getFullYear().toString() === yearFilter
      );
    }

    if (showFavoritesOnly) {
      launches = launches.filter((launch) => favorites.includes(launch.id));
    }

    launches.sort((a, b) => {
      const dateA = new Date(a.date_utc).getTime();
      const dateB = new Date(b.date_utc).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return launches;
  }, [data, search, yearFilter, sortAsc, showFavoritesOnly, favorites]);

  const totalPages = Math.ceil(filtered.length / recordsPerPage);
  const paginated = filtered.slice((page - 1) * recordsPerPage, page * recordsPerPage);

  const years = Array.from(
    new Set(data?.map((l) => new Date(l.date_utc).getFullYear().toString()))
  ).sort();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <div className='launchlist-header'>
        <Group position="apart" mb="md" style={{marginBottom: '45px'}}>
          <Title>SpaceX Launches</Title>
          <ProfileMenu />
        </Group>

        <Group mb="md" grow>
          <TextInput
            placeholder="Search by mission name"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Select
            data={years}
            placeholder="Filter by year"
            value={yearFilter}
            onChange={setYearFilter}
            clearable
          />
          <Button
            onClick={() => setSortAsc(!sortAsc)}
            leftIcon={sortAsc ? <IconArrowUp /> : <IconArrowDown />}
          >
            Sort by Date
          </Button>
          <Switch
            label="Show Favorites Only"
            checked={showFavoritesOnly}
            onChange={(event) => {
              setShowFavoritesOnly(event.currentTarget.checked);
              setPage(1); // reset to first page
            }}
          />
        </Group>
      </div>

      <div style={{ border: '1px solid #dee2e6', borderRadius: 4, overflow: 'hidden' }}>
        <Table striped highlightOnHover withBorder>
          <thead style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
            <tr>
              <th>Favorite</th>
              <th>Mission</th>
              <th>Date</th>
              <th>Status</th>
              <th>Type</th>
            </tr>
          </thead>
        </Table>

        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Table striped highlightOnHover withBorder>
            <tbody style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
              {isLoading ? (
                <tr>
                  <td colSpan={5}>Loading...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5}>No launches found.</td>
                </tr>
              ) : (
                paginated.map((launch) => (
                  <tr key={launch.id}>
                    <td>
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() =>
                          isFavorite(launch.id)
                            ? removeFavorite(launch.id)
                            : addFavorite(launch.id)
                        }
                      >
                        {isFavorite(launch.id) ? (
                          <IconStarFilled color="gold" />
                        ) : (
                          <IconStar />
                        )}
                      </Button>
                    </td>
                    <td>
                      <Link to={`/launch/${launch.id}`}>{launch.name}</Link>
                    </td>
                    <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
                    <td>
                      <Badge color={launch.success ? 'green' : 'red'}>
                        {launch.success ? 'Success' : 'Failure'}
                      </Badge>
                    </td>
                    <td>
                      <Badge color={launch.upcoming ? 'blue' : 'gray'}>
                        {launch.upcoming ? 'Upcoming' : 'Past'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Text size="sm" mb="xs" style={{ marginTop: '21px' }}>
        Showing {paginated.length} of {filtered.length} launches
      </Text>

      {totalPages > 1 && (
        <Group className='launchlist-footer'>
          <Select
            label="Records per page"
            data={['10', '25', '50', '100']}
            value={recordsPerPage.toString()}
            onChange={(value) => {
              if (value) {
                setRecordsPerPage(parseInt(value));
                setPage(1); 
              }
            }}
          />
          <Pagination
            value={page}
            onChange={setPage}
            total={totalPages}
            mt="md"
          />
        </Group>
      )}
    </Container>
  );
}