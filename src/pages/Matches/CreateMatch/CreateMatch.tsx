import { useEffect, useState } from 'react';
import axios from 'axios';
import './CreateMatch.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface Team {
  id: number;
  name: string;
}

const CreateMatch = () => {
  const [fieldName, setFieldName] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [team2Id, setTeam2Id] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [team1Id, setTeam1Id] = useState<number | null>(null);
  const [hasTeam, setHasTeam] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamInfo = async () => {
      const token = localStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      const userId = decoded.userId;

      try {
        const res = await axios.get(`http://localhost:5275/api/Players/byUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.teamId) {
          setTeam1Id(res.data.teamId);
          setHasTeam(true);
        } else {
          setHasTeam(false);
        }
      } catch (err) {
        console.error('Takım bilgisi alınamadı:', err);
        setHasTeam(false);
      }
    };

    const fetchTeams = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5275/api/Teams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data);
    };

    fetchTeamInfo();
    fetchTeams();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!team1Id || !team2Id || !fieldName || !matchDate || !matchTime) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    if (team1Id === team2Id) {
      alert('Kendi takımınızla eşleşemezsiniz.');
      return;
    }

    const isoDateTime = new Date(`${matchDate}T${matchTime}`).toISOString();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:5275/api/Matches',
        {
          team1Id,
          team2Id,
          fieldName,
          matchDate: isoDateTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('✅ Maç başarıyla oluşturuldu!');
      navigate('/matches');
    } catch (err) {
      console.error('Maç oluşturulamadı:', err);
      alert('❌ Maç oluşturulamadı!');
    }
  };

  return (
    <div className="create-match-container">
      <div className="form-box">
        <h2>⚽ Yeni Maç Oluştur</h2>

        {!hasTeam ? (
          <p style={{ color: 'red' }}>
            ⚠️ Maç oluşturmak için bir takıma katılmanız gerekiyor.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="match-form">
            <label>Saha Adı</label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              required
            />

            <label>Tarih</label>
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              required
            />

            <label>Saat</label>
            <input
              type="time"
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              required
            />

            <label>Rakip Takım</label>
            <select
              value={team2Id || ''}
              onChange={(e) => setTeam2Id(parseInt(e.target.value))}
              required
            >
              <option value="">Takım Seçin</option>
              {teams.map((team) =>
                team.id !== team1Id ? (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ) : null
              )}
            </select>

            <button type="submit" className="create-btn">
              ➕ Maçı Oluştur
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateMatch;
