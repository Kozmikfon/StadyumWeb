import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ChangePasswordPage.css';

const ChangePasswordPage = () => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.userId);
    }
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPass || !newPass || !confirmPass) {
      alert('Tüm alanları doldurun.');
      return;
    }

    if (newPass !== confirmPass) {
      alert('Yeni şifreler uyuşmuyor.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5275/api/Auth/change-password/${userId}`,
        newPass,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert('Şifreniz başarıyla güncellendi.');
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err) {
      console.error('Şifre değiştirme hatası:', err);
      alert('Şifre güncellenemedi.');
    }
  };

  return (
    <div className="change-password-container">
      <h2>🔐 Şifre Değiştir</h2>
      <form onSubmit={handlePasswordChange} className="change-password-form">
        <input
          type="password"
          placeholder="Eski Şifre"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="Yeni Şifre"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="Yeni Şifre (Tekrar)"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />
        <button type="submit">Güncelle</button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
