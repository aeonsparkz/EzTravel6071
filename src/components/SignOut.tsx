import React from 'react';
import { signOut } from './auth';

const SignOut: React.FC = () => {
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      console.log('Signed out successfully');
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOut;
