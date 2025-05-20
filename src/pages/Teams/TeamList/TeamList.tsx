import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import './teams.css';

interface Player {
  id: number;
  firstName: string;
  lastName: string;
}

interface Team {
  id: number;
  name: string;
  captain?: Player;
  players: Player[];
}


const TeamList = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasRecentMatch, setHasRecentMatch] = useState(false);

  const [showCaptainModal, setShowCaptainModal] = useState(false);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  const [selectedCaptainId, setSelectedCaptainId] = useState<number | null>(null);
  const [teamIdForCaptainChange, setTeamIdForCaptainChange] = useState<number | null>(null);


useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded: any = jwtDecode(token);
      const userId = decoded?.userId;

      const playerRes = await axios.get(`http://localhost:5275/api/players/byUser/${userId}`);
      const fetchedPlayerId = playerRes.data.id;
      const fetchedTeamId = playerRes.data.teamId || null;
      setPlayerId(fetchedPlayerId);
      setCurrentTeamId(fetchedTeamId);

      const teamsRes = await axios.get('http://localhost:5275/api/Teams');
      setTeams(teamsRes.data);

      if (fetchedTeamId) {
        const matchCheck = await axios.get(
          `http://localhost:5275/api/Players/${fetchedPlayerId}/upcoming-matches`
        );

        if (matchCheck.data && matchCheck.data.length > 0) {
          setHasRecentMatch(true);
        }
      }
    } catch (error) {
      console.error("Veriler alınamadı:", error);
    }
  };

  fetchData();
}, []);


  const handleJoin = async (teamId: number) => {
    const token = localStorage.getItem('token');
    if (!token || playerId === null) return alert("Giriş yapılmalı.");

    if (currentTeamId) {
      const confirmSwitch = window.confirm("Zaten bir takıma aitsiniz. Başka bir takıma geçmek istediğinize emin misiniz?");
      if (!confirmSwitch) return;
    }

    try {
      await axios.post(
        'http://localhost:5275/api/TeamMembers',
        { teamId, playerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Takıma başarıyla katıldınız!");
      window.location.reload();
    } catch (error) {
      console.error("Katılamadı:", error);
      alert("Takıma katılamadınız.");
    }
  };

  const handleCreateTeam = async () => {
  if (!newTeamName.trim()) {
    alert("Takım adı boş olamaz.");
    return;
  }

  // 🔒 EK KONTROL BURAYA:
  if (currentTeamId) {
    alert("Zaten bir takıma aitsiniz. Önce ayrılmanız gerekir.");
    return;
  }

  if (hasRecentMatch) {
    alert("Takımınızın son 12 saatte maçı olduğu için yeni takım oluşturamazsınız.");
    return;
  }

  const token = localStorage.getItem('token');
  if (!token || playerId === null) {
    alert("Giriş yapılmalı.");
    return;
  }

  try {
    setLoading(true);
    const res = await axios.post(
      'http://localhost:5275/api/Teams',
      { name: newTeamName, captainId: playerId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("✅ Takım başarıyla oluşturuldu!");
    setTeams(prev => [...prev, res.data]); // Listeye ekle
    setNewTeamName('');
    setShowModal(false);
  } catch (err) {
    console.error("Takım oluşturulamadı:", err);
    alert("Bir hata oluştu.");
  } finally {
    setLoading(false);
  }
};
const handleLeaveTeam = async () => {
  const token = localStorage.getItem('token');
  if (!token || !playerId) {
    alert("🔒 Giriş yapılmamış veya oyuncu bilgisi eksik.");
    return;
  }

  const confirmLeave = window.confirm("Takımdan ayrılmak istediğinize emin misiniz?");
  if (!confirmLeave) return;

  try {
    await axios.delete(`http://localhost:5275/api/TeamMembers/leave/${playerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("✅ Takımdan başarıyla ayrıldınız!");
    window.location.reload();

  } catch (err: any) {
    // 👇 Kaptan kontrolü: "kaptan" kelimesi içeren hata
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      const message = err.response.data;

      if (message.toLowerCase().includes("kaptan")) {
        alert("⚠️ Kaptansınız ve ayrılmadan önce yeni bir kaptan seçmelisiniz.");

        // Eğer kaptansa ve takım datası hazırsa modalı tetikle
        const team = teams.find(t => t.id === currentTeamId);
        if (team) {
          const otherPlayers = team.players.filter(p => p.id !== playerId);
          setTeamPlayers(otherPlayers);
          setTeamIdForCaptainChange(team.id);
          setShowCaptainModal(true); // modal tetiklenir
        }

        return;
      }

      alert(`⚠️ ${message}`);
    } else {
      console.error("Ayrılma hatası:", err);
      alert("❌ Takımdan ayrılamadınız. Daha sonra tekrar deneyin.");
    }
  }
};

//kaptan atama
const assignNewCaptain = async () => {
  if (!selectedCaptainId || !teamIdForCaptainChange) {
    alert("Yeni kaptan seçilmedi.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5275/api/Teams/assign-captain`,
      {
        teamId: teamIdForCaptainChange,
        newCaptainId: selectedCaptainId
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("✅ Yeni kaptan atandı. Şimdi takımdan ayrılabilirsiniz.");
    setShowCaptainModal(false);

    // Ardından takımdan ayrılma işlemi
    await handleLeaveTeam();

  } catch (error) {
    console.error("Yeni kaptan atanamadı:", error);
    alert("❌ Yeni kaptan atanamadı.");
  }
};




  return (
  <div className="team-page">
    <h2>Takımlar</h2>

    <button
      className="create-team-btn"
      onClick={() => setShowModal(true)}
      disabled={!!currentTeamId || hasRecentMatch}
      title={
        hasRecentMatch
          ? "Takımınızın maçı olduğu için yeni takım oluşturamazsınız."
          : currentTeamId
          ? "Zaten bir takımdasınız. Önce ayrılmalısınız."
          : ""
      }
    >
      + Yeni Takım Oluştur
    </button>

    {(!!currentTeamId || hasRecentMatch) && (
      <p className="warning-msg">
        {hasRecentMatch
          ? "⛔ Takımınızın son 12 saatte maçı olduğu için yeni takım oluşturamazsınız."
          : "⚠️ Zaten bir takıma aitsiniz. Yeni takım kurmak için önce ayrılmalısınız."}
      </p>
    )}

    <div className="team-grid">
      {teams.map((team) => {
        const isPlayerInTeam = team.players.some(p => p.id === playerId);

        return (
          <div className="team-card" key={team.id}>
            <div className="team-icon">{team.name[0]}</div>
            <h3>{team.name}</h3>
            <p>🧑‍✈️ Kaptan: {team.captain?.firstName || 'Belirlenmemiş'}</p>
            <p>👥 Oyuncular: {team.players.length}</p>

            {isPlayerInTeam ? (
              <>
                <button className="joined-btn" disabled>Katıldınız</button>
                {team.id === currentTeamId && (
                  <button className="leave-btn" onClick={handleLeaveTeam}>Takımdan Ayrıl</button>
                )}
              </>
            ) : (
              <button className="join-btn" onClick={() => handleJoin(team.id)}>Takıma Katıl</button>
            )}

            <Link to={`/teams/${team.id}`} className="detail-link">Detay</Link>
          </div>
        );
      })}
    </div>

    {/* Takım Oluşturma Modalı */}
    {showModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Yeni Takım Oluştur</h3>
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Takım adı giriniz"
          />
          <div className="modal-buttons">
            <button onClick={handleCreateTeam} disabled={loading}>
              {loading ? "Oluşturuluyor..." : "Oluştur"}
            </button>
            <button onClick={() => setShowModal(false)}>İptal</button>
          </div>
        </div>
      </div>
    )}

    {/* Kaptan Seçme Modalı */}
    {showCaptainModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Yeni Kaptanı Seçin</h3>
          <select
            value={selectedCaptainId || ''}
            onChange={(e) => setSelectedCaptainId(Number(e.target.value))}
          >
            <option value="">Kaptan seçin</option>
            {teamPlayers.map(player => (
              <option key={player.id} value={player.id}>
                {player.firstName} {player.lastName}
              </option>
            ))}
          </select>
          <div className="modal-buttons">
            <button onClick={assignNewCaptain}>Onayla</button>
            <button onClick={() => setShowCaptainModal(false)}>İptal</button>
          </div>
        </div>
      </div>
    )}
  </div>
);


};

export default TeamList;
