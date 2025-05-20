import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';

import PlayerList from './pages/Player/PlayerList/PlayerList';
import PlayerDetailPage from './pages/Player/PlayerDetailPage';

import TeamList from './pages/Teams/TeamList/TeamList';
import TeamDetailPage from './pages/Teams/TeamDetail/TeamDetailPage';

import MatchList from './pages/Matches/MatchList/MatchList';
import MatchDetailPage from './pages/Matches/MatchDetailPage';
import CreateMatch from './pages/Matches/CreateMatch/CreateMatch';

import PlayerProfile from './pages/Profile/PlayerProfile';
import ChangePasswordPage from './pages/Profile/ChangePassword/ChangePasswordPage';

const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    setToken(savedToken);
    setRole(savedRole);
  }, []);

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={role === 'Admin' ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/dashboard" element={role === 'Admin' ? <Dashboard /> : <Navigate to="/" />} />

        {/* Oyuncular */}
        <Route path="/players" element={<PlayerList />} />
        <Route path="/players/:id" element={<PlayerDetailPage />} />

        {/* Takımlar */}
        <Route path="/teams" element={<TeamList />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />

        {/* Maçlar */}
        <Route path="/matches" element={<MatchList />} />
        <Route path="/matches/:id" element={<MatchDetailPage />} />
        <Route path="/matches/create" element={<CreateMatch />} />

        {/* Profil */}
        <Route path="/profile" element={<PlayerProfile />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* Bilinmeyen route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
