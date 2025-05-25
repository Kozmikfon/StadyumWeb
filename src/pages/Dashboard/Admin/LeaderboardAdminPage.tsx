import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface LeaderboardPlayer {
  id: number;
  fullName: string;
  rating: number;
  matchCount: number;
}

interface LeaderboardTeam {
  id: number;
  name: string;
  matchCount: number;
}

const LeaderboardAdminPage = () => {
  const [topPlayers, setTopPlayers] = useState<LeaderboardPlayer[]>([]);
  const [topMatchPlayers, setTopMatchPlayers] = useState<LeaderboardPlayer[]>([]);
  const [topTeams, setTopTeams] = useState<LeaderboardTeam[]>([]);

  useEffect(() => {
    axios.get('/Leaderboard/top-players').then(res => setTopPlayers(res.data));
    axios.get('/Leaderboard/top-match-players').then(res => setTopMatchPlayers(res.data));
    axios.get('/Leaderboard/top-teams').then(res => setTopTeams(res.data));
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">🏆 Liderlik Tabloları</h2>

      <section>
        <h3>En Yüksek Puanlı Oyuncular</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad Soyad</th>
              <th>Puan</th>
              <th>Maç Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map(player => (
              <tr key={player.id}>
                <td>{player.id}</td>
                <td>{player.fullName}</td>
                <td>{player.rating}</td>
                <td>{player.matchCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>En Çok Maç Yapan Oyuncular</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad Soyad</th>
              <th>Puan</th>
              <th>Maç Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {topMatchPlayers.map(player => (
              <tr key={player.id}>
                <td>{player.id}</td>
                <td>{player.fullName}</td>
                <td>{player.rating}</td>
                <td>{player.matchCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>En Çok Maç Yapan Takımlar</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Takım Adı</th>
              <th>Maç Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {topTeams.map(team => (
              <tr key={team.id}>
                <td>{team.id}</td>
                <td>{team.name}</td>
                <td>{team.matchCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default LeaderboardAdminPage;
