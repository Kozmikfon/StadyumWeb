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

  useEffect(() => {
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

    if (matchId) fetchStats();
  }, [matchId]);

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
            {stats.map(stat => (
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
    </div>
  );
};

export default MatchStatsPage;
