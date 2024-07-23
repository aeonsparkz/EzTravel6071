import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../supabaseClient';
import Calendar from './Calendar';
import Navbar from './Navbar';
import "./styles/CalendarHandler.css"

interface Meeting {
  time: string;
  description: string;
}

const CalendarHandler: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<{ id: string, name: string, start_date: string, end_date: string, startMonth: number, startYear: number } | null>(null);
  const location = useLocation();
  const state = location.state as { id: string, name: string, start_date: string, end_date: string, startMonth: number, startYear: number };

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
    if (state) {
      setItinerary(state);
    }
  }, [state]);

  const [meetings, setMeetings] = useState<Record<string, Meeting[]>>({});

  useEffect(() => {
    const fetchMeetings = async () => {
      if (itinerary) {
        try {
          const { data, error } = await supabase
            .from('Plans')
            .select('*')
            .eq('itinerary_id', itinerary.id);
  
          if (error) {
            throw error;
          }
  
          const fetchedMeetings = data.reduce((acc: Record<string, Meeting[]>, meeting) => {
            const date = meeting.date;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push({ time: meeting.time, description: meeting.description });
            return acc;
          }, {});
          setMeetings(fetchedMeetings);
        } catch (error) {
          console.error('Error fetching meetings:', error);
        }
      }
    };
  
    fetchMeetings();
  }, [itinerary]);

  if (!userId || !itinerary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="calendar-handler_background">
      <Navbar />
      <div className="calendar-handler">
        <Calendar userId={userId} meetings={meetings} state={itinerary} />
      </div>
    </div>
  );
};

export default CalendarHandler;
