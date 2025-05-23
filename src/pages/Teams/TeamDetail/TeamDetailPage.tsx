import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TeamDetailPage.css';

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  skillLevel: string;
  rating: number;
}

interface Team {
  name: string;
  captain?: Player;
  players: Player[];
}

const TeamDetailPage: React.FC = () => {
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [topPlayer, setTopPlayer] = useState<Player | null>(null);
  const [avgRating, setAvgRating] = useState<number>(0);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`http://localhost:5275/api/Teams/${id}`);
        const teamData: Team = response.data;

        setTeam(teamData);

        if (teamData.players.length > 0) {
          // En yüksek puanlı oyuncuyu bul
          const best = [...teamData.players].sort((a, b) => b.rating - a.rating)[0];
          setTopPlayer(best);

          // Ortalama rating hesapla
          const avg = teamData.players.reduce((sum, p) => sum + p.rating, 0) / teamData.players.length;
          setAvgRating(parseFloat(avg.toFixed(2)));
        }

      } catch (error) {
        console.error('Takım verisi alınamadı:', error);
      }
    };

    fetchTeam();
  }, [id]);

  if (!team) return <p className="team-loading">Yükleniyor...</p>;

  return (
    <div className="team-detail">
      <div className="team-header">
        <h2>{team.name}</h2>
        {team.captain && (
          <span className="captain-badge">
            🧑‍✈️ Kaptan: {team.captain.firstName} {team.captain.lastName}
          </span>
        )}
      </div>

      {topPlayer && (
        <div className="team-stats-box">
          <h3>📈 Takım Bilgileri</h3>
          <p><strong>En Yüksek Puanlı Oyuncu:</strong> {topPlayer.firstName} {topPlayer.lastName} – {topPlayer.rating} Puan</p>
          <p><strong>Pozisyon:</strong> {topPlayer.position}</p>
          <p><strong>Takım Puan Ortalaması:</strong> {avgRating}</p>
        </div>
      )}

      <h3>👥 Oyuncular</h3>
      <div className="player-grid">
        {team.players.map((player) => (
          <div className="player-card" key={player.id}>
            <div className="player-avatar">{player.firstName[0].toUpperCase()}</div>
            <h4>{player.firstName} {player.lastName}</h4>
            <p><strong>Pozisyon:</strong> {player.position}</p>
            <p><strong>Seviye:</strong> {player.skillLevel}</p>
            <p><strong>Puan:</strong> {player.rating}</p>
            <a href={`/players/${player.id}`} className="detail-link">Detay</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDetailPage;
