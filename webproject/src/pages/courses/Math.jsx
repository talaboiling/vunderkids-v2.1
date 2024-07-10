import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import mathIcon from "../../assets/calculator.png";
import englishIcon from "../../assets/english.png";
import correctlion from "../../assets/lion_correct.png"
import wronglion from "../../assets/lion_incorrect.png"
import bgtask from "../../assets/bgtask.svg";
import bgvideo from "../../assets/videolessonthumb.svg";
import staricon from "../../assets/navStars.png";
import cupicon from "../../assets/navCups.png";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import bgmusic from "../../assets/audio/Kevin MacLeod_ Atlantean Twilight.mp3"
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import click_audio from "../../assets/audio/click_sound.mp3";
import correct_audio from "../../assets/audio/correct_sound.mp3";
import incorrect_audio from "../../assets/audio/incorrect_sound.mp3";
import {
  fetchUserData,
  fetchCourse,
  fetchSections,
  fetchTask,
  fetchQuestions,
  answerQuestion,
} from "../../utils/apiService";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";
import VolumeUp from "@mui/icons-material/VolumeUp";


const Math = () => {
  const { t } = useTranslation();
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
  const [draggedOption, setDraggedOption] = useState(null);
  const [droppedOrder, setDroppedOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null); // Add this line
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Add this line
  const backgroundAudioRef = useRef(null);
  const clickSoundRef = useRef(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const [isBackgroundAudioPlaying, setIsBackgroundAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    loadData();
  }, [courseId]);

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
      const courseData = await fetchCourse(courseId, child_id);
      const sectionsData = await fetchSections(courseId, child_id);
      console.log(sectionsData);
      setSections(sectionsData);
      setCourse(courseData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      if (taskQuestions.length === 0) {
        alert(t ('noQuestions'));
        return;
      }
      setTaskContent(task);
      setQuestions(taskQuestions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setDroppedOrder([]);
      setShowTaskModal(true);
      
      // Play background music
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.play();
        setIsBackgroundAudioPlaying(true);
      }
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  };
  

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  const closeTaskModal = async () => {
    setShowTaskModal(false);
    await loadData();
    
    // Stop background music
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
      setIsBackgroundAudioPlaying(false);
    }
  };

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
    if(clickSoundRef.current) {
      clickSoundRef.current.play();
    }
  };

  const handleDragStart = (optionId) => {
    setDraggedOption(optionId);
  };

  const handleDrop = (event, dropIndex) => {
    event.preventDefault();
    const updatedOrder = [...droppedOrder];
    updatedOrder[dropIndex] = draggedOption;
    setDroppedOrder(updatedOrder);
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect;

    if (currentQuestion.question_type.startsWith("drag_and_drop")) {
      isCorrect =
        JSON.stringify(droppedOrder) ===
        JSON.stringify(currentQuestion.correct_answer);
    } else {
      isCorrect = selectedOption === currentQuestion.correct_answer;
    }

    setFeedbackMessage(isCorrect ? "Correct!" : "Incorrect!");
    setShowFeedback(true);

    if (isCorrect && correctSoundRef.current) {
      correctSoundRef.current.play();
    } else if (!isCorrect && incorrectSoundRef.current) {
      incorrectSoundRef.current.play();
    }

    await answerQuestion(
      courseId,
      taskContent.section,
      taskContent.id,
      currentQuestion.id,
      selectedOption,
      childId
    );

    setTimeout(() => {
      setShowFeedback(false);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setDroppedOrder([]);
    }, 1500);
  };

  const handleSubmit = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect;

    if (currentQuestion.question_type.startsWith("drag_and_drop")) {
      isCorrect =
        JSON.stringify(droppedOrder) ===
        JSON.stringify(currentQuestion.correct_answer);
    } else {
      isCorrect = selectedOption === currentQuestion.correct_answer;
    }

    setFeedbackMessage(isCorrect ? "Correct!" : "Incorrect!");
    setShowFeedback(true);

    if (isCorrect && correctSoundRef.current) {
      correctSoundRef.current.play();
    } else if (!isCorrect && incorrectSoundRef.current) {
      incorrectSoundRef.current.play();
    }

    await answerQuestion(
      courseId,
      taskContent.section,
      taskContent.id,
      currentQuestion.id,
      selectedOption,
      childId
    );

    setTimeout(async () => {
      setShowFeedback(false);
      setShowTaskModal(false);
    }, 1500);

    await loadData();
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  useEffect(() => {
    const handleAudioEnded = () => {
      setIsAudioPlaying(false);
    };
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnded);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, []);

  const toggleMute = () => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };
  
  if (loading) {
    return <Loader></Loader>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="rtdash rtrat">
      <Sidebar className="courseSidebar" />
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
                    {t ('completedTasks1')}{course.completed_tasks}{t ('completedTasks2')}{course.total_tasks}{" "}
                    {t ('completedTasks3')}
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
                {t ('courseStart')}{" "}
              </h2>

              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
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
                              marginBottom: "7px",
                            }}
                          >
                            {content.title}
                          </p>
                          {content.is_completed && (
                            <div className="completedTask">
                              <VerifiedIcon sx={{ color: "#19a5fc" }} />
                              <strong>{t ('youCompletedTask')}</strong>
                            </div>
                          )}
                          {!content.is_completed && (
                            <div className="completedTask incompleteTask">
                              <strong>{t ('youHaveNewTask')}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="lessonsProg">
            <h3
              className="defaultStyle"
              style={{ color: "black", fontWeight: "800", fontSize: "x-large" }}
            >
              {t ('whatWeLearn')}
            </h3>
            <div className="progList">
              {sections.map((section, index) => (
                <div className="progItem" key={index}>
                  <p style={{ margin: "0", marginBottom: "15px" }}>
                    {section.title}
                  </p>
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
            <div className="modalHeader" style={{ marginBottom: "20px" }}>
              <h2 className="defaultStyle" style={{ color: "#666" }}>
                {t ('videoLesson')}
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
                {t ('close')}
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px 20px",
                    gap: "0.5rem",
                  }}
                >
                  <img src={staricon} alt="" className="defaultIcon" />
                  {user.stars}
                </p>
                <p
                  className="lndsh"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px 20px",
                    gap: "0.5rem",
                  }}
                >
                  <img src={cupicon} alt="" className="defaultIcon" />
                  {user.cups}
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
                {t ('close')}
              </button>
            </div>
            <div
              className={`studtaskDetails ${
                currentQuestion?.template
                  ? `template-${currentQuestion.template}`
                  : ""
              }`}
            >
              {showFeedback && (
                <div
                  className={`feedbackMessage ${
                    feedbackMessage === "Correct!"
                      ? "fbmcorrect"
                      : "fbmincorrect"
                  }`}
                >
                  <div className="feedbackContent">
                    <img src={feedbackMessage === "Correct!" ? correctlion : wronglion} alt="lion mascot" />
                    <p
                      style={{
                        color: "black",
                        fontSize: "xx-large",
                        fontWeight: "700",
                        textAlign: "center",
                        backgroundColor:"white",
                        padding:"10px",
                        borderRadius:"10px",
                      }}
                    >
                      {feedbackMessage === "Correct!"
                      ? t ('correct')
                      : t ('incorrect')}
                    </p>
                  </div>
                </div>
              )}
              <div className="questionCarousel">
                <div className="questionContent">
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      fontSize: "x-large",
                      padding: "7px 0",
                      gap: "1rem",
                    }}
                  >
                    <li key={currentQuestionIndex}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          gap: "0.33rem",
                          maxWidth: "500px",
                          textAlign: "center",
                          
                        }}
                      >
                        <span style={{maxWidth:"500px"}}>
                          <strong>{currentQuestionIndex + 1}. </strong>
                          <i>{currentQuestion.title}:</i>{" "}
                        </span>
                        <strong>{currentQuestion.question_text}</strong>
                        {currentQuestion.is_attempted && (
                          <strong style={{ color: "green", marginTop: "50px" }}>
                            {t ('alreadyAnswered')}
                          </strong>
                        )}
                        {currentQuestion.audio && (
                          <>
                            <div className="taskmodalaudio">
                              <button className="" onClick={toggleAudio}>
                                {isAudioPlaying ? <PauseIcon sx={{ fontSize: 50 }} /> : <PlayArrowIcon sx={{ fontSize: 50 }} />}
                              </button>
                            </div>
                            
                            <audio ref={audioRef} src={currentQuestion.audio} />
                          </>
                        )}
                        <div style={{
                              float: "right",
                              position:"absolute",
                              right:"0",
                              display:"flex",
                              flexDirection:"column",
                            }}>
                          <button
                            className="transBtn"
                            onClick={toggleMute}
                            style={{color:"gray"}}
                          >
                            {isMuted ? <VolumeOffIcon sx={{fontSize:"70px"}}/> : <VolumeUpIcon sx={{fontSize:"70px"}}/>}
                          </button>
                          <input
                            type="range"
                            id="volumeControl"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                          />
                        </div>
                      </span>
                      {currentQuestion.question_type.startsWith(
                        "drag_and_drop"
                      ) ? (
                        <ul
                          className="studTaskOptions"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            gap: "1rem",
                          }}
                        >
                          {currentQuestion.options.map((option, idx) => (
                            <li
                              key={idx}
                              className="studTaskOption"
                              draggable
                              onDragStart={() => handleDragStart(option.id)}
                              onDrop={(event) => handleDrop(event, idx)}
                              onDragOver={allowDrop}
                              style={{ cursor: "move" }}
                            >
                              {currentQuestion.question_type ===
                              "drag_and_drop_images" ? (
                                <img
                                  src={option.value}
                                  alt={`option-${idx}`}
                                  style={{ width: "100px", height: "100px" }}
                                />
                              ) : (
                                option.value
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="studTaskOptions">
                          {currentQuestion.options.map((option, idx) => (
                            <li
                              key={idx}
                              className={`studTaskOption ${
                                selectedOption === option.id
                                  ? "studTaskOptionSelected"
                                  : ""
                              }`}
                              onClick={() => {
                                handleOptionClick(option.id);
                              }}
                            >
                              {currentQuestion.question_type ===
                              "multiple_choice_images" ? (
                                <img
                                  src={option.value}
                                  alt={`option-${idx}`}
                                  style={{ width: "100px", height: "100px" }}
                                />
                              ) : (
                                option.value
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="navigationButtons">
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <progress
                  value={progress - 100 / questions.length}
                  max="100"
                  style={{ width: "60%", marginTop: "10px" }}
                ></progress>
                <button
                  onClick={
                    currentQuestionIndex === questions.length - 1
                      ? handleSubmit
                      : handleNextQuestion
                  }
                  disabled={
                    selectedOption === null && droppedOrder.length === 0
                  }
                  className={`${
                    currentQuestionIndex === questions.length - 1
                      ? ""
                      : "orangeButton"
                  }`}
                  style={{ float: "right" }}
                >
                  {currentQuestionIndex === questions.length - 1
                    ? t ('finish')
                    : t ('next')}
                </button>
              </span>
            </div>
          </div>
        </dialog>
      )}
      <audio ref={backgroundAudioRef} src={bgmusic} loop/>
      <audio ref={clickSoundRef} src={click_audio}></audio>
      <audio ref={correctSoundRef} src={correct_audio}></audio>
      <audio ref={incorrectSoundRef} src={incorrect_audio}></audio>

    </div>
  );
};

export default Math;
