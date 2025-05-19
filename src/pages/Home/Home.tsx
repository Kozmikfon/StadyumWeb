import ImageSlider from '../../Components/ImageSlider';
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
    <a onClick={() => navigate('/stats')}>İstatistik</a>
  </nav>

  <div className="right-section">
    <button className="profile-btn" onClick={() => navigate('/profile')}>
      👤 Profil
    </button>
  </div>
</header>



      {/* Hero kaldırıldı – yerine tam ekran slider geldi */}
      <ImageSlider />
    </>
  );
};

export default Home;
