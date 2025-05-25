import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface User {
  id: number;
  email: string;
  role: string;
}

const UsersAdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedRole, setUpdatedRole] = useState('User');

  const fetchUsers = () => {
    axios.get('/Users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Kullanıcılar yüklenemedi:', err));
  };

  const deleteUser = (id: number) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    axios.delete(`/Users/${id}`)
      .then(() => fetchUsers())
      .catch(err => console.error('Silme işlemi başarısız:', err));
  };

  const updateUser = () => {
    if (!editingUser) return;

    axios.put(`/Users/${editingUser.id}`, {
      ...editingUser,
      email: updatedEmail,
      role: updatedRole,
    })
      .then(() => {
        fetchUsers();
        setEditingUser(null);
      })
      .catch(err => console.error('Güncelleme başarısız:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">👤 Kullanıcılar</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Rol</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="edit-button" onClick={() => {
                  setEditingUser(user);
                  setUpdatedEmail(user.email);
                  setUpdatedRole(user.role);
                }}>🖊️ Düzenle</button>
                <button className="delete-button" onClick={() => deleteUser(user.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Kullanıcıyı Düzenle</h3>
            <label>Email:</label>
            <input type="email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} />
            <label>Rol:</label>
            <select value={updatedRole} onChange={(e) => setUpdatedRole(e.target.value)}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="modal-buttons">
              <button onClick={updateUser}>Kaydet</button>
              <button onClick={() => setEditingUser(null)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdminPage;