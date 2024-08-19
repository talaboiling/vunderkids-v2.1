import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import bgmusic from "../../assets/audio/Kevin MacLeod_ Atlantean Twilight.mp3";
import click_audio from "../../assets/audio/click_sound.mp3";
import correct_audio from "../../assets/audio/correct_sound.mp3";
import incorrect_audio from "../../assets/audio/incorrect_sound.mp3";
import { useTranslation } from "react-i18next";
import Loader from "../Loader";
import {
  fetchUserData,
  fetchCourse,
  fetchSections,
  fetchTask,
  fetchQuestions,
  answerQuestion,
} from "../../utils/apiService";
import CourseCard from "./CourseCard";
import SectionContent from "./SectionContent";
import VideoModal from "./VideoModal";
import TaskModal from "./TaskModal";
import SubscriptionErrorModal from "./SubscriptionErrorModal";
import LessonProgress from "./LessonProgress";

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
  const [droppedOrder, setDroppedOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const backgroundAudioRef = useRef(null);
  const clickSoundRef = useRef(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const [isBackgroundAudioPlaying, setIsBackgroundAudioPlaying] =
    useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [showSubscriptionError, setShowSubscriptionError] = useState(false);
  const [isProgramSwitched, setIsProgramSwitched] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    setLoading(true);
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
      setSections(sectionsData);
      setCourse(courseData);
      setUser(userData);
      setHasSubscription(userData.has_subscription);
      setIsFreeTrial(userData.is_free_trial);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openVideoModal = (url) => {
    if (!isFreeTrial && !hasSubscription) {
      setShowSubscriptionError(true);
      return;
    }
    const embedUrl = url.replace("watch?v=", "embed/");
    setVideoUrl(embedUrl);
    setShowVideoModal(true);
  };

  const openTaskModal = async (sectionId, taskId) => {
    if (!isFreeTrial && !hasSubscription) {
      setShowSubscriptionError(true);
      return;
    }
    try {
      const task = await fetchTask(courseId, sectionId, taskId, childId);
      const taskQuestions = await fetchQuestions(
        courseId,
        task.section,
        taskId,
        childId
      );
      if (taskQuestions.length === 0) {
        alert(t("noQuestions"));
        return;
      }
      setTaskContent(task);
      setQuestions(taskQuestions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setDroppedOrder(
        new Array(taskQuestions[0].correct_answer.length).fill(null)
      ); // Initialize droppedOrder with the correct length
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
    if (clickSoundRef.current) {
      clickSoundRef.current.play();
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedOrder = Array.from(droppedOrder);
    const [movedItem] = updatedOrder.splice(result.source.index, 1);
    updatedOrder.splice(result.destination.index, 0, movedItem);
    setDroppedOrder(updatedOrder);
  };

  const handleNextQuestion = async () => {
    setIsButtonDisabled(true);
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

    try {
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
        setDroppedOrder(
          new Array(
            questions[currentQuestionIndex + 1]?.correct_answer.length
          ).fill(null)
        );
        setIsButtonDisabled(false);
      }, 1500);
    } catch (error) {
      console.error("Error answering question:", error);
      alert(
        "An error occurred while submitting your answer. Please try again."
      );
      setIsButtonDisabled(false);
    }
  };

  const handleSubmit = async () => {
    setIsButtonDisabled(true);
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

    try {
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
        if (backgroundAudioRef.current) {
          backgroundAudioRef.current.pause();
          backgroundAudioRef.current.currentTime = 0;
          setIsBackgroundAudioPlaying(false);
        }
        setIsButtonDisabled(false);
      }, 1500);

      await loadData();
    } catch (error) {
      console.error("Error answering question:", error);
      alert(
        "An error occurred while submitting your answer. Please try again."
      );
      setIsButtonDisabled(false);
    }
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
      audioElement.addEventListener("ended", handleAudioEnded);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleAudioEnded);
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
    return <Loader />;
  }

  return (
    <div className="rtdash rtrat mathLesson">
      <Sidebar className="courseSidebar" isMenuOpen={isMenuOpen} />
      <div className="centralLessons">
        <div className="centralLessonsInner maths">
          <Navdash
            starCount={user.stars}
            cupCount={user.cups}
            gradeNum={user.grade}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isProgramSwitched={isProgramSwitched}
            setIsProgramSwitched={setIsProgramSwitched}
            urlPath={"lesson"}
          />
        </div>
        <div className="ratingCentral">
          <div className="lessonsMain">
            <div className="coursesCards">
              <CourseCard course={course} t={t} />
            </div>
            <SectionContent
              sections={sections}
              openVideoModal={openVideoModal}
              openTaskModal={openTaskModal}
              hasSubscription={hasSubscription}
              t={t}
            />
          </div>
          <div className={`lessonsProg ${isProgramSwitched ? "activeProgram" : ""}`}>
            <LessonProgress 
              sections={sections}
              t={t}
            />
          </div>
        </div>
      </div>

      {showVideoModal && (
        <VideoModal
          videoUrl={videoUrl}
          closeVideoModal={closeVideoModal}
          t={t}
        />
      )}

      {showTaskModal && (
        <TaskModal
          user={user}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          feedbackMessage={feedbackMessage}
          showFeedback={showFeedback}
          toggleAudio={toggleAudio}
          isAudioPlaying={isAudioPlaying}
          isMuted={isMuted}
          toggleMute={toggleMute}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          handleOptionClick={handleOptionClick}
          handleDragEnd={handleDragEnd}
          droppedOrder={droppedOrder}
          handleSubmit={handleSubmit}
          handleNextQuestion={handleNextQuestion}
          closeTaskModal={closeTaskModal}
          t={t}
          isButtonDisabled={isButtonDisabled}
        />
      )}

      {showSubscriptionError && (
        <SubscriptionErrorModal
          setShowSubscriptionError={setShowSubscriptionError}
          t={t}
        />
      )}

      <audio ref={backgroundAudioRef} src={bgmusic} loop />
      <audio ref={clickSoundRef} src={click_audio}></audio>
      <audio ref={correctSoundRef} src={correct_audio}></audio>
      <audio ref={incorrectSoundRef} src={incorrect_audio}></audio>
    </div>
  );
};

export default Math;
