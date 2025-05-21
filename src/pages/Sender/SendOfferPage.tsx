import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './SendOfferPage.css';

interface Match {
  id: number;
  fieldName: string;
  matchDate: string;
}

const SendOfferPage = () => {
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const location = useLocation();
  const matchIdFromQuery = new URLSearchParams(location.search).get('matchId');

  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<number>(matchIdFromQuery ? Number(matchIdFromQuery) : 0);
  const [acceptedCount, setAcceptedCount] = useState<number>(0);
  const [senderId, setSenderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAcceptedCount = async (matchId: number) => {
    try {
      const res = await axios.get(`http://localhost:5275/api/Offers/count-accepted/${matchId}`);
      setAcceptedCount(res.data);
    } catch (err) {
      console.error("❌ Teklif sayısı alınamadı:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Giriş yapmanız gerekiyor.');
          navigate('/login');
          return;
        }

const decoded: any = jwtDecode(token);
const rawPlayerId = decoded.playerId;
const fixedPlayerId = Array.isArray(rawPlayerId) ? rawPlayerId[0] : rawPlayerId;
setSenderId(Number(fixedPlayerId));


        if (!matchIdFromQuery) {
          const res = await axios.get('http://localhost:5275/api/Matches');
          setMatches(res.data);
        } else {
          fetchAcceptedCount(Number(matchIdFromQuery));
        }
      } catch (err) {
        console.error('❌ Veriler alınamadı:', err);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (selectedMatchId !== 0) {
      fetchAcceptedCount(selectedMatchId);
    }
  }, [selectedMatchId]);

  const handleSendOffer = async () => {
    if (!senderId || selectedMatchId === 0) {
      alert('Eksik bilgi var.');
      return;
    }

    if (acceptedCount >= 14) {
      alert('Bu maç dolu.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const offerDto = {
        senderId,
        matchId: selectedMatchId,
        receiverId: receiverId ? Number(receiverId) : null,
      };
      console.log("📤 Giden DTO:", offerDto);

      await axios.post('http://localhost:5275/api/Offers', offerDto, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Teklif gönderildi');
      navigate(-1);
    } catch (err: any) {
      console.error('❌ Teklif gönderilemedi:', err);
      const msg = err.response?.data || 'Bir hata oluştu.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-offer-container">
      <h2>🎯 Teklif Gönder</h2>

      {receiverId && <p>👤 Alıcı Oyuncu ID: {receiverId}</p>}

      {!matchIdFromQuery && (
        <>
          <label htmlFor="match-select">📅 Maç Seçin:</label>
          <select
            id="match-select"
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(Number(e.target.value))}
          >
            <option value={0}>Bir maç seçin...</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                #{m.id} - {m.fieldName} ({new Date(m.matchDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </>
      )}

      <p className="capacity-info">{acceptedCount}/14 oyuncu — {14 - acceptedCount} boş yer</p>

      {acceptedCount >= 14 ? (
        <p className="full-warning">🛑 Bu maç dolu</p>
      ) : (
        <button onClick={handleSendOffer} className="send-btn" disabled={loading}>
          ➕ Teklif Gönder
        </button>
      )}
    </div>
  );
};

export default SendOfferPage;
