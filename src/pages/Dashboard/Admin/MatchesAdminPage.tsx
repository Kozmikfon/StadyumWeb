import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface Match {
  id: number;
  team1Name: string;
  team2Name: string;
  fieldName: string;
  matchDate: string;
}

const MatchesAdminPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [updatedFieldName, setUpdatedFieldName] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');

  const fetchMatches = () => {
    axios.get('/Matches')
      .then(res => setMatches(res.data))
      .catch(err => console.error('Maçlar yüklenemedi:', err));
  };

  const deleteMatch = (id: number) => {
    if (!window.confirm('Bu maçı silmek istediğinizden emin misiniz?')) return;

    axios.delete(`/Matches/${id}`)
      .then(() => fetchMatches())
      .catch(err => console.error('Silme işlemi başarısız:', err));
  };

  const updateMatch = () => {
    if (!editingMatch) return;

    axios.put(`/Matches/${editingMatch.id}`, {
      team1Id: 0, // Bu demo amaçlı, gerekirse formdan alınabilir
      team2Id: 0,
      fieldName: updatedFieldName,
      matchDate: updatedDate
    })
      .then(() => {
        fetchMatches();
        setEditingMatch(null);
      })
      .catch(err => console.error('Güncelleme başarısız:', err));
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">📅 Maçlar</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Takım 1</th>
            <th>Takım 2</th>
            <th>Saha</th>
            <th>Tarih</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => (
            <tr key={match.id}>
              <td>{match.id}</td>
              <td>{match.team1Name}</td>
              <td>{match.team2Name}</td>
              <td>{match.fieldName}</td>
              <td>{new Date(match.matchDate).toLocaleString()}</td>
              <td>
                <button className="edit-button" onClick={() => {
                  setEditingMatch(match);
                  setUpdatedFieldName(match.fieldName);
                  setUpdatedDate(match.matchDate);
                }}>🖊️ Düzenle</button>
                <button className="delete-button" onClick={() => deleteMatch(match.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingMatch && (
        <div className="modal">
          <div className="modal-content">
            <h3>Maçı Düzenle</h3>
            <label>Saha Adı:</label>
            <input type="text" value={updatedFieldName} onChange={(e) => setUpdatedFieldName(e.target.value)} />
            <label>Tarih:</label>
            <input type="datetime-local" value={updatedDate} onChange={(e) => setUpdatedDate(e.target.value)} />
            <div className="modal-buttons">
              <button onClick={updateMatch}>Kaydet</button>
              <button onClick={() => setEditingMatch(null)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesAdminPage;