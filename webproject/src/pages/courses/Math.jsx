import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import placeholderPfp from "../../assets/placehoder_pfp.png";
import mathIcon from "../../assets/calculator.png";
import { fetchUserData, fetchCourses } from "../../utils/apiService";
const Math = () => {
  const [user, setUser] = useState({ first_name: "Ученик", last_name: "" });
  const [courses, setCourses] = useState([]);

  const avatarUrl = user.avatar ? user.avatar : placeholderPfp;

  useEffect(() => {
    const loadData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const coursesData = await fetchCourses(childId);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const openVideoModal = () => {
    setVideoUrl("https://www.youtube.com/embed/_ALtBbXcyXc");
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
    <div className="rtdash rtrat">
      <Sidebar />
      <div className="centralLessons">
        <Navdash />
        <div className="ratingCentral">
          <div className="lessonsMain">
            <div className="coursesCards">
              {courses.map((course) => (
                <div className="courseItem" key={course.id}>
                  <div className="courseItemLeft">
                    <p style={{ margin: "0" }}>{course.name}</p>
                    <progress value={course.percentage_completed / 100} />
                    <p className="defaultStyle">Выполнено 0 из 12 заданий</p>
                  </div>
                  <img
                    src={course.name === "Математика" ? mathIcon : englishIcon}
                    alt={course.name}
                    style={{
                      backgroundColor: "#F8753D",
                      border: "1px solid black",
                      borderRadius: "21px",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="lessonsCont">
              <h2
                className="defaultStyle"
                style={{ color: "black", fontWeight: "700" }}
              >
                {" "}
                Начало курса{" "}
              </h2>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <hr />
                <h2 className="defaultStyle" style={{ color: "#aaa" }}>
                  Нумерация
                </h2>
                <hr />
              </div>
              <div className="lessonsLinks">
                <Link
                  to="/dashboard/lessons/1"
                  className="lessonLink lessonvideo"
                >
                  Видеоурок
                </Link>
                <Link to="/dashboard/lessons/2" className="lessonLink">
                  Урок 2
                </Link>
                <Link to="/dashboard/lessons/3" className="lessonLink">
                  Урок 3
                </Link>
                <Link to="/dashboard/lessons/4" className="lessonLink">
                  Урок 4
                </Link>
                <Link to="/dashboard/lessons/5" className="lessonLink">
                  Урок 5
                </Link>
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
  );
};

export default Math;
