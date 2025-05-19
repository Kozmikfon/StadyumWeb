import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PlayerDetailPage.css';

interface Team {
  name: string;
}

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  skillLevel: string;
  team?: Team;
}

const PlayerDetailPage: React.FC = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await axios.get(`http://localhost:5275/api/Players/${id}`);
        setPlayer(response.data);
      } catch (error) {
        console.error('Oyuncu verisi alınamadı:', error);
      }
    };

    fetchPlayer();
  }, [id]);

  if (!player) return <p>Yükleniyor...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {player.firstName} {player.lastName}
      </h2>
      <p><strong>Email:</strong> {player.email}</p>
      <p><strong>Pozisyon:</strong> {player.position}</p>
      <p><strong>Seviye:</strong> {player.skillLevel}</p>
      <p><strong>Takım:</strong> {player.team?.name || 'Yok'}</p>
    </div>
  );
};

export default PlayerDetailPage;
