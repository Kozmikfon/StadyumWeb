import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import PlayerList from './pages/Player/PlayerList';
import TeamList from './pages/Teams/TeamList';
import Home from './pages/Home/Home';

const Router = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // "Admin" ya da "Player"

  return (
    <BrowserRouter>
      <Routes>
        {/* Herkese açık rotalar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Giriş yapmamış kullanıcıyı login sayfasına yönlendir */}
        {!token && <Route path="*" element={<Navigate to="/login" />} />}

        {/* Giriş yapmış kullanıcılar */}
        {token && (
          <>
            {/* Role göre ana yönlendirme */}
            <Route path="/" element={role === 'Admin' ? <Navigate to="/dashboard" /> : <Home />} />

            {/* Admin paneli */}
            <Route path="/dashboard" element={role === 'Admin' ? <Dashboard /> : <Navigate to="/" />} />

            {/* Oyuncu erişimleri */}
            <Route path="/players" element={<PlayerList />} />
            <Route path="/teams" element={<TeamList />} />

            {/* Bilinmeyen rota yönlendirme */}
            <Route path="*" element={<Navigate to={role === 'Admin' ? '/dashboard' : '/'} />} />
            <Route path="/teams/:id" element={<TeamDetailPage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route path="/players/:id" element={<PlayerDetailPage />} />


          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
