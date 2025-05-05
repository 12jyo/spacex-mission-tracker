import {
  Menu,
  ActionIcon,
  Switch,
  Group,
  Text,
} from '@mantine/core';
import { IconLogout, IconMoon, IconSun, IconUser } from '@tabler/icons-react';
import { useThemeStore } from '../theme/theme';
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';

export default function ProfileMenu() {
  const { theme, toggleTheme } = useThemeStore();
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Menu shadow="md" width={220} position="bottom-end">
      <Menu.Target>
        <ActionIcon size="lg" variant="default" radius="xl">
          <IconUser size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Welcome</Menu.Label>
        <Menu.Item disabled>
          <Text fw={500}>{currentUser?.displayName ?? 'Anonymous'}</Text>
          <Text size="xs" color="dimmed">{currentUser?.email}</Text>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Settings</Menu.Label>
        <Menu.Item icon={theme === 'dark' ? <IconMoon size={16} /> : <IconSun size={16} />}>
          <Group position="apart">
            <Text>Dark mode</Text>
            <Switch size="xs" checked={theme === 'dark'} onChange={toggleTheme} />
          </Group>
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item icon={<IconLogout size={16} />} color="red" onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}