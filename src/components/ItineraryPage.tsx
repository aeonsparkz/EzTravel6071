import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Navbar from './Navbar';
import { DateTime, Interval } from 'luxon';
import './ItineraryPage.css'; // Make sure to import the CSS file

interface Meeting {
  time: string;
  description: string;
}

interface Itinerary {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

const ItineraryPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Record<string, Meeting[]>>({});
  const location = useLocation();
  const itinerary = location.state as Itinerary;
  const navigate = useNavigate(); // Add useNavigate hook

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

  const daysInRange = Interval.fromDateTimes(
    DateTime.fromISO(itinerary.start_date),
    DateTime.fromISO(itinerary.end_date).plus({ days: 1 })
  )
    .splitBy({ day: 1 })
    .map((day) => day.start?.toISODate() || '');

  const handleEditClick = () => {
    const startMonth = new Date(itinerary.start_date).getMonth() + 1; // Months are zero-based
    const startYear = new Date(itinerary.start_date).getFullYear();
    navigate(`/CalendarHandler?month=${startMonth}&year=${startYear}`, {
      state: { id: itinerary.id, name: itinerary.name, start_date: itinerary.start_date, end_date: itinerary.end_date }
    });
  };

  return (
    <div>
      <Navbar />
      <div className="itinerary-page">
        <h1>{itinerary.name}</h1>
        <p>{itinerary.start_date} to {itinerary.end_date}</p>
        <div className="meetings-list">
          {daysInRange.map((date) => (
            <div key={date} className="day-meetings">
              <h2>{DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)}</h2>
              <ul>
                {meetings[date]?.map((meeting: Meeting, index: number) => (
                  <li key={index}>
                    {meeting.time} - {meeting.description}
                  </li>
                )) || <li>No activities planned.</li>}
              </ul>
            </div>
          ))}
        </div>
        <button onClick={handleEditClick} className="edit-itinerary-button">
          Edit Itinerary
        </button>
      </div>
    </div>
  );
};

export default ItineraryPage;
