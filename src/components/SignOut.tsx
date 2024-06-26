import React from 'react';
import { signOut } from './auth';
import { useNavigate } from 'react-router-dom';

const SignOut: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      console.log('Signed out successfully');
      navigate('/');
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOut;
