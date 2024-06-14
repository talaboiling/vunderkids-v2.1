import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import placeholderPfp from "../../assets/placehoder_pfp.png";
import mathIcon from "../../assets/calculator.png";
import englishIcon from "../../assets/english.png";
import {
  fetchUserData,
  fetchCourses,
  fetchSections,
  fetchCourse,
} from "../../utils/apiService";
const Math = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [sections, setSections] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const child_id = localStorage.getItem("child_id");
        if (child_id) {
          const userData = await fetchUserData(child_id);
        } else {
          const userData = await fetchUserData();
        }
        const courseData = await fetchCourse(courseId);
        const sectionsData = await fetchSections(courseId);
        setSections(sectionsData);
        setCourse(courseData);
        setUser(userData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const openVideoModal = (url) => {
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

  if (!course) {
    return <div>Loading</div>;
  }

  return (
    <div className="rtdash rtrat">
      <Sidebar />
      <div className="centralLessons">
        <Navdash
          starCount={user.stars}
          cupCount={user.cups}
          gradeNum={user.grade}
          notif={3}
        />
        <div className="ratingCentral">
          <div className="lessonsMain">
            <div className="coursesCards">
              <div className="courseItem" key={course.id}>
                <div className="courseItemLeft">
                  <p style={{ margin: "0" }}>{course.name}</p>
                  <progress value={course.percentage_completed} />
                  <p className="defaultStyle">
                    Выполнено {course.completed_tasks} из {course.total_tasks}{" "}
                    заданий
                  </p>
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
            </div>
            <div className="lessonsCont">
              <h2
                className="defaultStyle"
                style={{ color: "black", fontWeight: "700" }}
              >
                {" "}
                Начало курса{" "}
              </h2>

              {sections.map((section, index) => (
                <>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <hr />
                    <h2 className="defaultStyle" style={{ color: "#aaa" }}>
                      {section.title}
                    </h2>
                    <hr />
                  </div>
                  {section.contents.map((content, index) => (
                    <div className="lessonsLinks">
                      {content.content_type === "lesson" ? (
                        <Link
                          to="/dashboard/courses/course_id/sections/section_id/conten ts/content_id"
                          className="lessonLink lessonvideo"
                        >
                          Урок: {content.title}
                        </Link>
                      ) : (
                        <Link // Specify a default link or handle the case differently
                          to="/somewhere-else" // Replace with appropriate URL or logic
                          className="lessonLink" // Optional class for styling
                        >
                          Задание: {content.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>

          <div className="lessonsProg">
            <p>Что мы будем проходить:</p>
            <div className="progList">
              {sections.map((section, index) => (
                <div className="progItem">
                  <p>{section.title}</p>
                  <progress
                    value={section.percentage_completed / 100}
                    max="1"
                  ></progress>
                </div>
              ))}
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
            <h2 className="defaultStyle" style={{ color: "#666" }}>
              Видео Урок
            </h2>
            <iframe
              width="500px"
              height="315px"
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
              onClick={closeTaskModal}
            >
              <CloseIcon sx={{ color: "gray" }} />
            </button>
            <div className="studmodal-header">
              <div className="lndsh">
                <img src={staricon} alt="stars" className="defaultIcon" />
                <strong>{user.stars}</strong>
              </div>
              <div className="lndsh">
                <img src={cupicon} alt="cupicon" className="defaultIcon" />
                <strong>{user.cups}</strong>
              </div>
            </div>
            <div className="studmodal-main">
              <h2
                className="defaultStyle"
                style={{
                  fontSize: "xx-large",
                  fontWeight: "700",
                  margin: "25px 0",
                }}
              >
                Какая картинка показывает 7?
              </h2>
              <div className="studmodal-main-content">
                <button>1</button>
                <button>5</button>
                <button>7</button>
                <button>8</button>
              </div>
            </div>
            <div className="studmodal-footer">
              <progress value={0.4} />
              <button className="orangeButton" style={{ float: "right" }}>
                Дальше
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Math;
