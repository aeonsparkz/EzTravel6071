// AddMeetingForm.tsx

import React, { useState } from 'react';
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

  type mapOutputProps = {
    name: string | undefined;
    address: string | undefined;
  }

  const [mapOutput, setMapOutput] = useState<mapOutputProps[]>([]);
  const handleMapOutput = (props: mapOutputProps[]) => {
    setMapOutput(
      mapOutput.concat(props)
    )
  }

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
        <button type="button" onClick={() => setPopUp(true)}>Add Location</button>
        <Googlemaps trigger={popUp} setTrigger={setPopUp} extractData={handleMapOutput} />
      </div>
      {mapOutput.map((list, index) => (
        <div key={index} className="list_items">
          ______________________________________________________
          <p className="content">Name: {list.name}</p>
          <p className="content">Address: {list.address}</p>
        </div>
      ))}
      <button type="submit">Add Meeting</button>
    </form>
  );
};

export default AddMeetingForm;
