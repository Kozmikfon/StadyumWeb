import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './CaptainOffersPage.css';

interface Offer {
  id: number;
  senderName: string;
  matchId: number;
  fieldName: string;
  matchDate: string;
  status: string;
}

const CaptainOffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaptainOffers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Giriş yapmanız gerekiyor.');
          navigate('/login');
          return;
        }

        const decoded: any = jwtDecode(token);
        const rawPlayerId = decoded.playerId;
        const playerId = Array.isArray(rawPlayerId) ? rawPlayerId[0] : rawPlayerId;

        const res = await axios.get(`http://localhost:5275/api/Offers/byCaptain/${playerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOffers(res.data);
      } catch (err) {
        console.error('❌ Kaptan teklifleri alınamadı:', err);
        alert('Teklifler alınırken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchCaptainOffers();
  }, [navigate]);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Pending': return 'Beklemede';
      case 'Accepted': return 'Onaylandı';
      case 'Rejected': return 'Reddedildi';
      default: return status;
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="captain-offers-container">
      <h2>🛡 Maça Gelen Teklifler</h2>

      {offers.length === 0 ? (
        <p>Henüz maçlara teklif gelmedi.</p>
      ) : (
        offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <p><strong>Gönderen:</strong> {offer.senderName}</p>
            <p><strong>Saha:</strong> {offer.fieldName}</p>
            <p><strong>Tarih:</strong> {new Date(offer.matchDate).toLocaleDateString()}</p>
            <p><strong>Durum:</strong> {translateStatus(offer.status)}</p>
            <button className="detail-btn" onClick={() => navigate(`/matches/${offer.matchId}`)}>
              📄 Maç Detayı
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CaptainOffersPage;
