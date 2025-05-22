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
  const [latestReviews, setLatestReviews] = useState<any[]>([]);
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});
  const [likedStates, setLikedStates] = useState<{ [key: number]: boolean }>({}); // ❤️ beğenme durumu

  useEffect(() => {
    const fetchData = async () => {
      if (!matchId) return;

      const token = localStorage.getItem('token');
const decoded: any = jwtDecode(token || '');
const rawPlayerId = decoded?.playerId;
const parsedPlayerId = Array.isArray(rawPlayerId) ? Number(rawPlayerId[0]) : Number(rawPlayerId);
setPlayerId(parsedPlayerId);


      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [matchRes, offersRes, acceptedRes, reviewsRes] = await Promise.all([
        axios.get(`http://localhost:5275/api/Matches/${matchId}`, config),
        axios.get(`http://localhost:5275/api/Offers`, config),
        axios.get(`http://localhost:5275/api/Offers/accepted-by-match/${matchId}`, config),
        axios.get(`http://localhost:5275/api/Reviews`, config),
      ]);

      setMatch(matchRes.data);
      setOffers(offersRes.data.filter((o: Offer) => o.matchId === parseInt(matchId)));
      setAcceptedOffers(acceptedRes.data);

      for (const offer of acceptedRes.data) {
        const stats = await axios.get(`http://localhost:5275/api/Players/stats/${offer.receiverId}`);
        setPlayerStats((prev) => ({ ...prev, [offer.receiverId]: stats.data }));
      }

      const matchReviews = reviewsRes.data.filter((r: any) => r.matchId === parseInt(matchId));
      setLatestReviews(matchReviews.slice(-3)); // Son 3 yorum

      const likeMap: any = {};
      const likedMap: any = {};

      for (const review of matchReviews) {
        const [countRes, likedRes] = await Promise.all([
          axios.get(`http://localhost:5275/api/CommentLikes/count/${review.id}`),
          axios.get(`http://localhost:5275/api/CommentLikes/has-liked/${review.id}/${parsedPlayerId}`)

        ]);

        likeMap[review.id] = countRes.data;
        likedMap[review.id] = likedRes.data;
      }

      setLikeCounts(likeMap);
      setLikedStates(likedMap);
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

  const handleLikeToggle = async (reviewId: number) => {
  const token = localStorage.getItem('token');
  if (!token || !playerId) return;

  try {
    await axios.post('http://localhost:5275/api/CommentLikes', {
      reviewId,
      playerId, // camelCase olarak gönder
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const [likedRes, countRes] = await Promise.all([
      axios.get(`http://localhost:5275/api/CommentLikes/has-liked/${reviewId}/${playerId}`),
      axios.get(`http://localhost:5275/api/CommentLikes/count/${reviewId}`),
    ]);

    setLikedStates(prev => ({ ...prev, [reviewId]: likedRes.data }));
    setLikeCounts(prev => ({ ...prev, [reviewId]: countRes.data }));
  } catch (err) {
    console.error("Like işlemi başarısız:", err);
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
    window.location.reload();
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

      <h3>🗣️ Son Yorumlar</h3>
      <ul className="review-list">
  {latestReviews.length === 0 ? (
    <li>Bu maça henüz yorum yapılmadı.</li>
  ) : (
    latestReviews.map((review) => (
      <li key={review.id}>
        <strong>⭐ {review.rating}</strong> - {review.comment}
        <span style={{ marginLeft: '10px', display: 'inline-flex', alignItems: 'center' }}>
          <button
            onClick={() => handleLikeToggle(review.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              paddingRight: '6px',
            }}
          >
            {likedStates[review.id] ? '❤️' : '🤍'}
          </button>
          <span style={{ fontSize: '14px' }}>
            {likeCounts[review.id] || 0}
          </span>
        </span>
      </li>
    ))
  )}
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
