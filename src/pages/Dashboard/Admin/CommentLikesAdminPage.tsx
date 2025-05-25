import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface LikeRecord {
  id: number;
  reviewId: number;
  playerId: number;
  createdAt: string;
}

const CommentLikesAdminPage = () => {
  const [likes, setLikes] = useState<LikeRecord[]>([]);


  const fetchAllLikes = () => {
    axios.get('/CommentLikes')
      .then(res => setLikes(res.data))
      .catch(err => console.error('Beğeniler yüklenemedi:', err));
  };

  const deleteLike = (id: number) => {
    if (!window.confirm('Bu beğeniyi silmek istediğinizden emin misiniz?')) return;

    axios.delete(`/CommentLikes/${id}`)
      .then(() => fetchAllLikes())
      .catch(err => console.error('Silme işlemi başarısız:', err));
  };

  useEffect(() => {
    fetchAllLikes();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">👍 Yorum Beğenileri</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Yorum ID</th>
            <th>Oyuncu ID</th>
            <th>Beğeni Tarihi</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {likes.map(like => (
            <tr key={like.id}>
              <td>{like.id}</td>
              <td>{like.reviewId}</td>
              <td>{like.playerId}</td>
              <td>{new Date(like.createdAt).toLocaleString()}</td>
              <td>
                <button className="delete-button" onClick={() => deleteLike(like.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommentLikesAdminPage;
