import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface MatchStat {
  id: number;
  playerName: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

const MatchStatsAdminPage = () => {
  const [stats, setStats] = useState<MatchStat[]>([]);
  const [editingStat, setEditingStat] = useState<MatchStat | null>(null);
  const [updatedStat, setUpdatedStat] = useState({
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  });

  const fetchStats = () => {
    axios.get('/MatchStats')
      .then(res => setStats(res.data))
      .catch(err => console.error('İstatistikler alınamadı:', err));
  };

  const deleteStat = (id: number) => {
    if (!window.confirm('Bu istatistiği silmek istediğinize emin misiniz?')) return;

    axios.delete(`/MatchStats/${id}`)
      .then(() => fetchStats())
      .catch(err => console.error('Silme işlemi başarısız:', err));
  };

  const updateStat = () => {
    if (!editingStat) return;

    axios.put(`/MatchStats/${editingStat.id}`, updatedStat)
      .then(() => {
        fetchStats();
        setEditingStat(null);
      })
      .catch(err => console.error('Güncelleme hatası:', err));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">📊 Maç İstatistikleri</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Oyuncu</th>
            <th>Gol</th>
            <th>Asist</th>
            <th>Sarı Kart</th>
            <th>Kırmızı Kart</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(stat => (
            <tr key={stat.id}>
              <td>{stat.id}</td>
              <td>{stat.playerName}</td>
              <td>{stat.goals}</td>
              <td>{stat.assists}</td>
              <td>{stat.yellowCards}</td>
              <td>{stat.redCards}</td>
              <td>
                <button className="edit-button" onClick={() => {
                  setEditingStat(stat);
                  setUpdatedStat({
                    goals: stat.goals,
                    assists: stat.assists,
                    yellowCards: stat.yellowCards,
                    redCards: stat.redCards,
                  });
                }}>🖊️ Düzenle</button>
                <button className="delete-button" onClick={() => deleteStat(stat.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingStat && (
        <div className="modal">
          <div className="modal-content">
            <h3>İstatistik Düzenle</h3>
            <label>Gol:</label>
            <input type="number" value={updatedStat.goals} onChange={(e) => setUpdatedStat({ ...updatedStat, goals: +e.target.value })} />
            <label>Asist:</label>
            <input type="number" value={updatedStat.assists} onChange={(e) => setUpdatedStat({ ...updatedStat, assists: +e.target.value })} />
            <label>Sarı Kart:</label>
            <input type="number" value={updatedStat.yellowCards} onChange={(e) => setUpdatedStat({ ...updatedStat, yellowCards: +e.target.value })} />
            <label>Kırmızı Kart:</label>
            <input type="number" value={updatedStat.redCards} onChange={(e) => setUpdatedStat({ ...updatedStat, redCards: +e.target.value })} />
            <div className="modal-buttons">
              <button onClick={updateStat}>Kaydet</button>
              <button onClick={() => setEditingStat(null)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchStatsAdminPage;