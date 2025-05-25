import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface Team {
  id: number;
  name: string;
  captainId: number;
}

const TeamsAdminPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedCaptainId, setUpdatedCaptainId] = useState(0);

  const fetchTeams = () => {
    axios.get('/Teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error('Takımlar yüklenemedi:', err));
  };

  const deleteTeam = (id: number) => {
    if (!window.confirm('Bu takımı silmek istediğinizden emin misiniz?')) return;

    axios.delete(`/Teams/${id}`)
      .then(() => fetchTeams())
      .catch(err => console.error('Silme işlemi başarısız:', err));
  };

  const updateTeam = () => {
    if (!editingTeam) return;

    axios.put(`/Teams/${editingTeam.id}`, {
      name: updatedName,
      captainId: updatedCaptainId
    })
      .then(() => {
        fetchTeams();
        setEditingTeam(null);
      })
      .catch(err => console.error('Güncelleme başarısız:', err));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">🏆 Takımlar</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Kaptan ID</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.id}>
              <td>{team.id}</td>
              <td>{team.name}</td>
              <td>{team.captainId}</td>
              <td>
                <button className="edit-button" onClick={() => {
                  setEditingTeam(team);
                  setUpdatedName(team.name);
                  setUpdatedCaptainId(team.captainId);
                }}>🖊️ Düzenle</button>
                <button className="delete-button" onClick={() => deleteTeam(team.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTeam && (
        <div className="modal">
          <div className="modal-content">
            <h3>Takımı Düzenle</h3>
            <label>Ad:</label>
            <input type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
            <label>Kaptan ID:</label>
            <input type="number" value={updatedCaptainId} onChange={(e) => setUpdatedCaptainId(Number(e.target.value))} />
            <div className="modal-buttons">
              <button onClick={updateTeam}>Kaydet</button>
              <button onClick={() => setEditingTeam(null)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsAdminPage;