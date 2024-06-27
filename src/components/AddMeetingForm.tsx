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
  const [popUp, setPopUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMeeting(date, time, placeName, placeAddress);
    setDate('');
    setTime('');
    setPlaceName('');
    setPlaceAddress('');
  };

  type mapOutputProps = {
    name: string | undefined
    address: string | undefined
  }

  const handleDescription = (string1: string | undefined, string2: string | undefined) => {
    if (string1 !== undefined && string2 !== undefined) {
      setPlaceName(string1)
      setPlaceAddress(string2)
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
            <label htmlFor="description">Name: </label>
            <input
              type="text"
              id="placename"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              required
            />
          </div>
          <div className="setDetails_description">
            <label htmlFor="description">Address:</label>
            <input
              type="text"
              id="placeaddress"
              value={placeAddress}
              onChange={(e) => setPlaceAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <button className="Buttons" onClick={() => setPopUp(true)}>Add Location</button>
            <Googlemaps trigger={popUp} setTrigger={setPopUp} extractData={handleMapOutput} />
          </div>
          </div>
          <div className="locationschosen">
            {mapOutput.map((list: mapOutputProps) => {
              return (
                <div className="locations">
                  ___________________________________________________
                  <p className="content">Name: {list.name}</p>
                  <p className="content">Address: {list.address}</p>
                  <button onClick={() => handleDescription(list.name, list.address)}>Add To Description</button>
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
