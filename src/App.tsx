import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/auth';
import LaunchList from './pages/LaunchList';
import LaunchDetail from './pages/LaunchDetail';
import Landing from './pages/Landing';
import Signup from './pages/Signup';

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/launches" replace /> : <Landing />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/launches" replace /> : <Signup />} /> {/* ✅ NEW */}
      <Route path="/launches" element={isAuthenticated ? <LaunchList /> : <Navigate to="/login" replace />} />
      <Route path="/launch/:id" element={isAuthenticated ? <LaunchDetail /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/launches" replace />} />
    </Routes>
  );
}

export default App;