// src/pages/Turnuva/TurnuvaPage.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import './TurnuvaPage.css';

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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      const teamRes = await axios.get('http://localhost:5275/api/Teams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(teamRes.data);

      const matchRes = await axios.get('http://localhost:5275/api/Matches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(matchRes.data);
    };

    fetchData();
  }, []);

  return (
    <div className="turnuva-page">
      <h2>🏆 14-16 Yaş Gençler Turnuvası</h2>
      <p>📅 Turnuva 15 Temmuz'da başlıyor. Katılım ücretsiz. Finalde sürpriz ödüller sizi bekliyor!</p>
      <button className="info-btn" onClick={() => setShowModal(true)}>📩 Bilgi Al / Başvur</button>

      {/* TAKIMLAR */}
      <section>
        <h3>⚽ Katılan Takımlar</h3>
        <ul className="team-list">
          {teams.map(team => (
            <li key={team.id}>{team.name}</li>
          ))}
        </ul>
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

      {/* MODAL */}
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
    </div>
  );
};

export default TurnuvaPage;
