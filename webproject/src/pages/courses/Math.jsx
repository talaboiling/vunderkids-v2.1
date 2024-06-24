import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import mathIcon from "../../assets/calculator.png";
import englishIcon from "../../assets/english.png";
import bgtask from "../../assets/bgtask.svg";
import bgstudtask from "../../assets/bgstudtask.png";
import bgvideo from "../../assets/videolessonthumb.svg";
import staricon from "../../assets/navStars.png";
import cupicon from "../../assets/navCups.png";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  fetchUserData,
  fetchCourses,
  fetchSections,
  fetchCourse,
  fetchTask,
  fetchQuestions,
  answerQuestion,
} from "../../utils/apiService";

const Math = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [sections, setSections] = useState([]);
  const [user, setUser] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [taskContent, setTaskContent] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
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
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
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

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = async () => {
    const isCorrect =
      selectedOption === questions[currentQuestionIndex].correct_answer;
    setFeedbackMessage(isCorrect ? "Correct!" : "Incorrect!");
    setShowFeedback(true);
  
    await answerQuestion(
      courseId,
      taskContent.section,
      taskContent.id,
      questions[currentQuestionIndex].id,
      { selectedOption, isCorrect },
      childId
    );

    setTimeout(() => {
      setShowFeedback(false);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
    }, 1500);
  };

  const handleSubmit = async () => {
    const isCorrect =
      selectedOption === questions[currentQuestionIndex].correct_answer;
    setFeedbackMessage(isCorrect ? "Correct!" : "Incorrect!");
    setShowFeedback(true);
  
    await answerQuestion(
      courseId,
      taskContent.section,
      taskContent.id,
      questions[currentQuestionIndex].id,
      { selectedOption, isCorrect },
      childId
    );

    setTimeout(() => {
      console.log("Submitting answers...");
      setShowFeedback(false);
      closeTaskModal();
    }, 1500);
  };

  if (!course) {
    return <div>Loading</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
                  <div style={{ display: "flex", flexDirection: "row", alignItems:"center"}}>
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
            <div className="modalHeader" style={{marginBottom:"20px"}}>
              <h2 className="defaultStyle" style={{ color: "#666" }}>
                Видеоурок
              </h2>
              <button
                style={{
                  float: "right",
                  backgroundColor: "lightgray",
                  border: "none",
                  borderRadius: "10px",
                  color: "#666",
                }}
                onClick={closeVideoModal}
              >
                Закрыть
              </button>
            </div>
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
            <div className="modalHeader">
              <span
                style={{ display: "flex", flexDirection: "row", gap: "2rem" }}
              >
                <p
                  className="lndsh"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img src={staricon} alt="" className="defaultIcon" />
                  0{childId.stars}
                </p>
                <p
                  className="lndsh"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img src={cupicon} alt="" className="defaultIcon" />
                  0{childId.cups}
                </p>
              </span>

              <button
                style={{
                  float: "right",
                  backgroundColor: "lightgray",
                  border: "none",
                  borderRadius: "10px",
                  color: "#666",
                }}
                onClick={closeTaskModal}
              >
                Закрыть
              </button>
            </div>
            <div
              className="studtaskDetails"
              style={{ backgroundImage: "url(./assets/bgstudtask.png)" }}
            >
              {showFeedback && (
                <div
                  className={`feedbackMessage ${
                    feedbackMessage === "Correct!" ? "fbmcorrect" : "fbmincorrect"
                  }`}
                >
                  <p
                    className={`defaultStyle ${
                      feedbackMessage === "Correct!" ? "fbmcorrect" : "fbmincorrect"
                    }`}
                  >
                    {feedbackMessage === "Correct!"
                      ? "Правильно!"
                      : "Неправильно!"}
                  </p>
                </div>
              )}
              <div className="questionCarousel">
                <div className="questionContent">
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <li key={currentQuestionIndex}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <span>
                          <strong>{currentQuestionIndex + 1}. </strong>
                          <i>{currentQuestion.title}:</i>{" "}
                        </span>
                        <strong>{currentQuestion.question_text}</strong>
                      </span>
                      <ul className="studTaskOptions">
                        {currentQuestion.options.map((option, idx) => (
                          <li
                            key={idx}
                            className={`studTaskOption ${
                              selectedOption === option.id ? "studTaskOptionSelected" : ""
                            }`}
                            onClick={() => handleOptionClick(option.id)}
                          >
                            {option.value}
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                  <div className="navigationButtons">
                    <span style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                      <progress
                        value={progress}
                        max="100"
                        style={{ width: "100%", marginTop: "10px" }}
                      ></progress>
                      <button
                        onClick={
                          currentQuestionIndex === questions.length - 1
                            ? handleSubmit
                            : handleNextQuestion
                        }
                        disabled={selectedOption === null}
                        className={`${currentQuestionIndex === questions.length - 1 ? "" : "orangeButton"}`}
                        style={{ float: "right" }}
                      >
                        {currentQuestionIndex === questions.length - 1
                          ? "Закончить"
                          : "Дальше"}
                      </button>
                      
                    </span>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Math;
