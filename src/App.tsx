import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const Router = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // "Admin" veya "Player"

  return (
    <BrowserRouter>
      <Routes>
        {/* Giriş ve kayıt herkese açık */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Giriş yapılmamışsa her sayfadan login'e yönlendir */}
        {!token && <Route path="*" element={<Navigate to="/login" />} />}

        {/* Giriş yapılmış kullanıcılar */}
        {token && (
          <>
            {/* Ana yönlendirme */}
            <Route path="/" element={role === 'Admin' ? <Navigate to="/dashboard" /> : <Home />} />

            {/* Admin dashboard */}
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

            {/* Profil / İstatistik yönlendirmeleri (şimdilik home'a bağlıysa) */}
            <Route path="/profile" element={<PlayerProfile />} />
            

            {/* Bilinmeyen route → anasayfaya yönlendir */}
            <Route path="*" element={<Navigate to="/" />} />
            

          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
