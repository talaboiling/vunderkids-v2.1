import League from './dashboard_sections/League';
import Ratinglist from './dashboard_sections/Ratinglist';
import placeholderPfp from '../assets/placehoder_pfp.png'; // Import the placeholder image
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ user }) => {
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null
  const [ratings, setRatings] = useState([]); // State to store ratings



  useEffect(() => {
    const fetchRatings = async () => {
      const accessToken = localStorage.getItem('access_token');
      const childId = localStorage.getItem('child_id');
      if (accessToken) {
        try {
          const ratingsEndpoint = childId
            ? `http://localhost:8000/api/rating/global?child_id=${childId}`
            : 'http://localhost:8000/api/rating/global';
            console.log(ratingsEndpoint)
          const response = await axios.get(ratingsEndpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setRatings(response.data);
        } catch (error) {
          console.error('Error fetching ratings:', error);
        }
      }
    };
    console.log(ratings)

    fetchRatings();
  }, []);
  return (
    <div className='dashProfile'>
      <div className="prowfirst">
        <p style={{ fontSize: "x-large", fontWeight: "650", color: "#222222", margin: "0", padding: '0' }}>Мой профиль</p>
        <input list='settings' className='settings' />
        <datalist id='settings'>
          <option value='Настройки' />
          <option value='Выйти' />
        </datalist>
      </div>
      <div className="sidepfp">
        <img src={avatarUrl} alt="pfp" className="pfp" style={{borderRadius:"50%", marginBottom:"15px" ,width: "100px", height: "100px"}}/>
        <p style={{ fontSize: "x-large", fontWeight: "650", color: "#222222", margin: "0", padding: '0' }}>{user.first_name} {user.last_name}</p>
        <p style={{ fontSize: "large", fontWeight: "450", color: "#222222", margin: "0", padding: '0' }}>Ученик</p>
      </div>
      <League />
      <Ratinglist ratings={ratings} />
    </div>
  );
};

export default Profile;
