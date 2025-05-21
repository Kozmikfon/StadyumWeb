import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './MatchDetailPage.css';

interface Offer {
  id: number;
  senderId: number;
  receiverId: number;
  matchId: number;
  receiverName?: string;
  status: string;
}

interface Match {
  id: number;
  fieldName: string;
  matchDate: string;
  team1Name: string;
  team2Name: string;
  team1CaptainId: number;
}

interface PlayerStats {
  totalMatches: number;
  totalOffers: number;
  averageRating: number;
  membershipDays: number;
}

const MatchDetailPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [acceptedOffers, setAcceptedOffers] = useState<Offer[]>([]);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [playerStats, setPlayerStats] = useState<{ [id: number]: PlayerStats }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!matchId) {
        console.error("❌ matchId URL'den alınamadı.");
        return;
      }

      const token = localStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      setPlayerId(decoded.playerId);

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [matchRes, offersRes, acceptedRes] = await Promise.all([
          axios.get(`http://localhost:5275/api/Matches/${matchId}`, config),
          axios.get(`http://localhost:5275/api/Offers`, config),
          axios.get(`http://localhost:5275/api/Offers/accepted-by-match/${matchId}`, config),
        ]);

        setMatch(matchRes.data);
        setOffers(offersRes.data.filter((o: Offer) => o.matchId === parseInt(matchId)));
        setAcceptedOffers(acceptedRes.data);

        for (const offer of acceptedRes.data) {
          const stats = await axios.get(`http://localhost:5275/api/Players/stats/${offer.receiverId}`);
          setPlayerStats((prev) => ({ ...prev, [offer.receiverId]: stats.data }));
        }
      } catch (err) {
        console.error("❌ Maç detayları alınamadı:", err);
      }
    };

    fetchData();
  }, [matchId]);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Accepted': return 'Kabul Edildi';
      case 'Rejected': return 'Reddedildi';
      case 'Pending': return 'Beklemede';
      default: return status;
    }
  };

  const handleUpdateStatus = async (offerId: number, status: 'Accepted' | 'Rejected') => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5275/api/Offers/update-status/${offerId}`, `"${status}"`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    window.location.reload(); // sayfayı yenile
  };

  const handleRemoveOffer = async (offerId: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5275/api/Offers/${offerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAcceptedOffers(prev => prev.filter(o => o.id !== offerId));
  };

  if (!match) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="match-detail-page">
      <h2>🏟 Maç Detayı</h2>
      <p><strong>Saha:</strong> {match.fieldName}</p>
      <p><strong>Tarih:</strong> {new Date(match.matchDate).toLocaleString()}</p>
      <p><strong>Takım 1:</strong> {match.team1Name}</p>
      <p><strong>Takım 2:</strong> {match.team2Name}</p>

      <h3>📨 Gelen Teklifler</h3>
      <ul className="offer-list">
        {offers.map(offer => (
          <li key={offer.id}>
            Gönderen: {offer.senderId} | Alıcı: {offer.receiverId} | Durum: {translateStatus(offer.status)}
            {offer.status === 'Pending' && offer.receiverId === playerId && (
              <>
                <button onClick={() => handleUpdateStatus(offer.id, 'Accepted')}>Kabul Et</button>
                <button onClick={() => handleUpdateStatus(offer.id, 'Rejected')}>Reddet</button>
              </>
            )}
          </li>
        ))}
        {offers.length === 0 && <li>Bu maça teklif gönderilmemiş.</li>}
      </ul>

      <h3>✅ Katılacak Oyuncular</h3>
      <ul className="accepted-list">
        {acceptedOffers.map(offer => (
          <li key={offer.id}>
            <strong>{offer.receiverName}</strong>
            <ul>
              <li>Durum: {translateStatus(offer.status)}</li>
              <li>Maç: {playerStats[offer.receiverId]?.totalMatches || 0}</li>
              <li>Teklif: {playerStats[offer.receiverId]?.totalOffers || 0}</li>
              <li>Puan: {playerStats[offer.receiverId]?.averageRating || 0}</li>
              <li>Üyelik: {playerStats[offer.receiverId]?.membershipDays || 0} gün</li>
            </ul>
            {match.team1CaptainId === playerId && (
              <button onClick={() => handleRemoveOffer(offer.id)}>❌ Oyuncuyu Çıkar</button>
            )}
          </li>
        ))}
        {acceptedOffers.length === 0 && <li>Henüz kabul edilen oyuncu yok.</li>}
      </ul>

      <button
        className="review-button"
        onClick={() => navigate(`/match-reviews/${match.id}`)}
      >
        📝 Yorum Yap & Görüntüle
      </button>
    </div>
  );
};

export default MatchDetailPage;
