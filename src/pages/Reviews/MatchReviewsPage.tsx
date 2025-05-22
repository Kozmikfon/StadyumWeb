import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './MatchReviewsPage.css';

interface Review {
  id: number;
  matchId: number;
  reviewerId: number;
  comment: string;
  rating: number;
}

const MatchReviewsPage = () => {
  const { matchId } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(3);
  const [liked, setLiked] = useState<{ [id: number]: boolean }>({});
  const [likeCount, setLikeCount] = useState<{ [id: number]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded: any = jwtDecode(token);
let rawPlayerId = decoded?.playerId;
const playerId = Array.isArray(rawPlayerId) ? Number(rawPlayerId[0]) : Number(rawPlayerId);


      setPlayerId(playerId);

      const res = await axios.get('http://localhost:5275/api/Reviews');
      const matchReviews = res.data.filter((r: Review) => r.matchId === Number(matchId));
      setReviews(matchReviews);

      const likeStates: any = {};
      const likeCounts: any = {};

      for (const review of matchReviews) {
        const [likedRes, countRes] = await Promise.all([
          axios.get(`http://localhost:5275/api/CommentLikes/has-liked/${review.id}/${playerId}`),
          axios.get(`http://localhost:5275/api/CommentLikes/count/${review.id}`),
        ]);
        likeStates[review.id] = likedRes.data;
        likeCounts[review.id] = countRes.data;
      }

      setLiked(likeStates);
      setLikeCount(likeCounts);
    };

    fetchData();
  }, [matchId]);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Giriş yapmadınız.");
      return;
    }

    const decoded: any = jwtDecode(token);
    const rawPlayerId = decoded?.playerId;
const reviewerId = Array.isArray(rawPlayerId) ? Number(rawPlayerId[0]) : Number(rawPlayerId);

    

    if (!reviewerId || isNaN(reviewerId) || !matchId || !comment.trim() || rating < 1 || rating > 5) {
      alert("Lütfen geçerli bir yorum, puan ve giriş yapmış kullanıcı bilgisi girin.");
      console.log("Hatalı veri:", { reviewerId, matchId, comment, rating });
      return;
    }

    try {
      await axios.post('http://localhost:5275/api/Reviews', {
        matchId: Number(matchId),
        reviewerId,
        reviewedUserId: null,
        reviewedTeamId: null,
        comment: comment.trim(),
        rating
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert("✅ Yorum gönderildi.");
      setComment('');
      setRating(3);
      window.location.reload();
    } catch (error) {
      console.error("❌ Yorum gönderilemedi:", error);
      alert("Yorum gönderilirken hata oluştu.");
    }
  };

  const handleLike = async (reviewId: number) => {
    const token = localStorage.getItem('token');
    if (!token || !playerId) return;

    await axios.post('http://localhost:5275/api/CommentLikes', {
      reviewId,
      playerId,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const [likedRes, countRes] = await Promise.all([
      axios.get(`http://localhost:5275/api/CommentLikes/has-liked/${reviewId}/${playerId}`),
      axios.get(`http://localhost:5275/api/CommentLikes/count/${reviewId}`),
    ]);

    setLiked(prev => ({ ...prev, [reviewId]: likedRes.data }));
    setLikeCount(prev => ({ ...prev, [reviewId]: countRes.data }));
  };

  return (
    <div className="match-reviews-page">
      <h2>📝 Maç Yorumları</h2>

      <div className="review-form">
        <label>Puan: </label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <textarea
          placeholder="Yorumunuzu yazın..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleSubmit}>Gönder</button>
      </div>

      <h3>📄 Yapılan Yorumlar</h3>
      {reviews.length === 0 ? (
        <p>Henüz yorum yapılmamış.</p>
      ) : (
        reviews.map(r => (
  <div key={r.id} className="review-card">
    <p><strong>⭐ {r.rating}</strong></p>
    <p>{r.comment}</p>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        onClick={() => handleLike(r.id)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          paddingRight: '6px',
        }}
      >
        {liked[r.id] ? '❤️' : '🤍'}
      </button>
      <span style={{ fontSize: '14px' }}>{likeCount[r.id] || 0}</span>
    </div>
  </div>
        ))
      )}
    </div>
  );
};

export default MatchReviewsPage;
