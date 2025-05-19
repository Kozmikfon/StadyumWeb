import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [rating, setRating] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5275/api/Auth/register', {
        firstName,
        lastName,
        email,
        passwordHash: password,
        position,
        skillLevel,
        rating,
      });

      alert('Kayıt başarılı!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Kayıt başarısız. Bu email zaten kayıtlı olabilir.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Kayıt Ol</h2>

        <div className="form-group">
          <label>Ad</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ad" />
        </div>

        <div className="form-group">
          <label>Soyad</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Soyad" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@stadyum.com" />
        </div>

        <div className="form-group">
          <label>Şifre</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        <div className="form-group">
          <label>Pozisyon</label>
          <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="örn: Forvet" />
        </div>

        <div className="form-group">
          <label>Yetenek Seviyesi</label>
          <input type="number" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} placeholder="örn: 80" />
        </div>

        <div className="form-group">
          <label>Puan</label>
          <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="örn: 4.5" />
        </div>

        <button className="register-button" onClick={handleRegister}>
          Kayıt Ol
        </button>

        <p className="register-footer">
          Zaten hesabınız var mı? <a href="/login">Giriş Yap</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
