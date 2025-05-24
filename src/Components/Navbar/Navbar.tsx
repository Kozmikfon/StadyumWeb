import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [latestMatchId, setLatestMatchId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLatestMatch = async () => {
      try {
        const res = await axios.get('http://localhost:5275/api/Matches/latest');
        setLatestMatchId(res.data.id);
      } catch (err) {
        console.error('Son maç alınamadı:', err);
      }
    };

    fetchLatestMatch();
  }, []);

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/login'; // <-- Hard redirect
};


  return (
    <header className="home-navbar">
      <div className="logo">Stadyum</div>
      <nav className="nav-links">
        <a onClick={() => navigate('/')}>Anasayfa</a>
        <a onClick={() => navigate('/teams')}>Takımlar</a>
        <a onClick={() => navigate('/matches')}>Maçlar</a>
        <a onClick={() => navigate('/players')}>Oyuncular</a>

        {latestMatchId && (
          <a
            onClick={() => navigate(`/matches/${latestMatchId}/stats`)}
            style={{ cursor: 'pointer' }}
          >
             İstatistik
          </a>
        )}
      </nav>

      <div className="right-section">
        <button className="profile-btn" onClick={() => navigate('/profile')}>
          👤 Profil
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Çıkış Yap
        </button>
      </div>
    </header>
  );
};

export default Navbar;
