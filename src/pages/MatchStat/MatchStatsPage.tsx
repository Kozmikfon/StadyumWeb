import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './MatchStatsPage.css';

interface MatchStat {
  id: number;
  playerId: number;
  playerName: string;
  matchId: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

const MatchStatsPage = () => {
  const { matchId } = useParams();
  const [stats, setStats] = useState<MatchStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    id: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  });

  const [editMode, setEditMode] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5275/api/MatchStats/byMatch/${matchId}`);
      setStats(res.data);
    } catch (err) {
      console.error("❌ İstatistikler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      const id = Array.isArray(decoded.playerId) ? decoded.playerId[0] : decoded.playerId;
      setPlayerId(id);
    }

    if (matchId) {
      fetchStats();
    }
  }, [matchId]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!matchId || !playerId) return;

    try {
      if (editMode) {
        await axios.put(`http://localhost:5275/api/MatchStats/${formData.id}`, {
          matchId: Number(matchId),
          playerId,
          goals: formData.goals,
          assists: formData.assists,
          yellowCards: formData.yellowCards,
          redCards: formData.redCards,
        });
        alert('✅ İstatistik güncellendi.');
      } else {
        await axios.post('http://localhost:5275/api/MatchStats', {
          matchId: Number(matchId),
          playerId,
          ...formData,
        });
        alert('✅ İstatistik eklendi.');
      }

      setFormData({ id: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 });
      setEditMode(false);
      fetchStats();
    } catch (err) {
      console.error("❌ Kayıt hatası:", err);
      alert('İstatistik kaydedilemedi.');
    }
  };

  const handleEdit = (stat: MatchStat) => {
    setFormData({
      id: stat.id,
      goals: stat.goals,
      assists: stat.assists,
      yellowCards: stat.yellowCards,
      redCards: stat.redCards,
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu istatistik silinsin mi?')) return;

    try {
      await axios.delete(`http://localhost:5275/api/MatchStats/${id}`);
      alert('🗑 Silindi');
      fetchStats();
    } catch (err) {
      console.error('❌ Silme hatası:', err);
      alert('Silinemedi');
    }
  };

  return (
    <div className="match-stats-container">
      <h2>📊 Maç İstatistikleri</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : stats.length === 0 ? (
        <p>İstatistik bulunamadı.</p>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Oyuncu</th>
              <th>Gol</th>
              <th>Asist</th>
              <th>Sarı Kart</th>
              <th>Kırmızı Kart</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.id}>
                <td>{stat.playerName}</td>
                <td>{stat.goals}</td>
                <td>{stat.assists}</td>
                <td>{stat.yellowCards}</td>
                <td>{stat.redCards}</td>
                <td>
                  <button onClick={() => handleEdit(stat)} className="edit-btn">Düzenle</button>
                  <button onClick={() => handleDelete(stat.id)} className="delete-btn">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>{editMode ? '🛠 Düzenle' : '➕ Yeni Ekle'}</h3>
      <form onSubmit={handleSubmit} className="stat-form">
        <label>Gol:</label>
        <input type="number" name="goals" value={formData.goals} onChange={handleInputChange} min={0} />

        <label>Asist:</label>
        <input type="number" name="assists" value={formData.assists} onChange={handleInputChange} min={0} />

        <label>Sarı Kart:</label>
        <input type="number" name="yellowCards" value={formData.yellowCards} onChange={handleInputChange} min={0} />

        <label>Kırmızı Kart:</label>
        <input type="number" name="redCards" value={formData.redCards} onChange={handleInputChange} min={0} />

        <button type="submit" className="submit-btn">
          {editMode ? 'Güncelle' : 'Ekle'}
        </button>
      </form>
    </div>
  );
};

export default MatchStatsPage;
