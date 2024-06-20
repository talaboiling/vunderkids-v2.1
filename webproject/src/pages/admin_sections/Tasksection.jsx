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
import Loader from "../Loader";
import {
  fetchContents,
  createLesson,
  updateLesson,
  deleteLesson,
  createTask,
  updateTask,
  deleteTask,
  fetchSection,
  fetchCourse,
  fetchQuestions,
  createQuestion,
} from "../../utils/apiService";

const Tasksection = () => {
  const { courseId, sectionId } = useParams();
  const [contents, setContents] = useState([]);
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoDetails, setVideoDetails] = useState({
    video_url: "",
    title: "",
    description: "",
  });
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    questions: [
      {
        question_type: "multiple_choice_text",
        template: "",
        title: "",
        question_text: "",
        options: ["", "", "", ""],
        correct_answer: "",
      },
    ],
  });
  const [questions, setQuestions] = useState([]);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [showQuestionDetailsModal, setShowQuestionDetailsModal] = useState(false);

  useEffect(() => {
    const fetchContentsData = async () => {
      try {
        const contentsData = await fetchContents(courseId, sectionId);
        setContents(contentsData);
        const sectionData = await fetchSection(courseId, sectionId);
        setSection(sectionData);
        const courseData = await fetchCourse(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error("Failed to fetch contents", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentsData();
  }, [courseId, sectionId]);

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const updatedVideoDetails = {
      ...videoDetails,
      content_type: "lesson",
      order: contents.length + 1,
      section: sectionId,
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

  const handleAnswerChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...taskDetails.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    updatedQuestions[questionIndex].options = updatedOptions;
    setTaskDetails({ ...taskDetails, questions: updatedQuestions });
  };

  const handleSelectCorrectAnswer = (questionIndex, optionIndex) => {
    const updatedQuestions = [...taskDetails.questions];
    updatedQuestions[questionIndex].correct_answer =
      updatedQuestions[questionIndex].options[optionIndex];
    setTaskDetails({ ...taskDetails, questions: updatedQuestions });
  };

  const openLesson = (index) => {
    const lesson = contents[index];
    if (lesson.video_url) {
      window.open(lesson.video_url, "_blank");
    }
  };

  const handleEditContent = (index) => {
    const content = contents[index];
    setSelectedTaskIndex(index);
    setVideoDetails(content);
    setIsEditingVideo(true);
    setShowVideoModal(true);
  };

  const fetchTaskQuestions = async (courseId, sectionId, taskId) => {
    const response = await fetchQuestions(courseId, sectionId, taskId);
    return response;
  };

  const handleTaskClick = async (index) => {
    const taskId = contents[index].id;
    setSelectedTaskIndex(index);
    setLoading(true);
    try {
      const taskQuestions = await fetchTaskQuestions(courseId, sectionId, taskId);
      setQuestions(taskQuestions);
      setShowQuestionsModal(true);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const updatedQuestions = [...taskDetails.questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      is_attempted: false,
      is_correct: false,
      images: [],
    };
    setTaskDetails({ ...taskDetails, questions: updatedQuestions });
    setCurrentQuestionIndex(updatedQuestions.length);
  };

  const nextQuestion = () => {
    const updatedQuestions = [...taskDetails.questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      is_attempted: false,
      is_correct: false,
      images: [],
    };
    setTaskDetails({ ...taskDetails, questions: updatedQuestions });
    if (currentQuestionIndex < questions.length - 1) {
      loadQuestion(currentQuestionIndex + 1);
    } else {
      resetTaskDetails();
      setCurrentQuestionIndex(questions.length);
    }
  };

  const handleFinishTasks = async () => {
    const taskData = {
      title: taskDetails.title,
      description: taskDetails.description || "",
      section: sectionId,
      order: contents.length + 1,
    };

    let updatedContents;
    let taskId;

    if (isEditingTask) {
      const updatedTask = await updateTask(
        courseId,
        sectionId,
        contents[editingTaskIndex].id,
        taskData
      );
      taskId = updatedTask.id;
      updatedContents = contents.map((content, index) =>
        index === editingTaskIndex ? updatedTask : content
      );
    } else {
      const newTask = await createTask(courseId, sectionId, taskData);
      taskId = newTask.id;
      updatedContents = [...contents, newTask];
    }

    const questionPromises = taskDetails.questions.map(async (question) => {
      const questionData = {
        is_attempted: false,
        is_correct: false,
        images: [],
        title: question.title,
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options.map((option, idx) => ({
          id: idx + 1,
          value: option,
        })),
        correct_answer: question.options.indexOf(question.correct_answer) + 1,
        template: question.template,
        task: taskId,
      };

      return await createQuestion(courseId, sectionId, taskId, questionData);
    });

    await Promise.all(questionPromises);

    setContents(updatedContents);
    setShowTaskModal(false);
    setQuestions([]);
    resetTaskDetails();
    setIsEditingTask(false);
    setCurrentQuestionIndex(0);
  };

  const resetTaskDetails = () => {
    setTaskDetails({
      title: "",
      questions: [
        {
          question_type: "multiple_choice_text",
          template: "",
          title: "",
          question_text: "",
          options: ["", "", "", ""],
          correct_answer: "",
        },
      ],
    });
  };

  if (loading) {
    return <Loader />;
  }

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
            {section.title}
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
            {course.name} ({course.grade} класс)
          </p>
        </div>

        <div className="superCont sectCont">
          {contents &&
            contents.map((content, index) => (
              <div key={index} className={`vidBlock ${content.content_type}`}>
                {content.content_type === "lesson" && (
                  <>
                    <div
                      className="thumbcontainer"
                      onClick={() => openLesson(index)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditContent(index);
                        }}
                        className="deleteBtn editBtn"
                      >
                        <EditIcon sx={{ color: "black" }} />
                      </button>
                      <img
                        src={bgvideo || "placeholder.png"}
                        alt={content.title}
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
                    <div className="taskHover">
                      <p>
                        <strong>Название:</strong> {content.title}
                      </p>
                      <p>
                        <strong>Описание:</strong> {content.description}
                      </p>
                    </div>
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
                      onClick={() => handleTaskClick(index)}
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
                resetTaskDetails(); // Reset task details for new entry
                setQuestions([]); // Reset questions for new task
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
                    value={videoDetails.video_url}
                    onChange={(e) =>
                      setVideoDetails({
                        ...videoDetails,
                        video_url: e.target.value,
                      })
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
                    value={videoDetails.title}
                    onChange={(e) =>
                      setVideoDetails({
                        ...videoDetails,
                        title: e.target.value,
                      })
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
              Добавить задание
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
                    {taskDetails.questions[currentQuestionIndex].question_text}
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
                        value={taskDetails.questions[currentQuestionIndex].question_type}
                        onChange={(e) => {
                          const updatedQuestions = [...taskDetails.questions];
                          updatedQuestions[currentQuestionIndex].question_type = e.target.value;
                          setTaskDetails({ ...taskDetails, questions: updatedQuestions });
                        }}
                      />
                      <datalist id="tasktype">
                        <option value="multiple_choice_text" />
                        <option value="text_input" />
                        <option value="file_upload" />
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
                            taskDetails.questions[currentQuestionIndex].template === "1"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() => {
                            const updatedQuestions = [...taskDetails.questions];
                            updatedQuestions[currentQuestionIndex].template = "1";
                            setTaskDetails({ ...taskDetails, questions: updatedQuestions });
                          }}
                        >
                          1
                        </li>
                        <li
                          className={`bgitem ${
                            taskDetails.questions[currentQuestionIndex].template === "2"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() => {
                            const updatedQuestions = [...taskDetails.questions];
                            updatedQuestions[currentQuestionIndex].template = "2";
                            setTaskDetails({ ...taskDetails, questions: updatedQuestions });
                          }}
                        >
                          2
                        </li>
                        <li
                          className={`bgitem ${
                            taskDetails.questions[currentQuestionIndex].template === "3"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() => {
                            const updatedQuestions = [...taskDetails.questions];
                            updatedQuestions[currentQuestionIndex].template = "3";
                            setTaskDetails({ ...taskDetails, questions: updatedQuestions });
                          }}
                        >
                          3
                        </li>
                        <li
                          className={`bgitem ${
                            taskDetails.questions[currentQuestionIndex].template === "4"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() => {
                            const updatedQuestions = [...taskDetails.questions];
                            updatedQuestions[currentQuestionIndex].template = "4";
                            setTaskDetails({ ...taskDetails, questions: updatedQuestions });
                          }}
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
                          htmlFor="taskTitle"
                          className="defaultStyle"
                          style={{ fontSize: "medium", color: "#666" }}
                        >
                          Текст сверху
                        </label>
                        <input
                          type="text"
                          id="taskTitle"
                          placeholder="Мой вопрос"
                          style={{ margin: "0" }}
                          value={taskDetails.title}
                          onChange={(e) => {
                            setTaskDetails({ ...taskDetails, title: e.target.value });
                          }}
                        />
                      </span>
                      <span>
                        <label
                          htmlFor="taskText"
                          className="defaultStyle"
                          style={{ fontSize: "medium", color: "#666" }}
                        >
                          Текст задачи
                        </label>
                        <input
                          type="text"
                          id="taskText"
                          placeholder="15 + 4 ="
                          style={{ margin: "0" }}
                          value={taskDetails.questions[currentQuestionIndex].question_text}
                          onChange={(e) => {
                            const updatedQuestions = [...taskDetails.questions];
                            updatedQuestions[currentQuestionIndex].question_text = e.target.value;
                            setTaskDetails({ ...taskDetails, questions: updatedQuestions });
                          }}
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
                      {taskDetails.questions[currentQuestionIndex].options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          placeholder={String.fromCharCode(97 + index)}
                          value={option}
                          style={{ margin: "0" }}
                          onChange={(e) =>
                            handleAnswerChange(currentQuestionIndex, index, e.target.value)
                          }
                          onClick={() => handleSelectCorrectAnswer(currentQuestionIndex, index)}
                          className={
                            taskDetails.questions[currentQuestionIndex].correct_answer === option
                              ? "correct-answer"
                              : ""
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: "40px" }}>
                    <button
                      type="button"
                      onClick={nextQuestion}
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
                      Сохранить
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
              {selectedTaskIndex !== null && questions.length > 0 && (
                <ul>
                  {questions.map((question, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setShowQuestionDetailsModal(true);
                      }}
                      style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}
                    >
                      {question.title || `Вопрос ${index + 1}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </dialog>
      )}

      {showQuestionDetailsModal && (
        <dialog
          open={showQuestionDetailsModal}
          onClose={() => setShowQuestionDetailsModal(false)}
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
              onClick={() => setShowQuestionDetailsModal(false)}
            >
              <CloseIcon sx={{ color: "gray" }} />
            </button>
            <h2 className="defaultStyle" style={{ color: "#666" }}>
              Детали вопроса
            </h2>
            <div className="questionDetails">
              <p><strong>Название:</strong> {questions[currentQuestionIndex].title}</p>
              <p><strong>Текст задачи:</strong> {questions[currentQuestionIndex].question_text}</p>
              <p><strong>Шаблон:</strong> {questions[currentQuestionIndex].template}</p>
              <p><strong>Тип задачи:</strong> {questions[currentQuestionIndex].question_type}</p>
              <p><strong>Варианты ответа:</strong></p>
              <ul>
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <li key={index} style={{ margin: "5px 0" }}>
                    {option.value} {questions[currentQuestionIndex].correct_answer === option.id && "(Correct)"}
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

export default Tasksection;
