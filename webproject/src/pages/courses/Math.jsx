import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Sidebar from '../Sidebar';
import Navdash from '../Navdash';
import Profile from '../Profile';
import axios from 'axios';
import CloseIcon from "@mui/icons-material/Close";
import placeholderPfp from '../../assets/placehoder_pfp.png';
import mathIcon from '../../assets/calculator.png';
import englishIcon from '../../assets/english.png'
import bgtask from "../../assets/bgtask.svg";
import bgvideo from "../../assets/videolessonthumb.svg";
import staricon from '../../assets/navStars.png';
import cupicon from '../../assets/navCups.png';
import bgstudtask from "../../assets/bgstudtask.png";

const Math = () => {
  const [user, setUser] = useState({ first_name: 'Ученик', last_name: '' }); // Default values
  const [courses, setCourses] = useState([]); // State to store courses
  const [showVideoModal, setShowVideoModal] = useState(false); // State for video modal
  const [showTaskModal, setShowTaskModal] = useState(false); // State for task modal
  const [videoUrl, setVideoUrl] = useState(''); // State to store video URL

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
          if (localStorage.getItem("child_id")) {
            setUser(response.data);
          } else {
            setUser(response.data.user);
          }
          console.log(user);
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

  const openVideoModal = () => {
    setVideoUrl('https://www.youtube.com/embed/_ALtBbXcyXc');
    setShowVideoModal(true);
  };

  const openTaskModal = () => {
    setShowTaskModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
  };

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
                  <img src={course.name === "Математика" ? mathIcon : englishIcon} alt={course.name} style={{ backgroundColor: "#F8753D", border: "1px solid black", borderRadius: "21px" }} />
                </div>
              ))}
            </div>
            <div className="lessonsCont">
              <h2 className='defaultStyle' style={{ color: "black", fontWeight: "700" }}> Начало курса </h2>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}><hr /><h2 className='defaultStyle' style={{ color: "#aaa" }}>Нумерация</h2><hr /></div>
              <div className="lessonsLinks">
                <div className="vidBlock studVidBlock" onClick={() => openVideoModal('path/to/video.mp4')}>
                  <div className='thumbcontainer'>
                    <img src={bgvideo || 'placeholder.png'} alt="vidname" className="taskThumbnail" />
                  </div>
                  <p style={{ backgroundColor: "white", margin: "0", padding: "7px 40px", borderRadius: "10px" }}>Видеоурок</p>
                </div>
                <div className="taskBlock" onClick={openTaskModal}>
                  <img src={bgtask} alt="" style={{ paddingTop: "20px", scale: "1.3", overflow: "hidden" }} />
                  <p style={{ backgroundColor: "white", margin: "0", padding: "7px 40px", borderRadius: "10px" }}>Задание 1</p>
                </div>
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

      {showVideoModal && (
        <dialog className="studmodal" style={{}}>
          <div className="studmodal-content">
            <button
                  style={{
                    border: "none",
                    float: "right",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    padding: "0",
                  }}
                  onClick={closeVideoModal}
                >
                  <CloseIcon sx={{ color: "gray" }} />
                </button>
            <h2 className="defaultStyle" style={{ color: "#666", marginBottom:"20px"}}>Видео Урок</h2>
              <iframe 
                width="650px" 
                height="315" 
                src={videoUrl} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            
            
          </div>
        </dialog>
      )}

      {showTaskModal && (
        <dialog className="studmodal" style={{  }}>
          <div className="studmodal-content">
            <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  padding: "0",
                }}
                onClick={closeTaskModal}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
            <div className="studmodal-header">
              <div className="lndsh"><img src={staricon} alt="stars" className='defaultIcon'/><strong>{user.stars}</strong></div>
              <div className="lndsh"><img src={cupicon} alt="cupicon" className='defaultIcon'/><strong>{user.cups}</strong></div>
            </div>
            <div className="studmodal-main">
              <h2 className='defaultStyle' style={{fontSize:"xx-large", fontWeight:"700", margin:"25px 0"}}>Какая картинка показывает 7?</h2>
              <div className="studmodal-main-content">
                <button>1</button>
                <button>5</button>
                <button>7</button>
                <button>8</button>
              </div>
            </div>
            <div className="studmodal-footer">
              <progress value={0.4}/>
              <button className="orangeButton" style={{float:"right"}}>Дальше</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Math;
