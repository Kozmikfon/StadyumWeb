import { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Link } from 'react-router-dom';
import './teams.css';

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
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [isMember, setIsMember] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const userId = decoded?.userId;

        const playerRes = await axios.get(`http://localhost:5275/api/players/byUser/${userId}`);
        const fetchedPlayerId = playerRes.data.id;
        setPlayerId(fetchedPlayerId);

        const membersRes = await axios.get('http://localhost:5275/api/TeamMembers');
        const alreadyInTeam = membersRes.data.some((tm: any) => tm.playerId === fetchedPlayerId);
        setIsMember(alreadyInTeam);

        const teamsRes = await axios.get('http://localhost:5275/api/Teams');
        setTeams(teamsRes.data);
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      }
    };

    fetchData();
  }, []);

  const handleJoin = async (teamId: number) => {
    const token = localStorage.getItem('token');
    if (!token || playerId === null) return alert("Giriş yapılmalı.");

    try {
      await axios.post(
        'http://localhost:5275/api/TeamMembers',
        { teamId, playerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Takıma başarıyla katıldınız!");
      window.location.reload();
    } catch (error) {
      console.error("Katılamadı:", error);
      alert("Takıma katılamadınız.");
    }
  };

  return (
    <div className="team-page">
      <h2>Takımlar</h2>
      <div className="team-grid">
        {teams.map((team) => (
          <div className="team-card" key={team.id}>
            <div className="team-icon">{team.name[0]}</div>
            <h3>{team.name}</h3>
            <p>🧑‍✈️ Kaptan: {team.captain?.firstName || 'Belirlenmemiş'}</p>
            <p>👥 Oyuncular: {team.players.length}</p>

            {isMember ? (
              <button className="joined-btn" disabled>Katıldınız</button>
            ) : (
              <button className="join-btn" onClick={() => handleJoin(team.id)}>Takıma Katıl</button>
            )}

            <Link to={`/teams/${team.id}`} className="detail-link">Detay</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
