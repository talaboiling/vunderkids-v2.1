import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '/src/dashboard.css'
import Sidebar from '../Sidebar'
import Navdash from '../Navdash'
import Profile from '../Profile'
import tempprogres from '../../assets/temp_progres.png'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const Pprogress = () => {
  const [user, setUser] = useState({ first_name: 'Ученик', last_name: '' }); // Default values
  const [courses, setCourses] = useState([]); // State to store courses
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

    const fetchCourses = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const response = await axios.get('http://localhost:8000/api/courses', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setCourses(response.data);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchCurrentUser();
    fetchCourses();
  }, []);




  return (
    <div className='rtdash'>
      <Sidebar />
      <div className="centralDash">
        <Navdash starCount={212} cupCount={515} notif={3}/>
        <div className="centralProg">
          <img src={tempprogres} alt="" />

          <div className="progcalendar">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>

        </div>
      </div>
      <Profile user={user} />
      
    </div>
  )
}

export default Pprogress