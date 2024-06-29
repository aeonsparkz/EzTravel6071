import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateItinerary from './CreateItinerary';
import supabase from '../supabaseClient';

jest.mock('../supabaseClient');

const mockInsert = jest.fn();
const mockGetUser = supabase.auth.getUser as jest.Mock;

describe('CreateItinerary Component', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: '1', user_metadata: { name: 'Test User' } } },
      error: null,
    });

    supabase.from = jest.fn().mockReturnValue({
      insert: mockInsert,
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: '1', name: 'Test Itinerary', start_date: '2024-06-01', end_date: '2024-06-30' },
        error: null,
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders CreateItinerary component', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CreateItinerary />
        </MemoryRouter>
      );
    });

    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date:')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date:')).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CreateItinerary />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Test Itinerary' } });
    fireEvent.change(screen.getByLabelText('Start Date:'), { target: { value: '2024-06-01' } });
    fireEvent.change(screen.getByLabelText('End Date:'), { target: { value: '2024-06-30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Itinerary' }));

    await waitFor(() => {
      console.log('mockInsert calls:', mockInsert.mock.calls);
      expect(mockInsert).toHaveBeenCalledWith([{ user_id: '1', name: 'Test Itinerary', start_date: '2024-06-01', end_date: '2024-06-30' }]);
    });
  });
});
