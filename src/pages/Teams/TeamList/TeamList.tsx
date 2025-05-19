// src/pages/Team/TeamList.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './teams.css';
import { Link } from 'react-router-dom';

interface Player {
  id: number;
  firstName: string;
  lastName: string;
}

interface Team {
  id: number;
  name: string;
  captain?: Player;
  players: Player[];
}

const TeamList = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get('http://localhost:5275/api/Teams');
        setTeams(res.data);
      } catch (err) {
        console.error('Takımlar alınamadı', err);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="teams-container">
      <h2 className="teams-title">Takım Listesi</h2>
      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <h3>{team.name}</h3>
            <p><strong>Kaptan:</strong> {team.captain?.firstName} {team.captain?.lastName}</p>
            <p><strong>Oyuncu Sayısı:</strong> {team.players?.length}</p>
            <Link to={`/teams/${team.id}`} className="detail-link">Detay</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
