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
}

const PlayerDetailPage: React.FC = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);

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
        setMatches(response.data);
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
      <h2>{player.firstName} {player.lastName}</h2>
      <p><strong>Email:</strong> {player.email}</p>
      <p><strong>Pozisyon:</strong> {player.position}</p>
      <p><strong>Yetenek Seviyesi:</strong> {player.skillLevel}</p>
      <p><strong>Puan:</strong> {player.rating}</p>
      <p><strong>Takım:</strong> {player.team?.name || 'Yok'}</p>

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
    </div>
  );
};

export default PlayerDetailPage;
