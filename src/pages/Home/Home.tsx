import './home.css';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../../Components/ImageSlider';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface MatchPreview {
  matchDate: string;
  team1Name: string;
  team2Name: string;
}

interface PlayerPreview {
  firstName: string;
  lastName: string;
  rating: number;
}

const Home = () => {
  const navigate = useNavigate();

  const [upcomingMatches, setUpcomingMatches] = useState<MatchPreview[]>([]);
  const [topPlayers, setTopPlayers] = useState<PlayerPreview[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5275/api/matches/upcoming')
      .then(res => setUpcomingMatches(res.data))
      .catch(err => console.error("Maçlar alınamadı:", err))
      .finally(() => setIsLoadingMatches(false));

    axios.get('http://localhost:5275/api/players/top')
      .then(res => setTopPlayers(res.data))
      .catch(err => console.error("Oyuncular alınamadı:", err))
      .finally(() => setIsLoadingPlayers(false));
  }, []);

  return (
    <>
      {/* Navbar */}
      <header className="home-navbar">
        <div className="logo">Halı Saha</div>
        <nav className="nav-links">
          <a onClick={() => navigate('/')}>Anasayfa</a>
          <a onClick={() => navigate('/teams')}>Takımlar</a>
          <a onClick={() => navigate('/matches')}>Maçlar</a>
          <a onClick={() => navigate('/players')}>Oyuncular</a>
          <a onClick={() => navigate('/stats')}>İstatistik</a>
        </nav>
        <div className="right-section">
          <button className="profile-btn" onClick={() => navigate('/profile')}>
            👤 Profil
          </button>
        </div>
      </header>

      {/* Görsel Slider */}
      <ImageSlider />

      {/* Tanıtım Bölümü */}
      <section className="about-section">
        <h2>Halı Saha Platformuna Hoş Geldiniz</h2>
        <p>
          Maç planlayın, takım kurun, oyuncu bulun. Türkiye'nin en aktif halı saha ağıyla
          siz de sahada yerinizi alın!
        </p>
      </section>

      {/* Özellik Kartları */}
      <section className="features-section">
        <div className="feature-card" onClick={() => navigate('/matches')}>
          <h3>⚽ Kolay Maç Ayarlama</h3>
          <p>Takımınızı oluşturun ve maçınızı birkaç tıkla organize edin.</p>
        </div>
        <div className="feature-card" onClick={() => navigate('/stats')}>
          <h3>📊 Oyuncu İstatistikleri</h3>
          <p>Goller, asistler, performans puanı gibi tüm veriler elinizin altında.</p>
        </div>
        <div className="feature-card" onClick={() => navigate('/teams')}>
          <h3>👥 Takım Eşleşmeleri</h3>
          <p>Benzer seviyedeki takımlarla eşleşin ve rekabeti artırın.</p>
        </div>
      </section>

      {/* Yaklaşan Maçlar */}
      <section className="upcoming-matches">
        <h2>Yaklaşan Maçlar</h2>
        {isLoadingMatches ? (
  <div className="spinner"></div>
) : (
  <ul>
    {upcomingMatches.length > 0 ? (
      upcomingMatches.map((match, i) => (
        <li key={i}>
          {new Date(match.matchDate).toLocaleDateString('tr-TR')} • {match.team1Name} vs {match.team2Name}
        </li>
      ))
    ) : (
      <li>Yaklaşan maç bulunamadı.</li>
    )}
  </ul>
)}

      </section>

      {/* En İyi Oyuncular */}
      <section className="top-players">
        <h2>En İyi Oyuncular</h2>
        {isLoadingPlayers ? (
  <div className="spinner"></div>
) : (
  <div className="player-list">
    {topPlayers.length > 0 ? (
      topPlayers.map((player, i) => (
        <div className="player-card" key={i}>
          {i === 0 && '🏅'}
          {i === 1 && '🥈'}
          {i === 2 && '🥉'}
          {i > 2 && '👤'} {player.firstName} {player.lastName} • {player.rating} Puan
        </div>
      ))
    ) : (
      <p>Oyuncu verisi bulunamadı.</p>
    )}
  </div>
)}

      </section>

      {/* Footer */}
      <footer className="site-footer">
        <p>© 2025 Halı Saha Platformu • info@halisaha.com • +90 555 123 4567</p>
      </footer>
    </>
  );
};

export default Home;
