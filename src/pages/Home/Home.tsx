import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName');

    if (!token) {
      navigate('/login');
    }

    if (fullName) {
      setPlayerName(fullName);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>🏟️ Stadyum Uygulamasına Hoş Geldiniz</h1>
        <p className="welcome-text">
          {playerName ? `${playerName}, hoş geldin!` : 'Giriş yaptığınız için teşekkürler.'}
        </p>
        <button className="logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </div>

      <div className="menu-grid">
        <div className="menu-card" onClick={() => navigate('/teams')}>
          <h3>Takımlar</h3>
          <p>Tüm takımları görüntüle</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/players')}>
          <h3>Oyuncular</h3>
          <p>Oyunculara göz at, teklif gönder</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/matches')}>
          <h3>Maçlar</h3>
          <p>Maçlara katıl veya yeni maç oluştur</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/profile')}>
          <h3>Profil</h3>
          <p>Bilgilerini görüntüle veya düzenle</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/stats')}>
          <h3>İstatistikler</h3>
          <p>Performansını analiz et</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
