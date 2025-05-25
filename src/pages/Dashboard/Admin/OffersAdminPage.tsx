import { useEffect, useState } from 'react';
import axios from '../../../api/axiosInstance';
import './adminPage.css';

interface Offer {
  id: number;
  senderId: number;
  receiverId: number;
  matchId: number;
  status: string;
}

const OffersAdminPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState('Pending');

  const fetchOffers = () => {
    axios.get('/Offers')
      .then(res => setOffers(res.data))
      .catch(err => console.error('Teklifler yüklenemedi:', err));
  };

  const deleteOffer = (id: number) => {
    if (!window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) return;

    axios.delete(`/Offers/${id}`)
      .then(() => fetchOffers())
      .catch(err => console.error('Silme işlemi başarısız:', err));
  };

  const updateOffer = () => {
    if (!editingOffer) return;

    axios.put(`/Offers/update-status/${editingOffer.id}`, { status: updatedStatus })
      .then(() => {
        fetchOffers();
        setEditingOffer(null);
      })
      .catch(err => console.error('Güncelleme başarısız:', err));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">📩 Teklifler</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Gönderen</th>
            <th>Alıcı</th>
            <th>Maç</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {offers.map(offer => (
            <tr key={offer.id}>
              <td>{offer.id}</td>
              <td>{offer.senderId}</td>
              <td>{offer.receiverId}</td>
              <td>{offer.matchId}</td>
              <td>{offer.status}</td>
              <td>
                <button className="edit-button" onClick={() => {
                  setEditingOffer(offer);
                  setUpdatedStatus(offer.status);
                }}>🖊️ Düzenle</button>
                <button className="delete-button" onClick={() => deleteOffer(offer.id)}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingOffer && (
        <div className="modal">
          <div className="modal-content">
            <h3>Teklif Durumu Güncelle</h3>
            <label>Durum:</label>
            <select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="modal-buttons">
              <button onClick={updateOffer}>Kaydet</button>
              <button onClick={() => setEditingOffer(null)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersAdminPage;
