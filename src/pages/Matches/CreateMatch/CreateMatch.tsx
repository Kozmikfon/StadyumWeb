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
      <h2>Yeni Maç Oluştur</h2>
      <form onSubmit={handleSubmit} className="match-form">
        <label>Saha Adı</label>
        <input
          type="text"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
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
        <select onChange={(e) => setTeam2Id(Number(e.target.value))} required>
          <option value="">Takım Seç</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <button type="submit">Oluştur</button>
      </form>
    </div>
  );
};

export default CreateMatch;
