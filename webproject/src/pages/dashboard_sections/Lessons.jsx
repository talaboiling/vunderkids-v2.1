import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import '/src/dashboard.css';
import Sidebar from '../Sidebar';
import Navdash from '../Navdash';
import mathIcon from '../../assets/calculator.png';
import englishIcon from '../../assets/english.png';

const Lessons = () => {
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
      <div className="centralLessons">
        <Navdash starCount={user.stars} cupCount={user.cups} gradeNum={user.grade} notif={3} />
        <div className="mainContent">
          <div className="coursesCards">
            {courses.map(course => (
              <div className="courseItem" key={course.id} style={{ width: "80%" }}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
