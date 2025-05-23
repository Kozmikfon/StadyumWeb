import { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchList.css';
import { Link } from 'react-router-dom';

interface Match {
  id: number;
  fieldName: string;
  matchDate: string;
  team1Name: string;
  team2Name: string;
  team1Id: number;
  team2Id: number;
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

  const upcomingMatches = matches
    .filter(match => new Date(match.matchDate) > new Date())
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

  return (
    <div className="matches-container">
      <div className="matchlist-banner">
        <img src="/src/assets/resim.jpg" alt="Stadyum" className="matchlist-banner-image" />
      </div>

      <div className="matchlist-header">
        <h2 className="matches-title">🏟️ Yaklaşan Maçlar</h2>
        <Link to="/matches/create" className="create-match-button">
          ➕ Yeni Maç Oluştur
        </Link>
      </div>

      {upcomingMatches.length === 0 ? (
        <p className="no-matches-text">📭 Yaklaşan maç bulunamadı.</p>
      ) : (
        <div className="matches-grid">
          {upcomingMatches.map((match) => (
            <div key={match.id} className="match-card">
              <h3 className="match-title">
                <span className="team-name">{match.team1Name}</span>
                <span className="vs-text"> vs </span>
                <span className="team-name">{match.team2Name}</span>
              </h3>

              <p className="match-info"><strong>📍 Saha:</strong> {match.fieldName}</p>
              <p className="match-info"><strong>🗓️ Tarih:</strong> {new Date(match.matchDate).toLocaleString('tr-TR')}</p>

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
      )}
    </div>
  );
};

export default MatchList;
