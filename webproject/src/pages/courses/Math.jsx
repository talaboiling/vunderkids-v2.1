import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import placeholderPfp from "../../assets/placehoder_pfp.png";
import mathIcon from "../../assets/calculator.png";
import englishIcon from "../../assets/english.png";
import bgtask from "../../assets/bgtask.svg";
import bgvideo from "../../assets/videolessonthumb.svg";
import CloseIcon from "@mui/icons-material/Close";
import {
  fetchUserData,
  fetchCourses,
  fetchSections,
  fetchCourse,
  fetchTask,
  fetchQuestions,
} from "../../utils/apiService";

const Math = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [sections, setSections] = useState([]);
  const [user, setUser] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [taskContent, setTaskContent] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isChild, setIsChild] = useState(false);
  const [childId, setChildId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const child_id = localStorage.getItem("child_id");
        let userData;
        if (child_id) {
          userData = await fetchUserData(child_id);
          setIsChild(true);
          setChildId(child_id);
        } else {
          userData = await fetchUserData();
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
  }, [courseId]);

  const openVideoModal = (url) => {
    const embedUrl = url.replace("watch?v=", "embed/");
    setVideoUrl(embedUrl);
    setShowVideoModal(true);
  };

  const openTaskModal = async (sectionId, taskId) => {
    try {
      const task = await fetchTask(courseId, sectionId, taskId, childId);
      const taskQuestions = await fetchQuestions(
        courseId,
        task.section,
        taskId,
        childId
      );
      setTaskContent(task);
      setQuestions(taskQuestions);
      setShowTaskModal(true);
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
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

              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <hr />
                    <h2 className="defaultStyle" style={{ color: "#aaa" }}>
                      {section.title}
                    </h2>
                    <hr />
                  </div>
                  {section.contents.map((content, contentIndex) => (
                    <div className="lessonsLinks" key={contentIndex}>
                      {content.content_type === "lesson" ? (
                        <div
                          className="vidBlock studVidBlock"
                          onClick={() => openVideoModal(content.video_url)}
                        >
                          <div className="thumbcontainer">
                            <img
                              src={bgvideo || "placeholder.png"}
                              alt="vidname"
                              className="taskThumbnail"
                            />
                          </div>
                          <p
                            style={{
                              backgroundColor: "white",
                              margin: "0",
                              padding: "7px 40px",
                              borderRadius: "10px",
                            }}
                          >
                            {content.title}
                          </p>
                        </div>
                      ) : (
                        <div
                          className="studVidBlock task"
                          onClick={() =>
                            openTaskModal(content.section, content.id)
                          }
                        >
                          <img
                            src={bgtask || "placeholder.png"}
                            alt="vidname"
                            className="taskThumbnail"
                          />
                          <p
                            style={{
                              backgroundColor: "white",
                              margin: "0",
                              padding: "7px 40px",
                              borderRadius: "10px",
                            }}
                          >
                            {content.title}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="lessonsProg">
            <p>Что мы будем проходить:</p>
            <div className="progList">
              {sections.map((section, index) => (
                <div className="progItem" key={index}>
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
        <dialog className="studmodal" open>
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
        <dialog className="studmodal" open>
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
            <h2 className="defaultStyle" style={{ color: "#666" }}>
              {taskContent.title}
            </h2>
            <div className="taskDetails">
              <p>
                <strong>Описание:</strong> {taskContent.description}
              </p>
              <h3>Вопросы</h3>
              <ul>
                {questions.map((question, index) => (
                  <li key={index}>
                    <strong>{question.title}</strong>: {question.question_text}
                    <ul>
                      {question.options.map((option, idx) => (
                        <li key={idx}>
                          {option.value}{" "}
                          {question.correct_answer === option.id
                            ? "(Correct)"
                            : ""}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Math;
