import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SignOut from '../SignOut';
import { signOut } from '../auth';

jest.mock('./auth', () => ({
  signOut: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('SignOut Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders SignOut button', () => {
    render(
      <BrowserRouter>
        <SignOut />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
  });

  test('calls signOut and navigates to home on successful sign out', async () => {
    (signOut as jest.Mock).mockResolvedValue({ error: null });

    render(
      <BrowserRouter>
        <SignOut />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('displays error message on sign out failure', async () => {
    console.error = jest.fn();
    const errorMessage = 'Sign out failed';
    (signOut as jest.Mock).mockResolvedValue({ error: { message: errorMessage } });

    render(
      <BrowserRouter>
        <SignOut />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error signing out:', errorMessage);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
