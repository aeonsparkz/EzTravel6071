import React, { useState } from 'react';
import { signUp } from './auth';
import "./SignUp.css";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user, error } = await signUp(email, password);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Sign up successful! Please check your email to confirm your account.');
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Sign Up</button>
      <div>{message}</div>
    </form>
  );
};

export default SignUp;
