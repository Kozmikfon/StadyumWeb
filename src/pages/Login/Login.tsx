import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:5275/api/Auth/login', {
      email,
      password,
    });

    const { token, role } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    // 🧠 Eğer token varsa ve rol admin ise => dashboard
    // değilse => anasayfa
    if (role === 'Admin') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  } catch (err) {
    console.error(err);
    alert('Giriş başarısız! Email veya şifre yanlış.');
  }
};



  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Stadyum Giriş</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@stadyum.com"
          />
        </div>

        <div className="form-group">
          <label>Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          Giriş Yap
        </button>

        <div className="text-center mt-4">
          <p className="login-footer mb-2">Henüz hesabınız yok mu?</p>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
          >
            Kayıt Ol
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
