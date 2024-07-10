import React, { useState } from "react";
import Modal from "./Modal";
import "./styles/EditItinerary.css";

interface Itinerary {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
}

interface EditItineraryProps {
    isOpen: boolean;
    onClose: () => void;
    onEditSubmit: (itinerary: Itinerary) => void;
    onDelete: () => void;
    itinerary: Itinerary;
}

const EditItinerary: React.FC<EditItineraryProps> = ({ isOpen, onClose, onEditSubmit, onDelete, itinerary }) => {
    const [name, setName] = useState(itinerary.name);
    const [startDate, setStartDate] = useState(itinerary.start_date);
    const [endDate, setEndDate] = useState(itinerary.end_date);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (new Date(startDate) >= new Date(endDate)) {
            setError("Start date must be before end date");
            return;
        }
        onEditSubmit({ ...itinerary, name, start_date: startDate, end_date: endDate });
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <h2>Edit Itinerary</h2>
                {error && <p className="error">{error}</p>}
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
        </Modal>
    );
};

export default EditItinerary;
