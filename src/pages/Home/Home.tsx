import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      navigate('/login');
    }

    // örnek olarak sadece ad soyad gösteriyoruz (ileride API'den alınabilir)
    const name = localStorage.getItem('fullName');
    if (name) {
      setPlayerName(name);
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="home-box">
        <h1>🏟️ Stadyum Uygulamasına Hoş Geldiniz</h1>
        <p className="welcome-text">
          {playerName ? `${playerName}, hoş geldin!` : 'Giriş yaptığınız için teşekkürler.'}
        </p>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Home;
