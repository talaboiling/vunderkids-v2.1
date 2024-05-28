import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import '/src/dashboard.css';
import Sidebar from '../Sidebar';
import Navdash from '../Navdash';
import mathIcon from '../../assets/calculator.png';
import englishIcon from '../../assets/english.png';
import placeholderPfp from '../../assets/placehoder_pfp.png'; // Import the placeholder image
import cupicon from '../../assets/navCups.png';
import League from './League';
import certbanner from '../../assets/myCerts.png'
import cert90 from '../../assets/90lessons.png'
import cert200 from '../../assets/200lessons.png'
import cert500 from '../../assets/500lessons.png'

const Lessons = () => {
  const [user, setUser] = useState({ first_name: 'Ученик', last_name: '' }); // Default values
  const [courses, setCourses] = useState([]); // State to store courses
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
          if(localStorage.getItem("child_id")){
            setUser(response.data);
          }else{
            setUser(response.data.user);
          }
          console.log(user)
        } catch (error) {
          console.error('Error fetching user data:');
        } 
      }
    };

    const fetchCourses = async () => {
      const accessToken = localStorage.getItem('access_token');
      const childId = localStorage.getItem('child_id');
      if (accessToken) {
        try {
          const coursesEndpoint = childId
            ? `http://localhost:8000/api/courses?child_id=${childId}`
            : 'http://localhost:8000/api/courses';
          const response = await axios.get(coursesEndpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setCourses(response.data);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchUserData();
    fetchCourses();
  }, []);

  return (
    <div className='rtdash certpage'>
      <Sidebar />
      <div className="centralLessons">
        <Navdash starCount={user.stars} cupCount={user.cups} gradeNum={user.grade} notif={3} />
        <div className="mainContent">
          {/* <div className="coursesCards">
            {courses.map(course => (
              <div className="courseItem" key={course.id}>
                <div className="courseItemLeft">
                  <p style={{ margin: "0" }}>{course.name}</p>
                  <progress value={course.percentage_completed / 100} />
                  <Link to={`/dashboard/lessons/${course.id}`}>
                    <button style={{ backgroundColor: "#F8753D", fontWeight: "550", fontSize: "large", borderColor: "#FFB99C", boxShadow: "none" }}>Начать</button>
                  </Link>
                </div>
                <img src={course.name === "Математика" ? mathIcon : englishIcon} alt={course.name} style={{ backgroundColor: "#F8753D", border: "1px solid black", borderRadius: "21px" }} />
              </div>
            ))}
          </div> */}
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
              <div className="downloadCert">
                <p style={{margin:'0', color:"white", fontWeight:"600", textWrap:"wrap"}}>Сертификаты можно скачать в электронном виде или же получить по почте</p>
                <button className="orangeButton">СКАЧАТЬ</button>
                <form action="">
                  <input type="text" placeholder='Ваша почта'/>
                  <button>Отправить</button>
                </form>
                
              </div>
            </div>
            <div className="sectCertificates">
              <img src={certbanner} alt='Мои сертификаты' style={{marginBottom:"50px"}}/>
              <div className="achievements">
                <ul className="certificates">
                  <li className='certificate c90' id="active">
                    <img src={cert90} alt='Сертификат'/>
                    <p style={{margin:"0", marginTop:"10px"}}>Пройдите <b style={{fontWeight:"800", color:"#91DCB3"}}>90</b> уроков</p>
                  </li>
                  <li className='certificate c200' id='active'>
                    <img src={cert200} alt='Сертификат'/>
                    <p style={{margin:"0", marginTop:"10px"}}>Пройдите <b style={{fontWeight:"800", color:"#FFD991"}}>200</b> уроков</p>
                  </li>
                  <li className='certificate c500'>
                    <img src={cert500} alt='Сертификат'/>
                    <p style={{margin:"0", marginTop:"10px"}}>Пройдите <b style={{fontWeight:"800", color:"#FF7763"}}>500</b> уроков</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
            
        </div>
      </div>
    </div>
  );
};

export default Lessons;
