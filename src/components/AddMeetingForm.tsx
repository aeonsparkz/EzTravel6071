import React, { useState } from 'react';

interface AddMeetingFormProps {
  userId: string;
  onAddMeeting: (date: string, description: string) => void;
}

const AddMeetingForm: React.FC<AddMeetingFormProps> = ({ userId, onAddMeeting }) => {
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMeeting(date, description);
    setDate('');
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
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Meeting</button>
    </form>
  );
};

export default AddMeetingForm;
