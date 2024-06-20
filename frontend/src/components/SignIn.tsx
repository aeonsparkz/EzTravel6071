import React, { useState } from 'react';
import { signIn } from './auth';
import "./SignIn.css";
import { Link, useNavigate } from "react-router-dom"

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user, error } = await signIn(email, password);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Sign in successful!');
    }
  };

  return (
    
      <div className="background">
        <div className='header'>
            <h1>EzTravel</h1>
        </div>
        <div className='subheader'>
            <h2>Travel Simply</h2>
        </div>
        <div className='container'>
        <form onSubmit={handleSignIn}>
      <div>
        <div className='input-box'>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      </div>
      <div>
      <div className='input-box'>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      </div>
      <button type="submit">Sign In</button>
      <div className="register">
                        <p>No Account? <Link to="./SignUp">Sign Up Now!</Link></p>
                    </div>
      <div>{message}</div>
    </form>
    </div>
    </div>
  );
};

export default SignIn;
