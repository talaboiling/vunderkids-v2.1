import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '/src/dashboard.css'
import PropTypes from 'prop-types';
import staricon from '../assets/navStars.png'
import cupicon from '../assets/navCups.png'
import bellicon from '../assets/navBell.png'

const Navdash = (props) => {
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
    <div className='navdashboard'>
        <div className="lndsh starCount">
            <img src={staricon} alt="stars" className='starIcon'/>
            {user.stars} 
        </div>
        <div className="lndsh cupCount">
            <img src={cupicon} alt="cups" className="cupIcon" />
            {user.cups}
        </div>
        <div className="rndsh gradeNum">
            {user.grade} Класс
        </div>
        <div className="rndsh langSelect">
            <div className="button b2" id="button-10">
                <input type="checkbox" className="checkbox" />
                <div className="knobs">
                    <span>ҚАЗ</span>
                </div>
                
            </div>
        </div>
        <div className="rndsh notif">
            <img src={bellicon} alt="" className="bellIcon" />
            {props.notif}
        </div>
    </div>
  );
}

Navdash.PropTypes={
    starCount: PropTypes.number,
    cupCount: PropTypes.number,
    gradeNum: PropTypes.number,
    langSelect: PropTypes.bool,
    notif: PropTypes.number,
}

Navdash.defaultProps={
    starCount: 0,
    cupCount: 0,
    gradeNum: 1,
    langSelect: false,
    notif: 0,
}

export default Navdash