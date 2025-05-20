import { useEffect, useState } from 'react';
import axios from 'axios';
import './CreateMatch.css';
import { useNavigate } from 'react-router-dom';
import {jwtDecode } from 'jwt-decode';

interface Team {
  id: number;
  name: string;
}

const CreateMatch = () => {
  const [fieldName, setFieldName] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [team2Id, setTeam2Id] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5275/api/Teams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeams(res.data);
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const decoded: any = jwtDecode(token || '');
    const team1Id = decoded.teamId;

    try {
      await axios.post(
        'http://localhost:5275/api/Matches',
        { fieldName, matchDate, team1Id, team2Id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/matches');
    } catch (err) {
      console.error('Maç oluşturulamadı:', err);
    }
  };

  return (
  <div className="create-match-container">
    <div className="form-box">
      <h2>⚽ Yeni Maç Oluştur</h2>
      <p>Lütfen saha adını, tarihini ve rakip takımı seçin.</p>
      <form onSubmit={handleSubmit} className="match-form">
        <label>Saha Adı</label>
        <input
          type="text"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          placeholder="Örn: Çamlık Halı Saha"
          required
        />

        <label>Maç Tarihi</label>
        <input
          type="datetime-local"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
          required
        />

        <label>Rakip Takım</label>
        <select
          onChange={(e) => setTeam2Id(Number(e.target.value))}
          required
          defaultValue=""
        >
          <option value="" disabled>Takım Seç</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <button type="submit" className="create-btn">Maçı Oluştur</button>
      </form>
    </div>
  </div>
);

};

export default CreateMatch;
