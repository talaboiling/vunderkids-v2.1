import React from 'react';
import League from './dashboard_sections/League';
import Ratinglist from './dashboard_sections/Ratinglist';
import placeholderPfp from '../assets/placehoder_pfp.png'; // Import the placeholder image

const Profile = ({ user }) => {
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null

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
      <Ratinglist />
    </div>
  );
};

export default Profile;
