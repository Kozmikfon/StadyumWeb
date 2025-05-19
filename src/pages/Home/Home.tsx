import './home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <header className="home-navbar">
        <div className="logo">Halı Saha</div>
        <nav className="nav-links">
          <a onClick={() => navigate('/')}>Anasayfa</a>
          <a onClick={() => navigate('/teams')}>Takımlar</a>
          <a onClick={() => navigate('/matches')}>Maçlar</a>
          <a onClick={() => navigate('/players')}>Oyuncular</a>
          <a onClick={() => navigate('/profile')}>Profil</a>
          <a onClick={() => navigate('/stats')}>İstatistik</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>MAÇ BAŞLIYOR</h1>
          <p>Heyecan hiç bitmedi. Online rezervasyon ile sizde yerinizi alın</p>
          <button onClick={() => navigate('/matches')}>REZERVASYON</button>
        </div>
      </section>
    </>
  );
};

export default Home;
