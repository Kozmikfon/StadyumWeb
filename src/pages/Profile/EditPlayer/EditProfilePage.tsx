import { useEffect, useState } from 'react';
import axios from 'axios';
import './EditProfile.css';

interface Player {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  skillLevel: number;
  rating: number;
}

const EditProfilePage = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState<Player>({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    skillLevel: 1,
    rating: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5275/api/Players/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayer(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error('Profil bilgisi alınamadı:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'skillLevel' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5275/api/Players/update-profile', formData, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      alert('✅ Profil güncellendi.');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert('❌ Profil güncellenemedi.');
    }
  };

  if (!player) return <p>Yükleniyor...</p>;

  return (
    <div className="edit-profile-container">
      <h2>👤 Profili Düzenle</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <label>Ad:</label>
        <input name="firstName" value={formData.firstName} onChange={handleChange} required />

        <label>Soyad:</label>
        <input name="lastName" value={formData.lastName} onChange={handleChange} required />

        <label>Email:</label>
        <input name="email" value={formData.email} onChange={handleChange} required />

        <label>Pozisyon:</label>
        <input name="position" value={formData.position} onChange={handleChange} required />

        <label>Yetenek Seviyesi (1-5):</label>
        <select name="skillLevel" value={formData.skillLevel} onChange={handleChange}>
          {[1, 2, 3, 4, 5].map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <button type="submit" className="save-btn">Kaydet</button>
      </form>
    </div>
  );
};

export default EditProfilePage;
