// src/pages/Turnuva/TurnuvaPage.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import './TurnuvaPage.css';
import CreateTeamModal from '../../Components/modals/CreateTeamModal'; // yolunu kendi dizinine göre ayarla
import JoinTeamModal from '../../Components/modals/JoinTeamModal';

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

const TurnuvaPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [showJoinTeamModal, setShowJoinTeamModal] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const playerRes = await axios.get('http://localhost:5275/api/players/byUser/me', config);
      setPlayerId(playerRes.data.id);
      setCurrentTeamId(playerRes.data.teamId || null);

      const teamRes = await axios.get('http://localhost:5275/api/Teams', config);
      setTeams(teamRes.data);

      const matchRes = await axios.get('http://localhost:5275/api/Matches', config);
      setMatches(matchRes.data);
    } catch (err) {
      console.error("Veri alınırken hata:", err);
    }
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

    </div>
  );
};

export default TurnuvaPage;
