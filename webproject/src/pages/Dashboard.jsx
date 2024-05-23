import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import '/src/dashboard.css';
import Sidebar from './Sidebar';
import Navdash from './Navdash';
import Profile from './Profile';
import lionimg from '../assets/lion_hellocont.png';
import somechart from '../assets/temp_progres.png';

const Dashboard = () => {
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
        <Navdash starCount={user.stars} cupCount={user.cups} gradeNum={user.grade} notif={3} />
        <div className="mainContent">
          <h2 style={{ color: "#22222244" }}>Главная</h2>
          <div className="helloContent">
            <span className='helloCont'>
              <p style={{ fontWeight: "500", fontSize: "xx-large", color: "#222222ef", margin: "0", marginBottom: "15px" }}>
                Привет, <strong>{user.first_name}</strong>
              </p>
              <p style={{ fontWeight: "500", color: "#2222229f", maxWidth: "70%", margin: "0" }}>
                Делай сегодня то, что другие не хотят - завтра будешь жить так, как другие не могут
              </p>
            </span>
            <img src={lionimg} alt="mascot" style={{ position: "absolute", top: "-50px", left: "70%", scale: "1.2" }} />
          </div>

          <h3 style={{ color: "black", fontWeight: "700", fontSize: "x-large" }}>Мои курсы</h3>
          <div className="coursesCards">
            {courses.map(course => (
              <div className="courseItem" key={course.id}>
                <div className="courseItemLeft">
                  <p style={{ margin: "0" }}>{course.name}</p>
                  <progress value={course.percentage_completed / 100} />
                  <Link to={`/dashboard/lessons/${course.id}`}>
                    <button style={{ backgroundColor: "#F8753D", fontWeight: "550", fontSize: "large", borderColor: "#FFB99C", boxShadow: "none" }}>Начать</button>
                  </Link>
                </div>
                <img src={course.name === "Математика" ? '../assets/calculator.png' : '../assets/english.png'} alt={course.name} style={{ backgroundColor: "#F8753D", border: "1px solid black", borderRadius: "21px" }} />
              </div>
            ))}
          </div>
          <div className="progressChart">
            <img src={somechart} alt="Progress Chart" />
          </div>
        </div>
      </div>
      <Profile user={user} />
    </div>
  );
};

export default Dashboard;
