import React, { useState, useEffect} from 'react';
import Googlemaps from './Googlemaps';

interface AddMeetingFormProps {
  userId: string;
  onAddMeeting: (date: string, time: string, description: string) => void;
}


const AddMeetingForm: React.FC<AddMeetingFormProps> = ({ userId, onAddMeeting }) => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [popUp, setPopUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMeeting(date, time, description);
    setDate('');
    setTime('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-meeting-form">
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
          <button onClick={() => setPopUp(true)}>Add Location</button>
          <Googlemaps trigger={popUp} setTrigger={setPopUp} />
        </div>
      <button type="submit">Add Meeting</button>
    </form>
  );
};

export default AddMeetingForm;
