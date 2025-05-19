import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './PlayerProfilePage.css';

interface Player {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  skillLevel: string;
  rating: number;
  teamName?: string;
}

const PlayerProfilePage = () => {
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded: any = jwtDecode(token);
      const userId = decoded.userId;

      try {
        const res = await axios.get(`http://localhost:5275/api/players/byUser/${userId}`);
        setPlayer(res.data);
      } catch (error) {
        console.error('Profil verisi alınamadı:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!player) return <p>Yükleniyor...</p>;

  return (
    <div className="profile-container">
      <h2>👤 Oyuncu Profilim</h2>
      <p><strong>Ad Soyad:</strong> {player.firstName} {player.lastName}</p>
      <p><strong>Email:</strong> {player.email}</p>
      <p><strong>Pozisyon:</strong> {player.position}</p>
      <p><strong>Yetenek:</strong> {player.skillLevel}</p>
      <p><strong>Puan:</strong> {player.rating}</p>
      <p><strong>Takım:</strong> {player.teamName || 'Henüz bir takıma katılmadınız'}</p>
    </div>
  );
};

export default PlayerProfilePage;
