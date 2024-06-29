import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/MyItinerary.css";
import Navbar from "./Navbar";
import supabase from "../supabaseClient";
import Modal from './Modal';

type Itinerary = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
};

const MyItinerary: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        console.error('User not logged in');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchItineraries = async () => {
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('Itinerary')
            .select('*')
            .eq('user_id', userId);
  
          if (error) {
            throw error;
          }
  
          setItineraries(data);
        } catch (error) {
          console.error('Error fetching itineraries:', error);
        }
      }
    };
  
    fetchItineraries();
  }, [userId]);
  
  const handleCardClick = (itinerary: Itinerary) => {
    navigate(`/ItineraryPage`, { state: itinerary });
  };

  const handleOptionsClick = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (updatedItinerary: Itinerary) => {
    try {
      const { data, error } = await supabase
        .from('Itinerary')
        .update(updatedItinerary)
        .eq('id', updatedItinerary.id);
  
      if (error) {
        throw error;
      }
  
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary.id === updatedItinerary.id ? updatedItinerary : itinerary
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating itinerary:', error);
    }
  };

  const handleDelete = async (itineraryId: string) => {
    try {
      const { error: plansError } = await supabase
        .from('Plans')
        .delete()
        .eq('itinerary_id', itineraryId);

      if (plansError) {
        throw plansError;
      }

      const { error: itineraryError } = await supabase
        .from('Itinerary')
        .delete()
        .eq('id', itineraryId);

      if (itineraryError) {
        throw itineraryError;
      }

      setItineraries((prevItineraries) =>
        prevItineraries.filter((itinerary) => itinerary.id !== itineraryId)
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="itinerary_background">
        <div className="setItinerary">
          <h1>My Itineraries</h1>
          <div className="card_container">
            {itineraries.map((itinerary) => (
              <Card
                key={itinerary.id}
                itinerary={itinerary}
                onClick={() => handleCardClick(itinerary)}
                onOptionsClick={() => handleOptionsClick(itinerary)}
              />
            ))}
          </div>
        </div>
      </div>
      {selectedItinerary && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEditSubmit={handleEditSubmit}
          onDelete={() => handleDelete(selectedItinerary.id)}
          itinerary={selectedItinerary}
        />
      )}
    </div>
  );
};

type CardProps = {
  itinerary: Itinerary;
  onClick: () => void;
  onOptionsClick: () => void;
};

const Card: React.FC<CardProps> = ({ itinerary, onClick, onOptionsClick }) => {
  return (
    <div className="card-container">
      <div className="card" onClick={onClick}>
        <h2>{itinerary.name}</h2>
        <p>{itinerary.start_date} - {itinerary.end_date}</p>
        <button onClick={(e) => { e.stopPropagation(); onOptionsClick(); }} className="options-button">
          &#8942;
        </button>
      </div>
    </div>
  );
};

export default MyItinerary;
