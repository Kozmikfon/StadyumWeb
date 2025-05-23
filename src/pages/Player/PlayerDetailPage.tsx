import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './PlayerDetailPage.css';

interface PlayerStat {
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  matchesPlayed: number;
}

interface Team {
  name: string;
}

interface Match {
  id: number;
  fieldName: string;
  matchDate: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  skillLevel: number;
  rating: number;
  team?: Team;
  stats?: PlayerStat;
  teamName?: string;
}

const PlayerDetailPage: React.FC = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [topMatch, setTopMatch] = useState<Match | null>(null);
  const [goalAvg, setGoalAvg] = useState<number>(0);
const [assistAvg, setAssistAvg] = useState<number>(0);
const [cardTotal, setCardTotal] = useState<number>(0);
const [participationRate, setParticipationRate] = useState<number>(0);


  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await axios.get(`http://localhost:5275/api/Players/${id}`);
        setPlayer(response.data);
      } catch (error) {
        console.error('Oyuncu verisi alınamadı:', error);
      }
    };

   const fetchMatches = async () => {
  try {
    const response = await axios.get(`http://localhost:5275/api/MatchStats/player-matches/${id}`);
    const matchesData: Match[] = response.data;
    setMatches(matchesData);

    if (matchesData.length > 0) {
      const totalGoals = matchesData.reduce((sum, m) => sum + m.goals, 0);
      const totalAssists = matchesData.reduce((sum, m) => sum + m.assists, 0);
      const totalCards = matchesData.reduce((sum, m) => sum + m.yellowCards + m.redCards, 0);

      setGoalAvg(parseFloat((totalGoals / matchesData.length).toFixed(2)));
      setAssistAvg(parseFloat((totalAssists / matchesData.length).toFixed(2)));
      setCardTotal(totalCards);

      if (player?.stats?.matchesPlayed) {
        const participation = (matchesData.length / player.stats.matchesPlayed) * 100;
        setParticipationRate(parseFloat(participation.toFixed(1)));
      }
    }

    // En iyi maç:
    const best = matchesData.reduce((max: Match | null, curr: Match) =>
      !max || curr.goals > max.goals ? curr : max,
    null);
    setTopMatch(best);
  } catch (error) {
    console.error('Oyuncunun maçları alınamadı:', error);
  }
};


    if (id) {
      fetchPlayer();
      fetchMatches();
    }
  }, [id]);

  if (!player) return <p className="player-loading">Yükleniyor...</p>;

  return (
    <div className="player-detail">
      <h2>
        <div className="player-avatar">
          {player.firstName[0].toUpperCase()}
        </div>
        {player.firstName} {player.lastName}
      </h2>

      <p><strong>Email:</strong> {player.email}</p>
      <p><strong>Pozisyon:</strong> {player.position}</p>
      <p><strong>Yetenek Seviyesi:</strong> {player.skillLevel}</p>
      <p><strong>Puan:</strong> {player.rating}</p>
      <p><strong>Takım:</strong> {player.teamName || 'Yok'}</p>

      {player.stats && (
        <div className="player-stats">
          <h3>📊 Sezon İstatistikleri</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Maç</th>
                <th>Gol</th>
                <th>Asist</th>
                <th>Sarı Kart</th>
                <th>Kırmızı Kart</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{player.stats.matchesPlayed}</td>
                <td>{player.stats.goals}</td>
                <td>{player.stats.assists}</td>
                <td>{player.stats.yellowCards}</td>
                <td>{player.stats.redCards}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {topMatch && (
        <div className="top-match-box">
          <h3>🔥 En İyi Maç</h3>
          <p><strong>Tarih:</strong> {new Date(topMatch.matchDate).toLocaleDateString()}</p>
          <p><strong>Saha:</strong> {topMatch.fieldName}</p>
          <p><strong>Goller:</strong> ⚽ {topMatch.goals}</p>
          <p><strong>Asist:</strong> 🎯 {topMatch.assists}</p>
          <Link to={`/matches/${topMatch.id}`} className="detail-link">Maç Detayı</Link>
        </div>
      )}

      {matches.length > 0 && (
        <div className="player-matches">
          <h3>📅 Oynadığı Maçlar</h3>
          <ul className="match-list">
            {matches.map((match) => (
              <li key={match.id}>
                <Link to={`/matches/${match.id}`}>
                  {new Date(match.matchDate).toLocaleDateString()} - {match.fieldName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="player-stats-advanced">
  <h3>📈 Detaylı İstatistikler</h3>
  <ul>
    <li>⚽ Gol Ortalaması: <strong>{goalAvg}</strong></li>
    <li>🎯 Asist Ortalaması: <strong>{assistAvg}</strong></li>
    <li>🟨🟥 Toplam Kart: <strong>{cardTotal}</strong></li>
    <li>📊 Maç Katılım Oranı: <strong>{participationRate}%</strong></li>
  </ul>
</div>

    </div>
  );
};

export default PlayerDetailPage;
