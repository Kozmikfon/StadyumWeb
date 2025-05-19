import { useEffect, useState } from 'react';
import axios from 'axios';
import './player.css';
import { Link } from 'react-router-dom';

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  skillLevel: number;
  rating: number;
  teamName: string | null;
}

const PlayerList = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5275/api/Players', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlayers(res.data);
      } catch (err) {
        console.error('Oyuncular alınamadı:', err);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="players-container">
      <h2 className="players-title">Oyuncular</h2>
      <div className="players-grid">
        {players.map((player) => (
          <div className="player-card" key={player.id}>
            <h3>{player.firstName} {player.lastName}</h3>
            <p><strong>Pozisyon:</strong> {player.position}</p>
            <p><strong>Yetenek:</strong> {player.skillLevel}</p>
            <p><strong>Puan:</strong> {player.rating}</p>
            <p><strong>Takım:</strong> {player.teamName || 'Yok'}</p>
            <Link to={`/players/${player.id}`} className="detail-link">Detay</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
