// src/components/modals/JoinTeamModal.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './ModalBase.css';

interface Team {
  id: number;
  name: string;
}

interface JoinTeamModalProps {
  playerId: number;
  currentTeamId: number | null;
  onClose: () => void;
  onTeamJoined: () => void;
}

const JoinTeamModal = ({ playerId, currentTeamId, onClose, onTeamJoined }: JoinTeamModalProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5275/api/Teams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data);
    };

    fetchTeams();
  }, []);

  const handleJoin = async (teamId: number) => {
    if (currentTeamId) {
      alert("⚠️ Zaten bir takımdasınız. Önce ayrılmalısınız.");
      return;
    }

    try {
      setJoining(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5275/api/TeamMembers',
        { playerId, teamId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Takıma başarıyla katıldınız!");
      onTeamJoined();
      onClose();
    } catch (error) {
      console.error("Katılma hatası:", error);
      alert("❌ Takıma katılamadınız.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Takıma Katıl</h3>
        <ul style={{ maxHeight: '250px', overflowY: 'auto', marginTop: '10px' }}>
          {teams.map((team) => (
            <li key={team.id} style={{ marginBottom: '10px' }}>
              {team.name}
              <button
                style={{ marginLeft: '10px' }}
                onClick={() => handleJoin(team.id)}
                disabled={joining}
              >
                Katıl
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} style={{ marginTop: '20px' }}>İptal</button>
      </div>
    </div>
  );
};

export default JoinTeamModal;
