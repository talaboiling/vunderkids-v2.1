import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Activate = () => {
  const { activation_token } = useParams(); // Capture the token from the URL
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/activate/${activation_token}`);
        if (response.status === 200) {
          setMessage('Account successfully activated!');
        } else {
          setMessage('Failed to activate account.');
        }
      } catch (error) {
        setMessage('Invalid or expired activation link.');
      }
    };

    activateAccount();
  }, [activation_token]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default Activate;
