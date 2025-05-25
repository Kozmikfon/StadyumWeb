import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface Attendance {
  id: number;
  playerId: number;
  matchId: number;
  isPresent: boolean;
  checkedAt: string;
}

const AttendanceAdminPage = () => {
  const [records, setRecords] = useState<Attendance[]>([]);

  const fetchAttendance = () => {
    axios.get('/Attendance')
      .then(res => setRecords(res.data))
      .catch(err => console.error('Katılım verileri yüklenemedi:', err));
  };

  const deleteAttendance = (id: number) => {
    if (!window.confirm('Bu katılım kaydını silmek istediğinize emin misiniz?')) return;

    axios.delete(`/Attendance/${id}`)
      .then(() => fetchAttendance())
      .catch(err => console.error('Silme işlemi başarısız:', err));
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">📋 Katılım Kayıtları</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Oyuncu ID</th>
            <th>Maç ID</th>
            <th>Katıldı mı?</th>
            <th>Kontrol Zamanı</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {records.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.playerId}</td>
              <td>{a.matchId}</td>
              <td>{a.isPresent ? '✅ Evet' : '❌ Hayır'}</td>
              <td>{new Date(a.checkedAt).toLocaleString()}</td>
              <td>
                <button className="delete-button" onClick={() => deleteAttendance(a.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceAdminPage;