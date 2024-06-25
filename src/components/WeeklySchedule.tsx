import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import './WeeklySchedule.css';
import Googlemaps from './Googlemaps';
import Calendar from './Calendar';

type Schedule = {
  id: string;
  user_id: string;
  date: string;
  time: string;
  task: string;
};

const WeeklySchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [task, setTask] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('Itinerary')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching schedules:', error);
      } else {
        setSchedules(data);
      }
    } else {
      setMessage('User not authenticated.');
    }
  };

  const addSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data, error } = await supabase
        .from('Itinerary')
        .insert([{ user_id: user.id, date, time, task }]);

      if (error) {
        console.error('Error adding schedule:', error);
      } else {
        setSchedules([...schedules, ...(data ?? [])]);
        setDate('');
        setTime('');
        setTask('');
        setMessage('Schedule added successfully.');
      }
    } else {
      setMessage('User not authenticated.');
    }
  };

  return (
    <>
    <div className='schedule-container'>
      <h1>Plan Your Weekly Schedule</h1>
      <form onSubmit={addSchedule}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Task:</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
        </div>
        <div>
          <button onClick={() => setPopUp(true)}>Add Location</button>
          <Googlemaps trigger={popUp} setTrigger={setPopUp} />
        </div>
        <button type="submit">Add Schedule</button>
      </form>
      <div>{message}</div>
      <div className='schedule-list'>
        <h2>Your Schedule</h2>
        {schedules.map((schedule) => (
          <div key={schedule.id}>
            <p>{schedule.date} - {schedule.time}: {schedule.task}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="calendar">
    <Calendar />
    </div>
    </>
  );
};

export default WeeklySchedule;
