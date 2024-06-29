import React, { useState, useEffect } from 'react';
import Googlemaps from './Googlemaps';
import "./styles/AddMeetingForm.css";

interface AddMeetingFormProps {
  userId: string;
  onAddMeeting: (date: string, time: string, description: string) => void;
  date?: string;
}

const AddMeetingForm: React.FC<AddMeetingFormProps> = ({ userId, onAddMeeting, date: initialDate }) => {
  const [date, setDate] = useState<string>(initialDate || '');
  const [time, setTime] = useState<string>('');
  const [placeName, setPlaceName] = useState<string>('');
  const [placeAddress, setPlaceAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullDescription = `${description} - Location: ${placeName}, ${placeAddress}`;
    onAddMeeting(date, time, fullDescription);
    setTime('');
    setPlaceName('');
    setPlaceAddress('');
    setDescription('');
  };

  type mapOutputProps = {
    name: string | undefined;
    address: string | undefined;
  }

  const handleMapOutput = (props: mapOutputProps[]) => {
    if (props.length > 0) {
      const { name, address } = props[0];
      setPlaceName(name || '');
      setPlaceAddress(address || '');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="add-meeting-form">
      <div className="planning">
        <div className="setDetails">
          <div className="setDetails_time">
            <label htmlFor="time">Input Time of Activity</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="setDetails_description">
            <label htmlFor="description">Description of Activity </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <label htmlFor="header">Name and Address of Location</label>
          <div>
            <button type="button" 
             style={{
              backgroundColor: 'blue',
              color: 'white',
              borderRadius: '5px',
              margin: '10px',
              width: '120px',
              height: '25px'
            }} onClick={() => setPopUp(true)}>Add Location</button>
            <Googlemaps trigger={popUp} setTrigger={setPopUp} extractData={handleMapOutput} />
          </div>
          <div className="setDetails_location">
            <label htmlFor="placeName">Location Name: </label>
            <p id="placeName">{placeName}</p>
            <label htmlFor="placeAddress">Location Address:</label>
            <p id="placeAddress">{placeAddress}</p>
          </div>
        </div>
      </div>
      <button style={{
        backgroundColor: 'blue',
        color: 'white',
        borderRadius: '5px',
        margin: '10px',
        width: '120px',
        height: '25px'
      }} type="submit">Add Activity</button>
    </form>
  );
}

export default AddMeetingForm;
