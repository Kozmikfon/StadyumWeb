import './home.css';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../../Components/ImageSlider';

const Home = () => {
  const navigate = useNavigate();

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

    </>
  );
};

export default Home;
