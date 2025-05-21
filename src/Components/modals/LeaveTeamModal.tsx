import axios from 'axios';
import './ModalBase.css';

interface LeaveTeamModalProps {
  playerId: number;
  onClose: () => void;
  onTeamLeft: () => void;
}

const LeaveTeamModal = ({ playerId, onClose, onTeamLeft }: LeaveTeamModalProps) => {
  const handleLeave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5275/api/TeamMembers/leave/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Takımdan başarıyla ayrıldınız.");
      onTeamLeft();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.toLowerCase().includes("kaptan")) {
        alert("⚠️ Kaptan olduğunuz için önce yeni bir kaptan seçmelisiniz.");
      } else {
        console.error("Ayrılma hatası:", err);
        alert("❌ Takımdan ayrılamadınız.");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Takımdan Ayrıl</h3>
        <p>Bu takımdan ayrılmak istediğinize emin misiniz?</p>
        <div className="modal-buttons">
          <button onClick={handleLeave}>🚪 Ayrıl</button>
          <button onClick={onClose}>İptal</button>
        </div>
      </div>
    </div>
  );
};

export default LeaveTeamModal;
