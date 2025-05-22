import { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchList.css';
import { Link } from 'react-router-dom';

interface Team {
  id: number;
  name: string;
}

interface Match {
  id: number;
  fieldName: string;
  matchDate: string;
  team1: Team;
  team2: Team;
}

const MatchList = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://localhost:5275/api/Matches');
        setMatches(res.data);
      } catch (err) {
        console.error('Maçlar alınamadı:', err);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="matches-container">
      <div className="matchlist-header">
        <h2 className="matches-title">🏟️ Maç Listesi</h2>
        <Link to="/matches/create" className="create-match-button">
          ➕ Yeni Maç Oluştur
        </Link>
      </div>

      <div className="matches-grid">
        {matches
          .filter(match => new Date(match.matchDate) > new Date())
          .map((match) => (
            <div key={match.id} className="match-card">
              <h3 className="match-title">{match.team1?.name} vs {match.team2?.name}</h3>
              <p className="match-info"><strong>Saha:</strong> {match.fieldName}</p>
              <p className="match-info"><strong>Tarih:</strong> {new Date(match.matchDate).toLocaleString('tr-TR')}</p>

              <div className="match-actions">
                <Link to={`/matches/${match.id}`} className="btn-outline">
                  Detay
                </Link>

                <Link to={`/send-offer?matchId=${match.id}`}>
                  <button className="btn-blue">🎯 Teklif Gönder</button>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MatchList;
