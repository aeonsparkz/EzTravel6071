import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../supabaseClient';
import Calendar from './Calendar';
import Navbar from './Navbar';

interface Meeting {
  time: string;
  description: string;
}

const CalendarHandler: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<{ name: string, start_date: string, end_date: string } | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialMonth = parseInt(queryParams.get('month') || '') || new Date().getMonth() + 1;
  const initialYear = parseInt(queryParams.get('year') || '') || new Date().getFullYear();
  const userIdFromQuery = queryParams.get('userId');
  const state = location.state as { name: string, start_date: string, end_date: string };

  useEffect(() => {
    if (userIdFromQuery) {
      setUserId(userIdFromQuery);
    }
  }, [userIdFromQuery]);

  useEffect(() => {
    if (state) {
      setItinerary(state);
    }
  }, [state]);

  const [meetings, setMeetings] = useState<Record<string, Meeting[]>>({});

  useEffect(() => {
    const fetchMeetings = async () => {
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('Plans')
            .select('*')
            .eq('user_id', userId);

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
  }, [userId]);

  if (!userId || !itinerary) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="calendar-handler">
        <Calendar userId={userId} meetings={meetings} state={itinerary} />
      </div>
    </div>
  );
};

export default CalendarHandler;
