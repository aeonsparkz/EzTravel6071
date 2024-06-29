import React, { useState } from 'react';
import './styles/Modal.css';

interface Itinerary {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSubmit: (itinerary: Itinerary) => void;
  onDelete: () => void;
  itinerary: Itinerary;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onEditSubmit, onDelete, itinerary }) => {
  const [name, setName] = useState(itinerary.name);
  const [startDate, setStartDate] = useState(itinerary.start_date);
  const [endDate, setEndDate] = useState(itinerary.end_date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditSubmit({ ...itinerary, name, start_date: startDate, end_date: endDate });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Itinerary</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={onDelete} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
