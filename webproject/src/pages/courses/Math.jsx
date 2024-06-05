import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Sidebar from '../Sidebar';
import Navdash from '../Navdash';
import Profile from '../Profile';
import axios from 'axios';
import placeholderPfp from '../../assets/placehoder_pfp.png';
import mathIcon from '../../assets/calculator.png';

const Math = () => {
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
    <div className='rtdash rtrat'>
        <Sidebar />
        <div className="centralLessons">
            <Navdash starCount={user.stars} cupCount={user.cups} gradeNum={user.grade} notif={3} />
            <div className="ratingCentral">
                <div className="lessonsMain">
                    <div className="coursesCards">
                    {courses.map(course => (
                        <div className="courseItem" key={course.id}>
                            <div className="courseItemLeft">
                                <p style={{ margin: "0" }}>{course.name}</p>
                                <progress value={course.percentage_completed / 100} />
                                <p className="defaultStyle">Выполнено 0 из 12 заданий</p>
                            </div>
                            <img src={course.name === "Математика" ? mathIcon : englishIcon }alt={course.name} style={{ backgroundColor: "#F8753D", border: "1px solid black", borderRadius: "21px" }} />
                        </div>
                    ))}
                    </div>
                    <div className="lessonsCont">
                        <h2 className='defaultStyle' style={{color:"black", fontWeight:"700"}}> Начало курса </h2>
                        <div style={{display: "flex", flexDirection:"row"}}><hr /><h2 className='defaultStyle' style={{color:"#aaa"}}>Нумерация</h2><hr /></div>
                        <div className="lessonsLinks">
                            <Link to="/dashboard/lessons/1" className="lessonLink lessonvideo">Видеоурок</Link>
                            <Link to="/dashboard/lessons/2" className="lessonLink">Урок 2</Link>
                            <Link to="/dashboard/lessons/3" className="lessonLink">Урок 3</Link>
                            <Link to="/dashboard/lessons/4" className="lessonLink">Урок 4</Link>
                            <Link to="/dashboard/lessons/5" className="lessonLink">Урок 5</Link>
                        </div>
                    </div>
                </div>
                
                <div className="lessonsProg">
                    <p>Что мы будем проходить:</p>
                    <div className="progList">
                        <div className="progItem">
                            <p>Урок 1</p>
                            <progress value="0.2" max="1"></progress>
                        </div>
                        <div className="progItem">
                            <p>Урок 2</p>
                            <progress value="0.4" max="1"></progress>
                        </div>
                        <div className="progItem">
                            <p>Урок 3</p>
                            <progress value="0.6" max="1"></progress>
                        </div>
                        <div className="progItem">
                            <p>Урок 4</p>
                            <progress value="0.8" max="1"></progress>
                        </div>
                        <div className="progItem">
                            <p>Урок 5</p>
                            <progress value="1" max="1"></progress>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    </div>
  )
}

export default Math