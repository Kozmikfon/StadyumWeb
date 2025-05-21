import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './PlayerProfilePage.css';
import { useNavigate } from 'react-router-dom';

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  skillLevel: string;
  rating: number;
  teamId?: number;
  teamName?: string;
  createAd: string;
}

interface PlayerStats {
  totalMatches: number;
  totalOffers: number;
  averageRating: number;
  membershipDays: number;
}

const PlayerProfilePage = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        const res = await axios.get(`http://localhost:5275/api/players/byUser/${userId}`);
        setPlayer(res.data);
      } catch (err) {
        console.error('Oyuncu verisi alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !player?.id) return;

        const res = await axios.get(`http://localhost:5275/api/players/stats/${player.id}`);
        setStats(res.data);
      } catch (err) {
        console.error('İstatistik verisi alınamadı:', err);
      }
    };

    if (player) fetchStats();
  }, [player]);

  const handleLeaveTeam = async () => {
  const token = localStorage.getItem('token');
  if (!token || !player?.id) {
    alert('🔒 Giriş yapılmamış veya oyuncu bilgisi eksik.');
    return;
  }

  const confirmLeave = window.confirm("Takımdan ayrılmak istediğinize emin misiniz?");
  if (!confirmLeave) return;

  try {
    await axios.delete(`http://localhost:5275/api/TeamMembers/leave/${player.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("✅ Takımdan başarıyla ayrıldınız!");
    window.location.reload();

  } catch (leaveError: any) {
    // ✅ 400 Bad Request kontrolü: kaptan kontrolü veya özel hata
    if (axios.isAxiosError(leaveError) && leaveError.response?.status === 400) {
      alert(`⚠️ ${leaveError.response.data}`);
      return;
    }

    console.warn("leave/{playerId} başarısız oldu, fallback yönteme geçiliyor...", leaveError);

    try {
      const memberRes = await axios.get('http://localhost:5275/api/TeamMembers');
      const membership = memberRes.data.find((m: any) => m.playerId === player.id);

      if (!membership) {
        alert('❌ Takım üyeliği bulunamadı.');
        return;
      }

      await axios.delete(`http://localhost:5275/api/TeamMembers/${membership.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Takımdan ayrıldınız (alternatif yöntem).");
      window.location.reload();

    } catch (fallbackError) {
      console.error("❌ Her iki yöntem de başarısız:", fallbackError);
      alert("⚠️ Takımdan ayrılamadınız. Lütfen daha sonra tekrar deneyin.");
    }
  }
};


  if (loading || !player) return <p className="loading">Yükleniyor...</p>;

  return (
    <div className="profile-container">
      <h2>👤 Oyuncu Profilim</h2>
      <p><strong>Ad Soyad:</strong> {player.firstName} {player.lastName}</p>
      <p><strong>Pozisyon:</strong> {player.position}</p>
      <p><strong>Seviye:</strong> {player.skillLevel}</p>
      <p><strong>Rating:</strong> {player.rating}</p>
      <p><strong>Email:</strong> {player.email}</p>
      <p><strong>Kayıt Tarihi:</strong> {new Date(player.createAd).toLocaleDateString('tr-TR')}</p>
      <p><strong>Takım:</strong> {player.teamName || 'Takımsız'}</p>

      {player.teamId ? (
        <button onClick={handleLeaveTeam} className="leave-btn">Takımdan Ayrıl</button>
      ) : (
        <button onClick={() => navigate('/teams')} className="join-btn">Takıma Katıl</button>
      )}

      <div className="button-group">
        <button onClick={() => navigate('/matches')}>📅 Maçlarım</button>
        <button onClick={() => navigate('/my-offers')}>📨 Gelen Teklifler</button>
        <button onClick={() => navigate('/players')}>👥 Oyuncular Listesi</button>
        <button onClick={() => navigate('/profile/edit')}>🛠 Profilimi Düzenle</button>
        <button onClick={() => navigate('/reviews')}>💬 Yorumlarım</button>
      </div>
<button onClick={() => navigate('/change-password')} className="password-btn">
  🔐 Şifremi Değiştir
</button>

      {stats && (
        <div className="stats-card">
          <h3>📊 İstatistiklerim</h3>
          <p>🎮 Maç Sayısı: {stats.totalMatches}</p>
          <p>📨 Gelen Teklifler:{stats.totalOffers}</p>
          <p>📈 Ortalama Puan:  {stats.averageRating.toFixed(1)}</p>
          <p>📅 Takım Üyeliği:  {stats.membershipDays} gün</p>
        </div>
      )}
    </div>
  );
};

export default PlayerProfilePage;
