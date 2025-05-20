import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
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
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Çıkış Yap
        </button>
      </div>
    </header>
  );
};

export default Navbar;
