import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface Review {
  id: number;
  matchId: number;
  reviewerId: number;
  reviewedUserId: number;
  reviewedTeamId: number;
  comment: string;
  rating: number;
}

const ReviewsAdminPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [updatedComment, setUpdatedComment] = useState('');
  const [updatedRating, setUpdatedRating] = useState<number>(0);

  const fetchReviews = () => {
    axios.get('/Reviews')
      .then(res => setReviews(res.data))
      .catch(err => console.error('Yorumlar yüklenemedi:', err));
  };

  const deleteReview = (id: number) => {
    if (!window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    axios.delete(`/Reviews/${id}`)
      .then(() => fetchReviews())
      .catch(err => console.error('Silme işlemi başarısız:', err));
  };

  const updateReview = () => {
    if (!editingReview) return;

    axios.put(`/Reviews/${editingReview.id}`, {
      ...editingReview,
      comment: updatedComment,
      rating: updatedRating,
    })
      .then(() => {
        fetchReviews();
        setEditingReview(null);
      })
      .catch(err => console.error('Güncelleme başarısız:', err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">📝 Yorumlar</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Match ID</th>
            <th>Reviewer ID</th>
            <th>Reviewed User ID</th>
            <th>Comment</th>
            <th>Rating</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(review => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.matchId}</td>
              <td>{review.reviewerId}</td>
              <td>{review.reviewedUserId}</td>
              <td>{review.comment}</td>
              <td>{review.rating}</td>
              <td>
                <button className="edit-button" onClick={() => {
                  setEditingReview(review);
                  setUpdatedComment(review.comment);
                  setUpdatedRating(review.rating);
                }}>🖊️ Düzenle</button>
                <button className="delete-button" onClick={() => deleteReview(review.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingReview && (
        <div className="modal">
          <div className="modal-content">
            <h3>Yorumu Düzenle</h3>
            <label>Yorum:</label>
            <textarea value={updatedComment} onChange={(e) => setUpdatedComment(e.target.value)} />
            <label>Puan:</label>
            <input
              type="number"
              value={updatedRating}
              onChange={(e) => setUpdatedRating(Number(e.target.value))}
              min={0} max={5}
            />
            <div className="modal-buttons">
              <button onClick={updateReview}>Kaydet</button>
              <button onClick={() => setEditingReview(null)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsAdminPage;