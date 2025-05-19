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
}

interface Team {
  name: string;
  captain?: Player;
  players: Player[];
}

const TeamDetailPage: React.FC = () => {
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`http://localhost:5275/api/Teams/${id}`);
        setTeam(response.data);
      } catch (error) {
        console.error('Takım verisi alınamadı:', error);
      }
    };

    fetchTeam();
  }, [id]);

  if (!team) return <p className="team-loading">Yükleniyor...</p>;

  return (
    <div className="team-detail">
      <h2>{team.name}</h2>
      <p><strong>Kaptan:</strong> {team.captain ? `${team.captain.firstName} ${team.captain.lastName}` : 'Yok'}</p>
      <h3>Oyuncular</h3>
      <ul>
        {team.players.map((player) => (
          <li key={player.id}>
            {player.firstName} {player.lastName} – {player.position} ({player.skillLevel})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDetailPage;
