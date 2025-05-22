import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  skillLevel: number;
  rating: number;
  age: number;
  nationality: string;
  team?: Team;
  stats?: PlayerStat;
}

const PlayerDetailPage: React.FC = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await axios.get(`http://localhost:5275/api/Players/${id}`);
        setPlayer(response.data);
      } catch (error) {
        console.error('Oyuncu verisi alınamadı:', error);
      }
    };

    fetchPlayer();
  }, [id]);

  if (!player) return <p className="player-loading">Yükleniyor...</p>;

  return (
    <div className="player-detail">
      <h2>{player.firstName} {player.lastName}</h2>
      <p><strong>Email:</strong> {player.email}</p>
      <p><strong>Yaş:</strong> {player.age}</p>
      <p><strong>Uyruk:</strong> {player.nationality}</p>
      <p><strong>Pozisyon:</strong> {player.position}</p>
      <p><strong>Yetenek Seviyesi:</strong> {player.skillLevel}</p>
      <p><strong>Puan:</strong> {player.rating}</p>
      <p><strong>Takım:</strong> {player.team?.name || 'Yok'}</p>

      {player.stats && (
        <div className="player-stats">
          <h3>📊 Sezon İstatistikleri</h3>
          <p><strong>Maç:</strong> {player.stats.matchesPlayed}</p>
          <p><strong>Gol:</strong> {player.stats.goals}</p>
          <p><strong>Asist:</strong> {player.stats.assists}</p>
          <p><strong>Sarı Kart:</strong> {player.stats.yellowCards}</p>
          <p><strong>Kırmızı Kart:</strong> {player.stats.redCards}</p>
        </div>
      )}
    </div>
  );
};

export default PlayerDetailPage;
