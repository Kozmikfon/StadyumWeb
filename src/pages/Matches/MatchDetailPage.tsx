import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MatchDetailPage.css';

interface Team {
  id: number;
  name: string;
}

interface Player {
  id: number;
  firstName: string;
  lastName: string;
}

interface Match {
  id: number;
  fieldName: string;
  matchDate: string;
  team1: Team;
  team2: Team;
  acceptedPlayers?: Player[]; // Opsiyonel olarak tekliften gelen oyuncular
}

const MatchDetailPage: React.FC = () => {
  const { id } = useParams();
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`http://localhost:5275/api/Matches/${id}`);
        const matchData = response.data;

        // Kabul edilen oyuncuları eklemek istersen:
        const acceptedOffers = await axios.get(`http://localhost:5275/api/Offers/accepted-by-match/${id}`);
        matchData.acceptedPlayers = acceptedOffers.data.map((offer: any) => ({
          id: offer.receiverId,
          firstName: offer.receiverFirstName,
          lastName: offer.receiverLastName,
        }));

        setMatch(matchData);
      } catch (error) {
        console.error('Maç bilgisi alınamadı:', error);
      }
    };

    fetchMatch();
  }, [id]);

  if (!match) return <p className="match-loading">Yükleniyor...</p>;

  return (
    <div className="match-detail">
      <h2>Maç Detayı</h2>
      <p><strong>Saha:</strong> {match.fieldName}</p>
      <p><strong>Tarih:</strong> {new Date(match.matchDate).toLocaleString('tr-TR')}</p>
      <p><strong>Takım 1:</strong> {match.team1?.name}</p>
      <p><strong>Takım 2:</strong> {match.team2?.name}</p>

      {match.acceptedPlayers && (
        <>
          <h3>Katılan Oyuncular</h3>
          <ul>
            {match.acceptedPlayers.map((player) => (
              <li key={player.id}>
                {player.firstName} {player.lastName}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MatchDetailPage;
