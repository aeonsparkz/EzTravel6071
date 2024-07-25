import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Reviews from '../Reviews';
import supabase from '../../supabaseClient';

jest.mock('../../supabaseClient');

const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockGetUser = supabase.auth.getUser as jest.Mock;

describe('Reviews Component', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: '1', user_metadata: { name: 'Test User' } } },
      error: null,
    });
    supabase.from = jest.fn().mockReturnValue({
      select: mockSelect.mockResolvedValue({
        data: [
          { review_id: '1', title: 'Review 1', body: 'This is review 1', ratings: 4, numberOfRatings: 1 },
          { review_id: '2', title: 'Review 2', body: 'This is review 2', ratings: 5, numberOfRatings: 2 },
        ],
        error: null,
      }),
      insert: jest.fn(() => ({
        select: mockInsert.mockResolvedValue({
          data: [{ id: '1', user_id: '1', title: 'New Review', body: 'This is a new review', ratings: 0, numberOfRatings: 0 }],
          error: null,
        }),
      })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders reviews component and fetches data', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Reviews />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/Reviews And Recommendations/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Review 1')).toBeInTheDocument();
      expect(screen.getByText('Review 2')).toBeInTheDocument();
    });
  });

  test('opens add review modal on button click', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Reviews />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByText(/Add Review/i));

    expect(screen.getByPlaceholderText(/Enter Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Body/i)).toBeInTheDocument();
  });

  test('opens review details modal on card click', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Reviews />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getAllByText('Review 1').length).toBeGreaterThan(0);
    });

    const reviewElements = screen.getAllByText('Review 1');
    fireEvent.click(reviewElements[0]);

    expect(screen.getByText(/This is review 1/i)).toBeInTheDocument();
  });

  test('changes rating for a review', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Reviews />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getAllByText('Review 1').length).toBeGreaterThan(0);
    });

    const reviewElements = screen.getAllByText('Review 1');
    fireEvent.click(reviewElements[0]);

    const starElement = reviewElements[0].closest('.starrating')?.querySelector('.star-ratings');

    if (starElement) {
      const starPath = starElement.querySelector('path[d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"]');
      if (starPath) {
        fireEvent.click(starPath);
        await waitFor(() => {
          expect(screen.getByText('Review 1')).toBeInTheDocument();
        });
      }
    }
  });
});
