import { useEffect, useState } from 'react';
import axios from 'axios';
import './ModalBase.css';

interface Team {
  id: number;
  name: string;
}

interface TournamentMatchModalProps {
  onClose: () => void;
  onMatchCreated: () => void;
}

const TournamentMatchModal = ({ onClose, onMatchCreated }: TournamentMatchModalProps) => {
  const [fieldName, setFieldName] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [team1Id, setTeam1Id] = useState<number | null>(null);
  const [team2Id, setTeam2Id] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5275/api/Teams/tournament-teams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data);
    };

    fetchTeams();
  }, []);

  const handleCreateMatch = async () => {
    if (!fieldName || !matchDate || !team1Id || !team2Id) {
      alert('❗ Tüm alanlar doldurulmalı.');
      return;
    }
    if (team1Id === team2Id) {
      alert('⚠️ Aynı takımlar birbiriyle eşleşemez.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
     await axios.post(
  'http://localhost:5275/api/Matches/create-tournament-match',
  { fieldName, matchDate, team1Id, team2Id },
  { headers: { Authorization: `Bearer ${token}` } }
);

      alert('✅ Maç başarıyla oluşturuldu!');
      onMatchCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('❌ Maç oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>🏟️ Turnuva Maçı Oluştur</h3>
        <input
          type="text"
          placeholder="Saha Adı"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
        />
        <input
          type="datetime-local"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
        />

        <select value={team1Id ?? ''} onChange={(e) => setTeam1Id(Number(e.target.value))}>
          <option value="">Takım 1 Seç</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>

        <select value={team2Id ?? ''} onChange={(e) => setTeam2Id(Number(e.target.value))}>
          <option value="">Takım 2 Seç</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>

        <div className="modal-buttons">
          <button onClick={handleCreateMatch} disabled={loading}>
            {loading ? 'Oluşturuluyor...' : 'Oluştur'}
          </button>
          <button onClick={onClose}>İptal</button>
        </div>
      </div>
    </div>
  );
};

export default TournamentMatchModal;
