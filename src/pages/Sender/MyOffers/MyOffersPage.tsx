import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyOffersPage.css';

interface Offer {
  id: number;
  matchId: number;
  matchFieldName: string;
  matchTeamName: string;
  matchCaptainName: string;
  status: string;
}

const MyOffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Giriş yapmanız gerekiyor.');
          navigate('/login');
          return;
        }

        const decoded: any = jwtDecode(token);
        // ✅ playerId varsa array mi kontrolü
        const rawId = decoded.playerId;
        const playerId = Array.isArray(rawId) ? rawId[0] : rawId;

        const response = await axios.get(`http://localhost:5275/api/Offers/byPlayer/${playerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOffers(response.data);
      } catch (err) {
        console.error('❌ Teklifler alınamadı:', err);
        alert('Teklifler alınırken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [navigate]);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Pending': return 'Beklemede';
      case 'Accepted': return 'Onaylandı';
      case 'Rejected': return 'Reddedildi';
      default: return status;
    }
  };

  const updateStatus = async (offerId: number, status: string) => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(`http://localhost:5275/api/Offers/update-status/${offerId}`, { status }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      alert(`Teklif ${translateStatus(status)} olarak güncellendi`);
      // Teklif durumu yerinde güncellensin:
      setOffers(prev =>
        prev.map(o => o.id === offerId ? { ...o, status } : o)
      );
    } catch (error) {
      console.error('❌ Güncelleme hatası:', error);
      alert('Durum güncellenemedi.');
    }
  };

  const renderOfferCard = (offer: Offer) => (
    <div key={offer.id} className="offer-card">
      <p><strong>Takım:</strong> {offer.matchTeamName}</p>
      <p><strong>Saha:</strong> {offer.matchFieldName}</p>
      <p><strong>Kaptan:</strong> {offer.matchCaptainName}</p>
      <p><strong>Durum:</strong> {translateStatus(offer.status)}</p>
      <div className="offer-actions">
        {offer.status === 'Pending' && (
          <>
            <button className="accept-btn" onClick={() => updateStatus(offer.id, 'Accepted')}>Onayla</button>
            <button className="reject-btn" onClick={() => updateStatus(offer.id, 'Rejected')}>Reddet</button>
          </>
        )}
        <button className="detail-btn" onClick={() => navigate(`/matches/${offer.matchId}`)}>📄 Maç Detayı</button>
      </div>
    </div>
  );

  const filterOffers = (status: string) =>
    offers.filter(o => o.status === status);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="my-offers-container">
      <h2>📨 Bekleyen Teklifler</h2>
      {filterOffers('Pending').length > 0
        ? filterOffers('Pending').map(renderOfferCard)
        : <p>Henüz bekleyen teklif yok.</p>}

      <h2>✅ Kabul Ettiklerim</h2>
      {filterOffers('Accepted').length > 0
        ? filterOffers('Accepted').map(renderOfferCard)
        : <p>Hiçbir teklifi kabul etmediniz.</p>}

      <h2>❌ Reddettiklerim</h2>
      {filterOffers('Rejected').length > 0
        ? filterOffers('Rejected').map(renderOfferCard)
        : <p>Henüz reddettiğiniz teklif yok.</p>}

      <button className="captain-btn" onClick={() => navigate('/captain-offers')}>
        🛡 Maça Gelen Teklifleri Gör
      </button>
    </div>
  );
};

export default MyOffersPage;
