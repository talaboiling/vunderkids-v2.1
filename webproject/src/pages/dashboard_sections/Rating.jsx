import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '/src/dashboard.css'
import Sidebar from '../Sidebar'
import Navdash from '../Navdash'
import Profile from '../Profile'
import cupicon from '../../assets/navCups.png'
import League from './League'
import tempRating from '../../assets/tempMainRating.png'

const Rating = () => {
  const [user, setUser] = useState({ first_name: 'Ученик', last_name: '' }); // Default values

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const response = await axios.get('http://localhost:8000/api/current-user', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      }
    };


    fetchCurrentUser();
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
              <img src="https://placehold.co/100" alt="pfp" className="pfp" style={{borderRadius:"50%", marginBottom:"15px"}}/>
              <p style={{fontSize:"x-large", fontWeight:"650", color:"#222222", margin:"0", padding:'0'}}>{user.first_name} {user.last_name}</p>
              <p style={{fontSize:"large", fontWeight:"450", color:"#222222", margin:"0", padding:'0'}}>Ученик</p>
            </div>
            <div className="lndsh cupCount">
              <img src={cupicon} alt="cups" className="cupIcon" />
              <p style={{margin:"0"}}>{user.cups}</p>
            </div>
            <League></League>
          </div>

          <div className="ratingMain">
            <img src={tempRating} alt=""/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rating