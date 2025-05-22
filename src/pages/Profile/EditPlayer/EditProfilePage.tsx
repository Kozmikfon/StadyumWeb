import { useEffect, useState } from 'react';
import axios from 'axios';
import './EditProfile.css';
import { useNavigate } from 'react-router-dom';

interface Player {
  email: string;
  position: string;
}

const EditProfilePage = () => {
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Player>({
    email: '',
    position: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded: any = JSON.parse(atob(token.split('.')[1]));
        const id = Array.isArray(decoded.playerId) ? decoded.playerId[0] : decoded.playerId;
        setPlayerId(id);

        const res = await axios.get(`http://localhost:5275/api/Players/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          email: res.data.email || '',
          position: res.data.position || ''
        });
      } catch (err) {
        console.error('Profil bilgisi alınamadı:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token || !playerId) return;

      await axios.put(`http://localhost:5275/api/Players/${playerId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('✅ Profiliniz güncellendi.');
      navigate('/profile');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert('❌ Güncelleme başarısız. Lütfen geçerli bilgileri girin.');
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>📧 Profilini Güncelle</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input name="email" value={formData.email} onChange={handleChange} required />

        <label>Pozisyon:</label>
        <select name="position" value={formData.position} onChange={handleChange} required>
          <option value="">Pozisyon seçin</option>
          <option value="Kaleci">Kaleci</option>
          <option value="Defans">Defans</option>
          <option value="Orta Saha">Orta Saha</option>
          <option value="Forvet">Forvet</option>
        </select>

        <button type="submit" className="save-btn">Kaydet</button>
      </form>
    </div>
  );
};

export default EditProfilePage;
