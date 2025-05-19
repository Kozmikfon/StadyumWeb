// src/pages/Team/TeamList.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './teams.css';

const TeamList = () => {
  const [teams, setTeams] = useState([]);

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
        {teams.map((team: any) => (
          <div key={team.id} className="team-card">
            <h3>{team.name}</h3>
            <p><strong>Kaptan:</strong> {team.captain?.firstName} {team.captain?.lastName}</p>
            <p><strong>Oyuncu Sayısı:</strong> {team.players?.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
