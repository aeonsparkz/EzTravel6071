import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';
import { signUp } from './auth';

jest.mock('./auth');

describe('SignUp Component', () => {
  test('renders SignUp component', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Password/i)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Password/i)[1]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test("displays error message when passwords don't match", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[1], { target: { value: 'password321' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords don't match. Please re-enter./i)).toBeInTheDocument();
    });
  });

  test('displays error message on existing email', async () => {
    (signUp as jest.Mock).mockResolvedValue({ user: null, session: null, error: { message: 'Email is already in use.' } });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Email is already in use./i)).toBeInTheDocument();
    });
  });

  test('displays error message on failed sign up', async () => {
    (signUp as jest.Mock).mockResolvedValue({ user: null, session: null, error: { message: 'Invalid email' } });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Invalid email/i)).toBeInTheDocument();
    });
  });

  test('displays success message on successful sign up', async () => {
    (signUp as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' }, session: null, error: null });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Sign up successful! Please check your email to confirm your account. \(Check Spam\)/i)).toBeInTheDocument();
    });
  });
});
