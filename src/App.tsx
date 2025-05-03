import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/auth';
import LaunchList from './pages/LaunchList';
import LaunchDetail from './pages/LaunchDetail';
import Landing from './pages/Landing';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Landing />} />
      <Route
        path="/launches"
        element={isAuthenticated ? <LaunchList /> : <Navigate to="/login" />}
      />
      <Route
        path="/launch/:id"
        element={isAuthenticated ? <LaunchDetail /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/launches" />} />
    </Routes>
  );
}

export default App;