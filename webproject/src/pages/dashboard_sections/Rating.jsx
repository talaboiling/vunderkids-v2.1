import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '/src/dashboard.css';
import Sidebar from '../Sidebar';
import Navdash from '../Navdash';
import Profile from '../Profile';
import cupicon from '../../assets/navCups.png';
import League from './League';
import tempRating from '../../assets/tempMainRating.png';
import placeholderPfp from '../../assets/placehoder_pfp.png'; // Import the placeholder image
import Ratinglist from './Ratinglist'; // Import the Ratinglist component

const Rating = () => {
  const [user, setUser] = useState({ first_name: 'Ученик', last_name: '' }); // Default values
  const [ratings, setRatings] = useState([]); // State to store ratings
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem('access_token');
      const childId = localStorage.getItem('child_id');
      if (accessToken) {
        try {
          const userEndpoint = childId
            ? `http://localhost:8000/api/children/${childId}`
            : 'http://localhost:8000/api/current-user';
          const response = await axios.get(userEndpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (childId) {
            setUser(response.data);
          } else {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

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

    fetchUserData();
    fetchRatings();
  }, []);

  return (
    <div className='rtdash rtrat'>
      <Sidebar />
      <div className="centralDash">
        <Navdash starCount={user.stars} cupCount={user.cups} gradeNum={user.grade} notif={3}/>
        <div className="ratingCentral">
          <div className="ratinginfo">
            <div className="prowfirst">
              <p style={{fontSize:"x-large", fontWeight:"650", color:"#222222", margin:"0", padding:'0'}}>Мой профиль</p>
              <input list='settings' className='settings'/>
              <datalist id='settings'>
                <option value='Настройки'/>
                <option value='Выйти'/>
              </datalist>
            </div>
            <div className="sidepfp">
              <img src={avatarUrl} alt="pfp" className="pfp" style={{borderRadius:"50%", marginBottom:"15px" ,width: "100px", height: "100px"}}/>
              <p style={{fontSize:"x-large", fontWeight:"650", color:"#222222", margin:"0", padding:'0'}}>{user.first_name} {user.last_name}</p>
              <p style={{fontSize:"large", fontWeight:"450", color:"#222222", margin:"0", padding:'0'}}>Ученик</p>
            </div>
            <div className="lndsh cupCount">
              <img src={cupicon} alt="cups" className="cupIcon" />
              <p style={{margin:"0"}}>{user.cups}</p>
            </div>
            <League />
          </div>
        </div>
        <Ratinglist ratings={ratings} />
      </div>
    </div>
  )
}

export default Rating;
