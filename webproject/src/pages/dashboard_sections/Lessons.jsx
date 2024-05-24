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
