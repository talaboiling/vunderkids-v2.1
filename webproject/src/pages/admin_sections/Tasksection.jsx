import React, { useEffect, useState } from "react";
import Superside from "../admin_components/Superside";
import { useParams, Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import bgtask from "../../assets/bgtask.svg";
import bgvideo from "../../assets/videolessonthumb.svg";
import axios from "axios";
import {
  fetchContents,
  createLesson,
  updateLesson,
  deleteLesson,
  createTask,
  updateTask,
  deleteTask,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../utils/apiService";

const Tasksection = () => {
  const { courseId, sectionId } = useParams();
  const [contents, setContents] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [videoDetails, setVideoDetails] = useState({
    url: "",
    name: "",
    description: "",
    thumbnail: "",
  });
  const [file, setFile] = useState(null);
  const [taskDetails, setTaskDetails] = useState({
    question_type: "",
    template: "",
    title: "",
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
  });
  const [questions, setQuestions] = useState([]);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  useEffect(() => {
    const fetchContentsData = async () => {
      try {
        const response = await fetchContents(courseId, sectionId);
        console.log(response);
        setContents(response);
      } catch (error) {
        console.error("Failed to fetch contents", error);
      }
    };

    fetchContentsData();
  }, [courseId, sectionId]);

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const updatedVideoDetails = {
      ...videoDetails,
      thumbnail: file ? URL.createObjectURL(file) : videoDetails.thumbnail,
    };

    let updatedContents;
    if (isEditingVideo) {
      const updatedLesson = await updateLesson(
        courseId,
        sectionId,
        contents[selectedTaskIndex].id,
        updatedVideoDetails
      );
      updatedContents = contents.map((content, index) =>
        index === selectedTaskIndex ? updatedLesson : content
      );
    } else {
      const newLesson = await createLesson(
        courseId,
        sectionId,
        updatedVideoDetails
      );
      updatedContents = [...contents, newLesson];
    }

    setContents(updatedContents);
    setShowVideoModal(false);
    resetVideoDetails();
  };

  const resetVideoDetails = () => {
    setVideoDetails({
      video_url: "",
      title: "",
      description: "",
    });
    setFile(null);
    setIsEditingVideo(false);
  };

  const handleDeleteContent = async (id, type) => {
    if (window.confirm("Вы действительно хотите удалить этот элемент?")) {
      let updatedContents;
      if (type === "lesson") {
        await deleteLesson(courseId, sectionId, id);
        updatedContents = contents.filter((content) => content.id !== id);
      } else if (type === "task") {
        await deleteTask(courseId, sectionId, id);
        updatedContents = contents.filter((content) => content.id !== id);
      }

      setContents(updatedContents);
    }
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = taskDetails;
    setQuestions(updatedQuestions);
    resetTaskDetails();
    setCurrentQuestionIndex(updatedQuestions.length);
  };

  const loadQuestion = (index) => {
    const question = questions[index];
    setTaskDetails({
      question_type: question.question_type,
      template: question.template,
      title: question.title,
      question_text: question.question_text,
      options: question.options,
      correct_answer: question.correct_answer,
    });
    setCurrentQuestionIndex(index);
  };

  const resetTaskDetails = () => {
    setTaskDetails({
      type: "",
      template: "",
      topText: "",
      taskText: "",
      answers: ["", "", "", ""],
      correctAnswer: "",
    });
  };

  const handleFinishTasks = async () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = taskDetails;
    const finalQuestions = updatedQuestions;

    let updatedContents;
    if (isEditingTask) {
      const updatedTask = await updateTask(
        courseId,
        sectionId,
        contents[editingTaskIndex].id,
        { questions: finalQuestions }
      );
      updatedContents = contents.map((content, index) =>
        index === editingTaskIndex ? updatedTask : content
      );
    } else {
      const newTask = await createTask(courseId, sectionId, {
        questions: finalQuestions,
      });
      updatedContents = [...contents, newTask];
    }

    setContents(updatedContents);
    setShowTaskModal(false);
    setQuestions([]);
    resetTaskDetails();
    setIsEditingTask(false);
    setCurrentQuestionIndex(0);
  };

  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...taskDetails.answers];
    newAnswers[index] = value;
    setTaskDetails({ ...taskDetails, answers: newAnswers });
  };

  const handleSelectCorrectAnswer = (index) => {
    setTaskDetails({
      ...taskDetails,
      correctAnswer: taskDetails.answers[index],
    });
  };

  const openContent = (index) => {
    setSelectedTaskIndex(index);
    setShowQuestionsModal(true);
    setCurrentQuestionIndex(0);
  };

  const handleEditContent = (index) => {
    const content = contents[index];
    if (content.content_type === "lesson") {
      setSelectedTaskIndex(index);
      setVideoDetails(content);
      setIsEditingVideo(true);
      setShowVideoModal(true);
    } else if (content.content_type === "task") {
      setEditingTaskIndex(index);
      setQuestions(content.questions);
      setIsEditingTask(true);
      setShowTaskModal(true);
    }
  };

  const nextQuestion = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = taskDetails;
    setQuestions(updatedQuestions);
    if (currentQuestionIndex < questions.length - 1) {
      loadQuestion(currentQuestionIndex + 1);
    } else {
      resetTaskDetails();
      setCurrentQuestionIndex(questions.length);
    }
  };

  const prevQuestion = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = taskDetails;
    setQuestions(updatedQuestions);
    if (currentQuestionIndex > 0) {
      loadQuestion(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain">
        <Link to={"/login"}>
          <button
            style={{
              border: "none",
              borderRadius: "4px",
              backgroundColor: "transparent",
              color: "#444",
              fontSize: "large",
              float: "right",
            }}
          >
            Выйти
          </button>
        </Link>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
            {sectionId}
          </p>
          <p
            className="defaultStyle"
            style={{
              padding: "10px 25px",
              borderRadius: "20px",
              backgroundColor: "lightgray",
              marginLeft: "20px",
            }}
          >
            {courseId}
          </p>
        </div>

        <div className="superCont sectCont">
          {contents &&
            contents.map((content, index) => (
              <div
                key={index}
                className={`contentBlock ${content.content_type}`}
                onClick={() => openContent(index)}
              >
                {content.content_type === "lesson" && (
                  <>
                    <div className="thumbcontainer">
                      <img
                        src={bgvideo || "placeholder.png"}
                        alt={content.name}
                        className="taskThumbnail"
                        onClick={() => openContent(index)}
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
                      Видеоурок
                    </p>
                  </>
                )}
                {content.content_type === "task" && (
                  <>
                    <img
                      src={bgtask}
                      alt=""
                      style={{
                        paddingTop: "20px",
                        scale: "1.3",
                        overflow: "hidden",
                      }}
                    />
                    <p
                      style={{
                        backgroundColor: "white",
                        margin: "0",
                        padding: "7px 40px",
                        borderRadius: "10px",
                      }}
                    >
                      Задание
                    </p>
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteContent(content.id, content.content_type);
                  }}
                  className="deleteBtn"
                >
                  <DeleteForeverIcon sx={{ color: "darkred" }} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditContent(index);
                  }}
                  className="deleteBtn editBtn"
                >
                  <EditIcon sx={{ color: "black" }} />
                </button>
              </div>
            ))}

          <div className="taskAdder">
            <button
              className="adderBtn"
              onClick={() => {
                setShowVideoModal(true);
                resetVideoDetails();
              }}
            >
              Видеоурок
            </button>
            <button
              className="adderBtn"
              onClick={() => {
                setShowTaskModal(true);
                resetTaskDetails();
                setQuestions([]);
              }}
            >
              Задание
            </button>
          </div>
        </div>
      </div>

      {showVideoModal && (
        <dialog
          open={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          className="modal supermodal"
          style={{ padding: "60px" }}
        >
          <div className="modal-content">
            <button
              style={{
                border: "none",
                float: "right",
                backgroundColor: "transparent",
                boxShadow: "none",
                padding: "0",
              }}
              onClick={() => setShowVideoModal(false)}
            >
              <CloseIcon sx={{ color: "gray" }} />
            </button>
            <h2 className="defaultStyle" style={{ color: "#666" }}>
              {isEditingVideo
                ? "Редактировать видеоурок"
                : "Добавить видеоурок"}
            </h2>
            <form onSubmit={handleVideoSubmit}>
              <div className="formVideo">
                <span>
                  <label htmlFor="videoUrl">URL видео:</label>
                  <br />
                  <input
                    type="text"
                    id="videoUrl"
                    value={videoDetails.url}
                    onChange={(e) =>
                      setVideoDetails({ ...videoDetails, url: e.target.value })
                    }
                    required
                  />
                </span>
                <span style={{ marginLeft: "2rem" }}>
                  <label htmlFor="videoName">Название видео:</label>
                  <br />
                  <input
                    type="text"
                    id="videoName"
                    value={videoDetails.name}
                    onChange={(e) =>
                      setVideoDetails({ ...videoDetails, name: e.target.value })
                    }
                    required
                  />
                </span>
                <span>
                  <label htmlFor="videoDescription">Описание:</label>
                  <br />
                  <textarea
                    id="videoDescription"
                    value={videoDetails.description}
                    onChange={(e) =>
                      setVideoDetails({
                        ...videoDetails,
                        description: e.target.value,
                      })
                    }
                    style={{ width: "300px", height: "100px" }}
                    required
                  />
                  <br />
                </span>
              </div>
              <button
                type="submit"
                className="superBtn"
                style={{ marginTop: "30px" }}
              >
                {isEditingVideo ? "Сохранить" : "Добавить"}
              </button>
            </form>
          </div>
        </dialog>
      )}

      {showTaskModal && (
        <dialog
          open={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          className="modal supermodal"
          style={{ padding: "60px" }}
        >
          <div className="modal-content">
            <button
              style={{
                border: "none",
                float: "right",
                backgroundColor: "transparent",
                boxShadow: "none",
                padding: "0",
              }}
              onClick={() => setShowTaskModal(false)}
            >
              <CloseIcon sx={{ color: "gray" }} />
            </button>
            <h2 className="defaultStyle" style={{ color: "#666" }}>
              {isEditingTask ? "Редактировать задание" : "Добавить задание"}
            </h2>
            <div className="taskConstructor">
              <div className="taskPreview">
                <p
                  className="defaultStyle"
                  style={{ margin: "0", padding: "40px", fontSize: "large" }}
                >
                  {taskDetails.title}
                </p>
                <div className="previewContent">
                  <p style={{ margin: "0", fontSize: "xx-large" }}>
                    {taskDetails.taskText}
                  </p>
                </div>
              </div>
              <div className="taskDetails">
                <form onSubmit={handleTaskSubmit} className="">
                  <div className="formConstructor">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "2rem",
                        width: "60%",
                        marginBottom: "40px",
                      }}
                    >
                      <h3 className="defaultStyle" style={{ color: "#666" }}>
                        Выберите тип задачи
                      </h3>
                      <input
                        list="tasktype"
                        placeholder="Выбор правильного ответа"
                        required
                        style={{ margin: "0" }}
                        value={taskDetails.type}
                        onChange={(e) =>
                          setTaskDetails({
                            ...taskDetails,
                            type: e.target.value,
                          })
                        }
                      />
                      <datalist id="tasktype">
                        <option value="Выбор правильного ответа" />
                        <option value="Ввод текста" />
                        <option value="Загрузка файла" />
                      </datalist>
                      <button
                        className="transBtn"
                        style={{
                          backgroundColor: "#aaa",
                          borderRadius: "7px",
                          padding: "8px",
                        }}
                      >
                        <AddIcon sx={{ color: "#333" }} />
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        marginBottom: "40px",
                      }}
                    >
                      <h3 className="defaultStyle" style={{ color: "#666" }}>
                        Выберите шаблон
                      </h3>
                      <ul
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "2rem",
                        }}
                      >
                        <li
                          className={`bgitem ${
                            taskDetails.template === "1"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setTaskDetails({ ...taskDetails, template: "1" })
                          }
                        >
                          1
                        </li>
                        <li
                          className={`bgitem ${
                            taskDetails.template === "2"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setTaskDetails({ ...taskDetails, template: "2" })
                          }
                        >
                          2
                        </li>
                        <li
                          className={`bgitem ${
                            taskDetails.template === "3"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setTaskDetails({ ...taskDetails, template: "3" })
                          }
                        >
                          3
                        </li>
                        <li
                          className={`bgitem ${
                            taskDetails.template === "4"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setTaskDetails({ ...taskDetails, template: "4" })
                          }
                        >
                          4
                        </li>
                      </ul>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                        marginBottom: "40px",
                      }}
                    >
                      <span>
                        <label
                          htmlFor=""
                          className="defaultStyle"
                          style={{ fontSize: "medium", color: "#666" }}
                        >
                          Текст сверху
                        </label>
                        <input
                          type="text"
                          placeholder="Мой вопрос"
                          style={{ margin: "0" }}
                          value={taskDetails.title}
                          onChange={(e) =>
                            setTaskDetails({
                              ...taskDetails,
                              title: e.target.value,
                            })
                          }
                        />
                      </span>
                      <span>
                        <label
                          htmlFor=""
                          className="defaultStyle"
                          style={{ fontSize: "medium", color: "#666" }}
                        >
                          Текст задачи
                        </label>
                        <input
                          type="text"
                          placeholder="15 + 4 ="
                          style={{ margin: "0" }}
                          value={taskDetails.question_text}
                          onChange={(e) =>
                            setTaskDetails({
                              ...taskDetails,
                              question_text: e.target.value,
                            })
                          }
                        />
                      </span>
                    </div>
                    <label
                      htmlFor=""
                      className="defaultStyle"
                      style={{ fontSize: "medium", color: "#666" }}
                    >
                      Варианты ответа (напишите и нажмите на правильный)
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                      }}
                    >
                      {taskDetails.answers.map((answer, index) => (
                        <input
                          key={index}
                          type="text"
                          placeholder={String.fromCharCode(97 + index)}
                          value={answer}
                          style={{ margin: "0" }}
                          onChange={(e) =>
                            handleAnswerChange(index, e.target.value)
                          }
                          onClick={() => handleSelectCorrectAnswer(index)}
                          className={
                            taskDetails.correct_answer === answer
                              ? "correct-answer"
                              : ""
                          }
                        />
                      ))}
                    </div>
                    <div className="questionNavigation">
                      <button
                        type="button"
                        onClick={prevQuestion}
                        className="transBtn"
                        disabled={currentQuestionIndex === 0}
                      >
                        <ArrowBackIosNewIcon />
                        <p className="defaultStyle">Prev</p>
                      </button>
                      <button
                        type="button"
                        onClick={nextQuestion}
                        className="transBtn"
                        disabled={currentQuestionIndex >= questions.length - 1}
                      >
                        <ArrowForwardIosIcon />
                        <p className="defaultStyle">Next</p>
                      </button>
                    </div>
                  </div>
                  <div style={{ marginTop: "40px" }}>
                    <button
                      type="button"
                      onClick={handleTaskSubmit}
                      className="superBtn"
                      style={{
                        backgroundColor: "#D5E5EE",
                        marginRight: "20px",
                      }}
                    >
                      Добавить еще
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishTasks}
                      className="superBtn"
                    >
                      {isEditingTask ? "Сохранить" : "Закончить"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </dialog>
      )}

      {showQuestionsModal && (
        <dialog
          open={showQuestionsModal}
          onClose={() => setShowQuestionsModal(false)}
          className="modal supermodal"
          style={{ padding: "60px" }}
        >
          <div className="modal-content">
            <button
              style={{
                border: "none",
                float: "right",
                backgroundColor: "transparent",
                boxShadow: "none",
                padding: "0",
              }}
              onClick={() => setShowQuestionsModal(false)}
            >
              <CloseIcon sx={{ color: "gray" }} />
            </button>
            <h2 className="defaultStyle" style={{ color: "#666" }}>
              Все вопросы
            </h2>
            <div className="questionsList">
              {selectedTaskIndex !== null &&
                contents[selectedTaskIndex].questions &&
                contents[selectedTaskIndex].questions.length > 0 && (
                  <>
                    <div className="questionItem">
                      <p>
                        <strong>Вопрос {currentQuestionIndex + 1}:</strong>
                      </p>
                      <p>
                        <strong>Тип задачи:</strong>{" "}
                        {
                          contents[selectedTaskIndex].questions[
                            currentQuestionIndex
                          ].question_type
                        }
                      </p>
                      <p>
                        <strong>Шаблон:</strong>{" "}
                        {
                          contents[selectedTaskIndex].questions[
                            currentQuestionIndex
                          ].template
                        }
                      </p>
                      <p>
                        <strong>Текст сверху:</strong>{" "}
                        {
                          contents[selectedTaskIndex].questions[
                            currentQuestionIndex
                          ].title
                        }
                      </p>
                      <p>
                        <strong>Текст задачи:</strong>{" "}
                        {
                          contents[selectedTaskIndex].questions[
                            currentQuestionIndex
                          ].question_text
                        }
                      </p>
                      <p>
                        <strong>Варианты ответа:</strong>{" "}
                        {contents[selectedTaskIndex].questions[
                          currentQuestionIndex
                        ].answers.join(", ")}
                      </p>
                      <p>
                        <strong>Правильный ответ:</strong>{" "}
                        {
                          contents[selectedTaskIndex].questions[
                            currentQuestionIndex
                          ].correct_answer
                        }
                      </p>
                    </div>
                    <div className="questionNavigation">
                      <button onClick={prevQuestion} className="transBtn">
                        <ArrowBackIosNewIcon />
                        <p className="defaultStyle">Prev</p>
                      </button>
                      <button onClick={nextQuestion} className="transBtn">
                        <ArrowForwardIosIcon />
                        <p className="defaultStyle">Next</p>
                      </button>
                    </div>
                  </>
                )}
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Tasksection;
