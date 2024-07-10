import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import Calendar from '../Calendar';

const mockMeetings = {
  '2024-06-28': [{ time: '10:00 AM', description: 'Meeting 1' }],
};

const mockState = {
  id: '1',
  name: 'Test Itinerary',
  start_date: '2024-06-01',
  end_date: '2024-06-30',
  startMonth: 6,
  startYear: 2024,
};

test('renders Calendar component', () => {
  act(() => {
    render(<Calendar userId="1" meetings={mockMeetings} state={mockState} />);
  });

  expect(screen.getByText('Test Itinerary')).toBeInTheDocument();
  expect(screen.getByText('2024-06-01 to 2024-06-30')).toBeInTheDocument();
});

test('displays meetings correctly', () => {
  act(() => {
    render(<Calendar userId="1" meetings={mockMeetings} state={mockState} />);
  });

  const dayElements = screen.getAllByText('28');
  const dayElement = dayElements.find(el => el.closest('.calendar-grid-cell-highlight'));
  
  if (dayElement) {
    act(() => {
      fireEvent.click(dayElement);
    });
  }

  expect(screen.getByText('10:00 AM - Meeting 1')).toBeInTheDocument();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});
