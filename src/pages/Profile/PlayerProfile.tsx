import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

const PlayerProfile = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<any>(null);
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalOffers: 0,
    averageRating: 0,
    membershipDays: 0,
  });

  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const playerId = JSON.parse(atob(token.split('.')[1])).playerId;

    try {
      const resPlayer = await axios.get(`http://localhost:5275/api/Players/${playerId}`);
      setPlayer(resPlayer.data);

      const resStats = await axios.get(`http://localhost:5275/api/Players/stats/${playerId}`);
      setStats(resStats.data);
    } catch (err) {
      alert('Oyuncu bilgileri alınamadı.');
    }
  };

  fetchData();
}, [navigate]);


  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleLeaveTeam = () => {
    if (!player) return;
    axios.delete(`http://localhost:5275/api/TeamMembers/leave/${player.id}`)
      .then(() => {
        alert('Takımdan ayrıldınız');
        setPlayer({ ...player, teamName: null, teamId: null });
      });
  };

  const handleJoinTeam = () => navigate('/teams');

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Oyuncu Profilim</h2>
        {player ? (
          <>
            <div className="info-box">
              <p><strong>Ad:</strong> {player.firstName} {player.lastName}</p>
              <p><strong>Email:</strong> {player.email}</p>
              <p><strong>Pozisyon:</strong> {player.position}</p>
              <p><strong>Yetenek:</strong> {player.skillLevel}</p>
              <p><strong>Rating:</strong> {player.rating}</p>
              <p><strong>Takım:</strong> {player.teamName || 'Takımsız'}</p>
            </div>

            {player.teamId ? (
              <button className="danger" onClick={handleLeaveTeam}>Takımdan Ayrıl</button>
            ) : (
              <button className="success" onClick={handleJoinTeam}>Takıma Katıl</button>
            )}

            <div className="stats">
              <h4>İstatistikler</h4>
              <p>🎮 Maç Sayısı: {stats.totalMatches}</p>
              <p>📨 Teklif Sayısı: {stats.totalOffers}</p>
              <p>⭐ Ortalama Puan: {stats.averageRating.toFixed(1)}</p>
              <p>📆 Üyelik Süresi: {stats.membershipDays} gün</p>
            </div>

            <div className="actions">
              <button onClick={() => navigate('/mymatches')}>Maçlarım</button>
              <button onClick={() => navigate('/myoffers')}>Teklifler</button>
              <button onClick={() => navigate('/playerlist')}>Oyuncular</button>
              <button onClick={() => navigate('/myreviews')}>Yorumlarım</button>
              <button onClick={() => navigate('/editprofile')}>Profili Düzenle</button>
            </div>

            <button onClick={handleLogout} className="logout">Çıkış Yap</button>
          </>
        ) : <p>Yükleniyor...</p>}
      </div>
    </div>
  );
};

export default PlayerProfile;
