import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Activate.css'; // Import the CSS file for styling

const Activate = () => {
  const { activation_token } = useParams(); // Capture the token from the URL
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // Track success state for styling

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/activate/${activation_token}/`);
        if (response.status === 200) {
          setMessage('Account successfully activated!');
          setIsSuccess(true);
        } else {
          setMessage('Failed to activate account.');
          setIsSuccess(false);
        }
      } catch (error) {
        setMessage('Invalid or expired activation link.');
        setIsSuccess(false);
      }
    };

    activateAccount();
  }, [activation_token]);

  return (
    <div className={`activate-container ${isSuccess ? 'success' : 'error'}`}>
      <div className="activate-card">
        <h1 className="activate-message">{message}</h1>
        {isSuccess && <p className="activate-instruction">You can now log in to your account.</p>}
        <a href="/" className="activate-home-button">Go to Home</a>
      </div>
    </div>
  );
};

export default Activate;
