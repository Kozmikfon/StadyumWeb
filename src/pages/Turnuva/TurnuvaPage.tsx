import { useEffect, useState } from 'react';
import axios from 'axios';
import './TurnuvaPage.css';
import CreateTeamModal from '../../Components/modals/CreateTeamModal'; // yolunu kendi dizinine göre ayarla
import JoinTeamModal from '../../Components/modals/JoinTeamModal';
import LeaveTeamModal from '../../Components/modals/LeaveTeamModal';
import { jwtDecode } from 'jwt-decode';

interface Team {
  id: number;
  name: string;
}

interface Match {
  id: number;
  fieldName: string;
  matchDate: string;
  team1: Team;
  team2: Team;
}
interface Standing {
  teamId: number;
  teamName: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
}

const TurnuvaPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [showJoinTeamModal, setShowJoinTeamModal] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);
  const [showLeaveTeamModal, setShowLeaveTeamModal] = useState(false);
  const [standings, setStandings] = useState<Standing[]>([]);


  const fetchData = async () => {
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const decoded: any = jwtDecode(token!);
    const userId = decoded.userId;

    const playerRes = await axios.get(`http://localhost:5275/api/players/byUser/${userId}`, config);

    setPlayerId(playerRes.data.id);
    setCurrentTeamId(playerRes.data.teamId || null);

    const teamRes = await axios.get('http://localhost:5275/api/Teams', config);
    setTeams(teamRes.data);

    const matchRes = await axios.get('http://localhost:5275/api/Matches', config);
    setMatches(matchRes.data);

    calculateStandings(matchRes.data);
  } catch (err) {
    console.error("Veri alınırken hata:", err);
  }
};

  const calculateStandings = (matchList: Match[]) => {
  const table: { [teamId: number]: Standing } = {};

  matchList.forEach(match => {
    if (!match.team1 || !match.team2) return; // ⚠️ eksik maçları atla

    const team1Id = match.team1.id;
    const team2Id = match.team2.id;

    const team1Score = Math.floor(Math.random() * 4);
    const team2Score = Math.floor(Math.random() * 4);

    [team1Id, team2Id].forEach(teamId => {
      if (!table[teamId]) {
        const team = teamId === team1Id ? match.team1 : match.team2;
        table[teamId] = {
          teamId,
          teamName: team.name,
          played: 0,
          won: 0,
          draw: 0,
          lost: 0,
          points: 0,
        };
      }
    });

    table[team1Id].played += 1;
    table[team2Id].played += 1;

    if (team1Score > team2Score) {
      table[team1Id].won += 1;
      table[team2Id].lost += 1;
      table[team1Id].points += 3;
    } else if (team1Score < team2Score) {
      table[team2Id].won += 1;
      table[team1Id].lost += 1;
      table[team2Id].points += 3;
    } else {
      table[team1Id].draw += 1;
      table[team2Id].draw += 1;
      table[team1Id].points += 1;
      table[team2Id].points += 1;
    }
  });

  const sorted = Object.values(table).sort((a, b) => b.points - a.points);
  setStandings(sorted);
};


  

  useEffect(() => {
    fetchData();
  }, []);

  const handleTeamCreated = () => {
    fetchData();
  };

  return (
    <div className="turnuva-page">
      <h2>🏆 14-16 Yaş Gençler Turnuvası</h2>
      <p>📅 Turnuva 15 Temmuz'da başlıyor. Katılım ücretsiz. Finalde sürpriz ödüller sizi bekliyor!</p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className="info-btn" onClick={() => setShowModal(true)}>📩 Bilgi Al / Başvur</button>
        <button className="info-btn" onClick={() => setShowCreateTeamModal(true)}>🛡 Takım Oluştur</button>
        <button className="info-btn" onClick={() => setShowJoinTeamModal(true)}>👥 Takıma Katıl</button>
        {currentTeamId && (
  <button className="info-btn" onClick={() => setShowLeaveTeamModal(true)}>
    🚪 Takımdan Ayrıl
  </button>
)}

      </div>

      {/* TAKIMLAR */}
      <section>
        <h3>⚽ Katılan Takımlar</h3>
        <div className="team-grid">
          {teams.map((team: any) => (
            <div className="team-card" key={team.id}>
              <div className="team-icon">{team.name[0]}</div>
              <h4>{team.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* MAÇLAR */}
      <section>
        <h3>🗓️ Maç Programı</h3>
        <ul className="match-list">
          {matches.map(match => (
            <li key={match.id}>
              {match.matchDate.slice(0, 16).replace('T', ' ')} - {match.team1?.name} vs {match.team2?.name} @ {match.fieldName}
            </li>
          ))}
        </ul>
      </section>

      {/* Başvuru MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Bilgi Talep Formu</h3>
            <input type="text" placeholder="Ad Soyad" />
            <input type="email" placeholder="E-posta" />
            <textarea placeholder="Mesajınız..." rows={4}></textarea>
            <div className="modal-buttons">
              <button onClick={() => {
                alert('✅ Başvuru gönderildi!');
                setShowModal(false);
              }}>Gönder</button>
              <button onClick={() => setShowModal(false)}>İptal</button>
            </div>
          </div>
        </div>
      )}

      {/* Takım Oluşturma MODAL */}
      {showCreateTeamModal && playerId !== null && (
        <CreateTeamModal
          playerId={playerId}
          onClose={() => setShowCreateTeamModal(false)}
          onTeamCreated={handleTeamCreated}
        />
      )}
      {showJoinTeamModal && playerId !== null && (
        <JoinTeamModal
         playerId={playerId}
         currentTeamId={currentTeamId}
        onClose={() => setShowJoinTeamModal(false)}
        onTeamJoined={fetchData}
  />
)}
        {showLeaveTeamModal && playerId !== null && (
  <LeaveTeamModal
    playerId={playerId}
    onClose={() => setShowLeaveTeamModal(false)}
    onTeamLeft={fetchData}
  />
)}
<section>
  <h3>🏅 Puan Durumu</h3>
  <table className="standings-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Takım</th>
        <th>O</th>
        <th>G</th>
        <th>B</th>
        <th>M</th>
        <th>Puan</th>
      </tr>
    </thead>
    <tbody>
      {standings.map((team, index) => (
        <tr key={team.teamId}>
          <td>{index + 1}</td>
          <td>{team.teamName}</td>
          <td>{team.played}</td>
          <td>{team.won}</td>
          <td>{team.draw}</td>
          <td>{team.lost}</td>
          <td>{team.points}</td>
        </tr>
      ))}
    </tbody>
  </table>
</section>


    </div>
  );
};

export default TurnuvaPage;
