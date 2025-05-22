import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
  const [players, setPlayers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    playerId: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  });

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

  const fetchPlayers = async () => {
    try {
      const res = await axios.get('http://localhost:5275/api/Players');
      setPlayers(res.data);
    } catch (err) {
      console.error('❌ Oyuncular alınamadı:', err);
    }
  };

  useEffect(() => {
    if (matchId) {
      fetchStats();
      fetchPlayers();
    }
  }, [matchId]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!matchId) return;

    try {
      await axios.post('http://localhost:5275/api/MatchStats', {
        matchId: Number(matchId),
        ...formData,
      });

      alert('✅ İstatistik başarıyla eklendi.');
      fetchStats(); // Listeyi yenile
    } catch (err) {
      console.error('❌ Ekleme hatası:', err);
      alert('İstatistik eklenemedi.');
    }
  };

  return (
    <div className="match-stats-container">
      <h2>📊 Maç İstatistikleri</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : stats.length === 0 ? (
        <p>Bu maça ait istatistik bulunamadı.</p>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Oyuncu</th>
              <th>Gol</th>
              <th>Asist</th>
              <th>Sarı Kart</th>
              <th>Kırmızı Kart</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>➕ Yeni İstatistik Ekle</h3>
      <form onSubmit={handleSubmit} className="stat-form">
        <label>Oyuncu:</label>
        <select name="playerId" value={formData.playerId} onChange={handleInputChange} required>
          <option value={0}>Seçin...</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>

        <label>Gol:</label>
        <input type="number" name="goals" value={formData.goals} onChange={handleInputChange} min={0} />

        <label>Asist:</label>
        <input type="number" name="assists" value={formData.assists} onChange={handleInputChange} min={0} />

        <label>Sarı Kart:</label>
        <input type="number" name="yellowCards" value={formData.yellowCards} onChange={handleInputChange} min={0} />

        <label>Kırmızı Kart:</label>
        <input type="number" name="redCards" value={formData.redCards} onChange={handleInputChange} min={0} />

        <button type="submit" className="submit-btn">Ekle</button>
      </form>
    </div>
  );
};

export default MatchStatsPage;
