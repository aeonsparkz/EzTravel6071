// AddMeetingForm.tsx

import React, { useState } from 'react';
import Googlemaps from './Googlemaps';
import "./AddMeetingForm.css";
import ExpenditureTracker from "./ExpenditureTracker";

interface AddMeetingFormProps {
  userId: string;
  onAddMeeting: (date: string, time: string, description: string) => void;
}

const AddMeetingForm: React.FC<AddMeetingFormProps> = ({ userId, onAddMeeting }) => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [placeName, setPlaceName] = useState<string>('');
  const [placeAddress, setPlaceAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [popUp, setPopUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMeeting(date, time, placeName);
    setDate('');
    setTime('');
    setPlaceName('');
    setPlaceAddress('');
    setDescription('');
  };

  type mapOutputProps = {
    name: string | undefined
    address: string | undefined
  }

  const handleDescription = (string1: string | undefined, string2: string | undefined) => {
    if (string1 !== undefined && string2 !== undefined) {
      setPlaceName(string1)
      setPlaceAddress(string2)
      let removed = false;
      setMapOutput(mapOutput.filter(item => {
        if (!removed && item.name === string1) {
          removed = true;
          return false;
        }
        return true;
      }))
    }
  }

  const [mapOutput, setMapOutput] = useState<mapOutputProps[]>([]);
  const handleMapOutput = (props: mapOutputProps[]) => {
    setMapOutput(
      mapOutput.concat(props)
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="add-meeting-form">
      <div className="planning">
        <div className="setDetails">
          <div className="setDetails_date">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="setDetails">
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="setDetails_description">
            <label htmlFor="description">Description: </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <p className="setDetails_header">Location</p>
          <div className="setDetails_location">
            <label htmlFor="description">Name: </label>
            <p id="placeName">{placeName}</p>
            <label htmlFor="description">Address:</label>
            <p id="placeAddress">{placeAddress}</p>
          </div>
          <div>
            <button className="Buttons" onClick={() => setPopUp(true)}>Add Location</button>
            <Googlemaps trigger={popUp} setTrigger={setPopUp} extractData={handleMapOutput} />
          </div>
        </div>
        <div className="locationschosen">
          <p className="setDetails_header">List of Selected Locations</p>
          {mapOutput.map((list: mapOutputProps) => {
            return (
              <div className="locations">
                ___________________________________________________
                <p className="content">Name: {list.name}</p>
                <p className="content">Address: {list.address}</p>
                <button onClick={() => handleDescription(list.name, list.address)}>Add To Location</button>
              </div>
            )
          }
          )}
        </div>
        <button className="Buttons" type="submit">Add Meeting</button>
      </div>
      <ExpenditureTracker />
    </form>
  );
}

export default AddMeetingForm;
