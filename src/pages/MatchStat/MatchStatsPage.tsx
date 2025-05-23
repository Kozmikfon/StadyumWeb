import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './MatchStatsPage.css';

interface Match {
  id: number;
  fieldName: string;
  matchDate: string;
  team1Name: string;
  team2Name: string;
}

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
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [stats, setStats] = useState<MatchStat[]>([]);
  const [matchEnded, setMatchEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({ id: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      setToken(localToken);
      const decoded: any = jwtDecode(localToken);
      const id = Array.isArray(decoded.playerId) ? decoded.playerId[0] : decoded.playerId;
      setPlayerId(id);
    }

    axios.get('http://localhost:5275/api/Matches')
      .then(res => {
        const pastMatches = res.data.filter((m: Match) => new Date(m.matchDate) < new Date());
        setMatches(pastMatches);
      });
  }, []);

  useEffect(() => {
    if (selectedMatchId) {
      setLoading(true);
      axios.get(`http://localhost:5275/api/MatchStats/byMatch/${selectedMatchId}`)
        .then(res => setStats(res.data))
        .finally(() => setLoading(false));

      axios.get(`http://localhost:5275/api/Matches/${selectedMatchId}`)
        .then(res => setMatchEnded(new Date(res.data.matchDate) < new Date()));
    }
  }, [selectedMatchId]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedMatchId || !playerId || !token) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      if (editMode) {
        await axios.put(`http://localhost:5275/api/MatchStats/${formData.id}`, {
          matchId: selectedMatchId,
          playerId,
          ...formData,
        }, config);
        alert('✅ İstatistik güncellendi.');
      } else {
        await axios.post('http://localhost:5275/api/MatchStats', {
          matchId: selectedMatchId,
          playerId,
          ...formData,
        }, config);
        alert('✅ İstatistik eklendi.');
      }
      setFormData({ id: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 });
      setEditMode(false);
      const res = await axios.get(`http://localhost:5275/api/MatchStats/byMatch/${selectedMatchId}`);
      setStats(res.data);
    } catch (err) {
      alert('❌ Kayıt başarısız.');
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
    if (!window.confirm('Silmek istediğine emin misin?')) return;
    if (!token) return;
    await axios.delete(`http://localhost:5275/api/MatchStats/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await axios.get(`http://localhost:5275/api/MatchStats/byMatch/${selectedMatchId}`);
    setStats(res.data);
  };

  return (
    <div className="match-stats-container">
      <h2>📊 Maç İstatistikleri</h2>

      <label>Maç Seç:</label>
      <select onChange={(e) => setSelectedMatchId(Number(e.target.value))}>
        <option value="">-- Maç Seçin --</option>
        {matches.map(match => (
          <option key={match.id} value={match.id}>
            {match.team1Name} vs {match.team2Name} - {new Date(match.matchDate).toLocaleDateString('tr-TR')}
          </option>
        ))}
      </select>

      {loading && <p>Yükleniyor...</p>}

      {selectedMatchId && stats.length > 0 && (
        <table className="stats-table">
          <thead>
            <tr>
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

      {selectedMatchId && matchEnded && (
        <form onSubmit={handleSubmit} className="stat-form">
          <h3>{editMode ? '🛠 Düzenle' : '➕ Yeni Ekle'}</h3>
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
      )}

      {selectedMatchId && !matchEnded && (
        <p style={{ color: 'gray', marginTop: '1rem' }}>Maç tamamlanmadan istatistik eklenemez.</p>
      )}
    </div>
  );
};

export default MatchStatsPage;
