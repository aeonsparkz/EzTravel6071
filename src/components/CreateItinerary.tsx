import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import supabase from '../supabaseClient';
import Navbar from './Navbar';
import './styles/CreateItinerary.css';

interface Itinerary {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
}

const CreateItinerary: React.FC = () => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!userId) {
        throw new Error('User not logged in');
      }

      if (new Date(startDate) >= new Date(endDate)) {
        setError('Start date must be before end date');
        return;
      }

      const insertResponse: PostgrestSingleResponse<Itinerary> = await supabase
        .from('Itinerary')
        .insert([{ user_id: userId, name, start_date: startDate, end_date: endDate }])
        .select('*')
        .single();

      console.log('Supabase insert response:', insertResponse);

      if (insertResponse.error) {
        throw insertResponse.error;
      }

      if (!insertResponse.data) {
        throw new Error('No data returned from Supabase');
      }

      const itineraryData = insertResponse.data;
      const startMonth = new Date(itineraryData.start_date).getMonth() + 1;
      const startYear = new Date(itineraryData.start_date).getFullYear();

      navigate(`/CalendarHandler?month=${startMonth}&year=${startYear}`, {
        state: { 
          id: itineraryData.id, 
          name: itineraryData.name, 
          start_date: itineraryData.start_date, 
          end_date: itineraryData.end_date,
          startMonth: startMonth,
          startYear: startYear
        }
      });
    } catch (error) {
      console.error('Error creating itinerary:', error);
      setError((error as Error).message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="tripinput">
        <div className="tripinput_container">
          <h1>Create New Itinerary</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <label>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Start Date:
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </label>
            <label>
              End Date:
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </label>
            <button type="submit">Create Itinerary</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateItinerary;
