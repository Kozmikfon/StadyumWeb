// src/components/modals/CreateTeamModal.tsx

import { useState } from 'react';
import axios from 'axios';
import './ModalBase.css';

interface CreateTeamModalProps {
  playerId: number;
  onClose: () => void;
  onTeamCreated: () => void;
}

const CreateTeamModal = ({ playerId, onClose, onTeamCreated }: CreateTeamModalProps) => {
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!teamName.trim()) {
      alert('Takım adı boş olamaz.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
  'http://localhost:5275/api/Teams/create-tournament-team',
  { name: teamName, captainId: playerId },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


      alert('✅ Takım başarıyla oluşturuldu!');
      setTeamName('');
      onTeamCreated(); // Ana sayfada listeyi güncelle
      onClose(); // Modalı kapat
    } catch (err) {
      console.error(err);
      alert('❌ Takım oluşturulamadı!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>🛡 Takım Oluştur</h3>
        <input
          type="text"
          placeholder="Takım adı giriniz"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleCreate} disabled={loading}>
            {loading ? 'Oluşturuluyor...' : 'Oluştur'}
          </button>
          <button onClick={onClose}>İptal</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
