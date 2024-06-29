import React, { useState } from 'react';
import { signIn } from './auth';
import "./styles/SignIn.css";
import { Link, useNavigate } from "react-router-dom"

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user, error } = await signIn(email, password);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Sign in successful!');
      navigate('/HomePage');
    }
  };

  return (

    <div className="signin_background">
      <div className="signin_content_container">
        <div className='signin_header'>
          <Link to="/" className='signin_logo'>
            <h1>EzTravel</h1>
          </Link>
        </div>
        <div className='signin_subheader'>
          <h2>Travel Simply</h2>
        </div>
        <div className='signin_container'>
          <h2>Welcome Back</h2>
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
    </div>
  );
};

export default SignIn;
