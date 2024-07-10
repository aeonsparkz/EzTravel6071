import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SignIn from '../SignIn';
import { signIn } from '../auth';

jest.mock('./auth');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockSignIn = signIn as jest.Mock;
const mockNavigate = useNavigate as jest.Mock;

describe('SignIn Component', () => {
  beforeEach(() => {
    mockNavigate.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders SignIn component', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('displays error message on failed sign in', async () => {
    mockSignIn.mockResolvedValue({ user: null, error: { message: 'Invalid credentials' } });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('navigates to HomePage on successful sign in', async () => {
    const navigateMock = jest.fn();
    mockNavigate.mockReturnValue(navigateMock);
    mockSignIn.mockResolvedValue({ user: { id: 1, email: 'test@example.com' }, error: null });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'correctpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Sign in successful/i)).toBeInTheDocument();
      expect(navigateMock).toHaveBeenCalledWith('/HomePage');
    });
  });
});
