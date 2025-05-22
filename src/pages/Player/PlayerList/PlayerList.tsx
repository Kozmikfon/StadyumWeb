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
  <h2 className="players-title">🏅 Oyuncular (Puan Sıralı)</h2>
  <table className="player-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Oyuncu</th>
        <th>Pozisyon</th>
        <th>Yetenek</th>
        <th>Puan</th>
        <th>Takım</th>
        <th>İşlem</th>
      </tr>
    </thead>
    <tbody>
      {players
        .sort((a, b) => b.rating - a.rating) // Yüksekten düşüğe sıralama
        .map((player, index) => (
          <tr key={player.id}>
            <td>{index + 1}</td>
            <td>{player.firstName} {player.lastName}</td>
            <td>{player.position}</td>
            <td>{player.skillLevel}</td>
            <td>{player.rating}</td>
            <td>{player.teamName || 'Yok'}</td>
            <td>
              <Link to={`/players/${player.id}`} className="table-btn">Detay</Link>
              <Link to={`/send-offer/${player.id}`} className="table-btn-green">➕ Teklif</Link>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

  );
};

export default PlayerList;
