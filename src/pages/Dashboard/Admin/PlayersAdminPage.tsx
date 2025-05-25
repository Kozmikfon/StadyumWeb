import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  skillLevel: number;
  rating: number;
  teamName: string;
}

const PlayersAdminPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [updatedPosition, setUpdatedPosition] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedSkill, setUpdatedSkill] = useState(0);
  const [updatedRating, setUpdatedRating] = useState(0);

  const fetchPlayers = () => {
    axios.get('/Players')
      .then(res => setPlayers(res.data))
      .catch(err => console.error('Oyuncular yüklenemedi:', err));
  };

  const deletePlayer = (id: number) => {
    if (!window.confirm('Bu oyuncuyu silmek istediğinizden emin misiniz?')) return;

    axios.delete(`/Players/${id}`)
      .then(() => fetchPlayers())
      .catch(err => console.error('Silme işlemi başarısız:', err));
  };

  const updatePlayer = () => {
    if (!editingPlayer) return;

    axios.put(`/Players/${editingPlayer.id}`, {
      email: updatedEmail,
      position: updatedPosition,
    })
      .then(() => {
        fetchPlayers();
        setEditingPlayer(null);
      })
      .catch(err => console.error('Güncelleme başarısız:', err));
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">🎽 Oyuncular</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Email</th>
            <th>Pozisyon</th>
            <th>Seviye</th>
            <th>Puan</th>
            <th>Takım</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.firstName}</td>
              <td>{player.lastName}</td>
              <td>{player.email}</td>
              <td>{player.position}</td>
              <td>{player.skillLevel}</td>
              <td>{player.rating}</td>
              <td>{player.teamName || 'Yok'}</td>
              <td>
                <button className="edit-button" onClick={() => {
                  setEditingPlayer(player);
                  setUpdatedPosition(player.position);
                  setUpdatedEmail(player.email);
                  setUpdatedSkill(player.skillLevel);
                  setUpdatedRating(player.rating);
                }}>🖊️ Düzenle</button>
                <button className="delete-button" onClick={() => deletePlayer(player.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPlayer && (
        <div className="modal">
          <div className="modal-content">
            <h3>Oyuncu Düzenle</h3>
            <label>Email:</label>
            <input type="email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} />
            <label>Pozisyon:</label>
            <input type="text" value={updatedPosition} onChange={(e) => setUpdatedPosition(e.target.value)} />
            <label>Yetenek Seviyesi:</label>
            <input type="number" value={updatedSkill} onChange={(e) => setUpdatedSkill(parseInt(e.target.value))} />
            <label>Puan:</label>
            <input type="number" value={updatedRating} onChange={(e) => setUpdatedRating(parseInt(e.target.value))} />

            <div className="modal-buttons">
              <button onClick={updatePlayer}>Kaydet</button>
              <button onClick={() => setEditingPlayer(null)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersAdminPage;
