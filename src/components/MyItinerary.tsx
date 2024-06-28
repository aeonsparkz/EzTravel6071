import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyItinerary.css";
import Navbar from "./Navbar";
import supabase from "../supabaseClient";

type Itinerary = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
};

const MyItinerary: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type CardProps = {
  itinerary: Itinerary;
  onClick: () => void;
};

const Card: React.FC<CardProps> = ({ itinerary, onClick }) => {
  return (
    <div className="card-container">
      <div className="card" onClick={onClick}>
        <h2>{itinerary.name}</h2>
        <p>{itinerary.start_date} - {itinerary.end_date}</p>
      </div>
    </div>
  );
};

export default MyItinerary;
