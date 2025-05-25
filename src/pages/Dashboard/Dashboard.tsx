// Dashboard.tsx güncellenmiş hali
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    setRole(storedRole || '');
    setEmail(parseJwt(token)?.email || '');
  }, []);

  const parseJwt = (token: string | null) => {
    if (!token) return {};
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-title">🏟️ Stadyum Admin Panel</h1>
        <p className="dashboard-text">Hoş geldiniz <strong>{email || 'Kullanıcı'}</strong></p>
        <p className="dashboard-subtext">Rolünüz: <strong>{role}</strong></p>

        <div className="dashboard-buttons">
          <button onClick={() => navigate('/admin/players')}>🎽 Oyuncu Yönetimi</button>
          <button onClick={() => navigate('/admin/teams')}>🏆 Takım Yönetimi</button>
          <button onClick={() => navigate('/admin/matches')}>📅 Maç Yönetimi</button>
          <button onClick={() => navigate('/admin/reviews')}>📝 Yorumlar</button>
          <button onClick={() => navigate('/admin/stats')}>📊 İstatistik</button>
          <button onClick={() => navigate('/admin/offers')}>📩 Teklifler</button>
          <button onClick={() => navigate('/admin/attendance')}>✅ Katılım</button>
          <button onClick={() => navigate('/admin/users')}>👤 Kullanıcılar</button>
          <button onClick={() => navigate('/admin/tournament')}>🏟️ Turnuva</button>
        </div>

        <button className="logout-button" onClick={handleLogout}>Çıkış Yap</button>
      </div>
    </div>
  );
};

export default Dashboard;