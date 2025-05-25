import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface TeamMember {
  id: number;
  playerId: number;
  teamId: number;
}

const TeamMembersAdminPage = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);

  const fetchTeamMembers = () => {
    axios.get('/TeamMembers')
      .then(res => setMembers(res.data))
      .catch(err => console.error('Üyeler yüklenemedi:', err));
  };

  const deleteMember = (id: number) => {
    if (!window.confirm('Bu üyeliği silmek istediğinizden emin misiniz?')) return;

    axios.delete(`/TeamMembers/${id}`)
      .then(() => fetchTeamMembers())
      .catch(err => console.error('Silme işlemi başarısız:', err));
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">👥 Takım Üyeleri</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Oyuncu ID</th>
            <th>Takım ID</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.playerId}</td>
              <td>{member.teamId}</td>
              <td>
                <button className="delete-button" onClick={() => deleteMember(member.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembersAdminPage;