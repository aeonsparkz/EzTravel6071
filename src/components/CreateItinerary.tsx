import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateItinerary.css';
import Navbar from './Navbar';
import supabase from '../supabaseClient';

const CreateItinerary: React.FC = () => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  const handleButtonClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name && startDate && endDate && userId) {
      try {
        const { data, error } = await supabase
          .from('Itinerary')
          .insert([{ user_id: userId, name, start_date: startDate, end_date: endDate }]);

        if (error) {
          throw error;
        }

        const startMonth = new Date(startDate).getMonth() + 1;
        const startYear = new Date(startDate).getFullYear();

        navigate(`/CalendarHandler?userId=${userId}&month=${startMonth}&year=${startYear}`, { state: { name, startDate, endDate } });
      } catch (error) {
        console.error('Error creating itinerary:', error);
        alert('Error creating itinerary');
      }
    } else {
      alert('Please fill in the required fields');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="tripinput">
        <div className="tripinput_container">
          <h1>KEY IN THE TITLE AND START/END DATES OF YOUR TRIP</h1>
          <form onSubmit={handleButtonClick}>
            <label>Title</label>
            <input
              type="text"
              id="trip-name"
              placeholder="Enter Title Of Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Start Date:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <label>End Date:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <button
              style={{
                backgroundColor: 'blue',
                color: 'white',
                borderRadius: '5px',
                margin: '10px',
                width: '120px',
                height: '25px'
              }}
              type="submit"
            >
              Start Planning!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateItinerary;
