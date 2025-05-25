import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface Team {
  id: number;
  name: string;
  isInTournament: boolean;
}

const TournamentAdminPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    try {
      const res = await axios.get('/Teams');
      setTeams(res.data);
    } catch (error) {
      console.error('Takımlar yüklenemedi:', error);
    }
  };

  const toggleTournamentStatus = async (id: number, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus
        ? `/Teams/remove-from-tournament/${id}`
        : `/Teams/add-to-tournament/${id}`;
      await axios.put(endpoint);
      fetchTeams();
    } catch (error) {
      console.error('Turnuva durumu değiştirilemedi:', error);
    }
  };

  const deleteTeam = async (id: number) => {
    if (!window.confirm('Bu takımı tamamen silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`/Teams/${id}`);
      fetchTeams();
    } catch (error) {
      console.error('Takım silinemedi:', error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">🏟️ Turnuva Yönetimi</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Takım Adı</th>
            <th>Turnuva Durumu</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.id}>
              <td>{team.id}</td>
              <td>{team.name}</td>
              <td>{team.isInTournament ? '✅ Katılıyor' : '❌ Katılmıyor'}</td>
              <td>
                <button
                  className={team.isInTournament ? 'delete-button' : 'edit-button'}
                  onClick={() => toggleTournamentStatus(team.id, team.isInTournament)}
                >
                  {team.isInTournament ? '🚫 Çıkar' : '➕ Ekle'}
                </button>
                <button className="delete-button" onClick={() => deleteTeam(team.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentAdminPage;
