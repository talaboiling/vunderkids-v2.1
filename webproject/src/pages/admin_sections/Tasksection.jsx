import React, { useEffect, useState } from "react";
import Superside from "../admin_components/Superside";
import { useParams, Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
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
  updateQuestion,
  deleteQuestion,
} from "../../utils/apiService";

const Tasksection = () => {
  const { courseId, sectionId } = useParams();
  const [contents, setContents] = useState([]);
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
  });
  const [videoDetails, setVideoDetails] = useState({
    video_url: "",
    title: "",
    description: "",
  });
  const [questions, setQuestions] = useState([]);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    question_type: "multiple_choice_text",
    template: "",
    title: "",
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [isEditingVideo, setIsEditingVideo] = useState(false);

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

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      ...taskDetails,
      section: sectionId,
      order: contents.length + 1,
    };
  
    try {
      let updatedContents;
      if (isEditingTask) {
        const updatedTask = await updateTask(courseId, sectionId, contents[selectedTaskIndex].id, taskData);
        updatedContents = contents.map((content, index) =>
          index === selectedTaskIndex ? updatedTask : content
        );
      } else {
        const newTask = await createTask(courseId, sectionId, taskData);
        updatedContents = [...contents, newTask];
      }
  
      setContents(updatedContents);
      setShowTaskModal(false);
      resetTaskDetails();
    } catch (error) {
      console.error("Failed to create or update task", error);
    }
  };

  const handleEditTask = (index) => {
    const task = contents[index];
    setSelectedTaskIndex(index);
    setTaskDetails({
      title: task.title,
      description: task.description,
    });
    setIsEditingTask(true);
    setShowTaskModal(true);
  };
  

  const resetTaskDetails = () => {
    setTaskDetails({
      title: "",
      description: "",
    });
    setIsEditingTask(false);
  };  

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

  const openLesson = (index) => {
    const lesson = contents[index];
    if (lesson.video_url) {
      window.open(lesson.video_url, "_blank");
    }
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

  const fetchTaskQuestions = async (taskId) => {
    const response = await fetchQuestions(courseId, sectionId, taskId);
    return response;
  };

  const handleTaskClick = async (index) => {
    const taskId = contents[index].id;
    setSelectedTaskIndex(index);
    setLoading(true);
    try {
      const taskQuestions = await fetchTaskQuestions(taskId);
      setQuestions(taskQuestions);
      setShowQuestionsModal(true);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };

const handleQuestionSubmit = async (e) => {
  e.preventDefault();

  // Format options to ensure they have the correct id and value structure
  const formattedOptions = currentQuestion.options.map((option, idx) => ({
    id: idx + 1,
    value: typeof option === 'string' ? option : option.value,
  }));

  const questionData = {
    ...currentQuestion,
    options: formattedOptions,
    correct_answer: currentQuestion.correct_answer,
  };

  try {
    if (editingQuestionIndex !== null) {
      await updateQuestion(courseId, sectionId, contents[selectedTaskIndex].id, questions[editingQuestionIndex].id, questionData);
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = questionData;
      setQuestions(updatedQuestions);
    } else {
      const newQuestion = await createQuestion(courseId, sectionId, contents[selectedTaskIndex].id, questionData);
      setQuestions([...questions, newQuestion]);
    }
    setShowQuestionModal(false);
    setCurrentQuestion({
      question_type: "multiple_choice_text",
      template: "",
      title: "",
      question_text: "",
      options: ["", "", "", ""],
      correct_answer: "",
    });
    setEditingQuestionIndex(null);
  } catch (error) {
    console.error("Failed to save question", error);
  }
};

  const handleSelectCorrectAnswer = (optionIndex) => {
    setCurrentQuestion({
      ...currentQuestion,
      correct_answer: optionIndex + 1, // Store as a 1-based index
    });
  };
  
  const handleEditQuestion = (index) => {
    const question = questions[index];
    const formattedOptions = question.options.map(opt => opt.value); // Extract values from options
    setCurrentQuestion({
      ...question,
      options: formattedOptions,
      correct_answer: question.correct_answer, // Set the correct answer to the index
    });
    setEditingQuestionIndex(index);
    setShowQuestionModal(true);
  };  

  const handleEditContent = (index) => {
    const content = contents[index];
    setSelectedTaskIndex(index);
    setVideoDetails(content);
    setIsEditingVideo(true);
    setShowVideoModal(true);
  };

  const handleDeleteQuestion = async (index) => {
    const questionId = questions[index].id;
    try {
      await deleteQuestion(courseId, sectionId, contents[selectedTaskIndex].id, questionId);
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Failed to delete question", error);
    }
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
                    <div className={`contentTitle ${content.title.length > 20 ? "title-slider" : ""}`}>
                      <div className="title-slide">
                        <p style={{margin:"0"}}>{content.title}</p>
                      </div>
                    </div>
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
                    <div className="contentTitle">
                      <div className="title-slide">
                        <p style={{margin:"0"}}>{content.title}</p>
                      </div>
                    </div>
                    <div className="taskHover">
                      <p>
                        <strong>Описание:</strong> {content.description}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTask(index);
                      }}
                      className="deleteBtn editBtn"
                    >
                      <EditIcon sx={{ color: "black" }} />
                    </button>
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
                setTaskDetails({
                  title: "",
                  description: "",
                });
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
            <div className="modalHeader">
              <h2 className="defaultStyle" style={{ color: "#666" }}>
                {isEditingVideo
                  ? "Редактировать видеоурок"
                  : "Добавить видеоурок"}
              </h2>
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
            </div>
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
            <div className="modalHeader">
              <h2 className="defaultStyle" style={{ color: "#666" }}>
                Добавить задание
              </h2>
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
            </div>
            <form onSubmit={handleTaskSubmit}>
              <div className="formVideo">
                <span>
                  <label htmlFor="taskTitle">Название задания:</label>
                  <br />
                  <input
                    type="text"
                    id="taskTitle"
                    value={taskDetails.title}
                    onChange={(e) =>
                      setTaskDetails({
                        ...taskDetails,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </span>
                <span style={{ marginLeft: "2rem" }}>
                  <label htmlFor="taskDescription">Описание задания:</label>
                  <br />
                  <textarea
                    id="taskDescription"
                    value={taskDetails.description}
                    onChange={(e) =>
                      setTaskDetails({
                        ...taskDetails,
                        description: e.target.value,
                      })
                    }
                    style={{ width: "300px", height: "40px" }}
                  />
                  <br />
                </span>
              </div>
              <button
                type="submit"
                className="superBtn"
                style={{ marginTop: "30px" }}
              >
                Создать
              </button>
            </form>
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
            <div className="modalHeader">
              <h2 className="defaultStyle" style={{ color: "#666" }}>
                Вопросы задания
              </h2>
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
            </div>
            <div className="questionsList">
              {selectedTaskIndex !== null && questions.length > 0 && (
                <ul>
                  {questions.map((question, index) => (
                    <li
                      key={index}
                      onClick={() => handleEditQuestion(index)}
                      className="questions"
                    >
                      {question.title || `Вопрос ${index + 1}`}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(index);
                        }}
                        className="transBtn"
                        style={{ paddingTop: "3px" }}
                      >
                        <DeleteForeverIcon sx={{ color: "darkred" }} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => {
                  setCurrentQuestion({
                    question_type: "multiple_choice_text",
                    template: "",
                    title: "",
                    question_text: "",
                    options: ["", "", "", ""],
                    correct_answer: "",
                  });
                  setEditingQuestionIndex(null);
                  setShowQuestionModal(true);
                }}
                className="adderBtn"
                style={{ marginTop: "20px" }}
              >
                Добавить вопрос
              </button>
            </div>
          </div>
        </dialog>
      )}

      {showQuestionModal && (
        <dialog
          open={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
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
              onClick={() => setShowQuestionModal(false)}
            >
              <CloseIcon sx={{ color: "gray" }} />
            </button>
            <h2 className="defaultStyle" style={{ color: "#666" }}>
              {editingQuestionIndex !== null ? "Редактировать вопрос" : "Добавить вопрос"}
            </h2>
            <div className="taskConstructor">
              <div className="taskPreview">
                <p
                  className="defaultStyle"
                  style={{ margin: "0", padding: "20px", maxWidth:"500px", maxHeight:"70px", fontSize: "large", textWrap:"wrap", textOverflow:"ellipsis", textAlign:"center"}}
                >
                  {currentQuestion.title}
                </p>
                <div className="previewContent">
                  <p style={{ margin: "0", fontSize: "xx-large", maxWidth:"500px", maxHeight:"105px", textWrap:"wrap", textOverflow:"ellipsis", textAlign:"center"}}>
                    {currentQuestion.question_text}
                  </p>
                  <div className="previewOptions">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`previewOption ${
                          currentQuestion.correct_answer === index + 1 ? "correct-answer" : ""
                        }`}
                        onClick={() => handleSelectCorrectAnswer(index)}
                      >
                        {typeof option === 'string' ? option : option.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="taskDetails">
                <form onSubmit={handleQuestionSubmit}>
                  <div className="formConstructor">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "2rem",
                        width:"60%",
                        marginBottom: "40px",
                      }}
                      >
                        <h3 className="defaultStyle" style={{ color: "#666" }}>
                          Выберите тип задачи
                        </h3>
                        <input
                          list="questiontype"
                          id="questionType"
                          placeholder="Выбор правильного ответа"
                          style={{margin:"0"}}
                          value={currentQuestion.question_type}
                          onChange={(e) =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              question_type: e.target.value,
                            })
                          }
                          required
                        />
                        <datalist id="questiontype">
                          <option value="multiple_choice_text" />
                          <option value="text_input" />
                          <option value="file_upload" />
                        </datalist>
                        
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
                          margin:"0"
                        }}
                      >
                        <li
                          className={`bgitem ${
                            currentQuestion.template === "1"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentQuestion({ ...currentQuestion, template: "1" })
                          }
                        >
                          1
                        </li>
                        <li
                          className={`bgitem ${
                            currentQuestion.template === "2"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentQuestion({ ...currentQuestion, template: "2" })
                          }
                        >
                          2
                        </li>
                        <li
                          className={`bgitem ${
                            currentQuestion.template === "3"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentQuestion({ ...currentQuestion, template: "3" })
                          }
                        >
                          3
                        </li>
                        <li
                          className={`bgitem ${
                            currentQuestion.template === "4"
                              ? "selected-template"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentQuestion({ ...currentQuestion, template: "4" })
                          }
                        >
                          4
                        </li>
                      </ul>
                    </div>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "2rem",
                        marginBottom: "40px",
                      }}
                    >
                      <span>
                        <h3 className="defaultStyle" style={{color:"#666"}}>Название вопроса</h3>
                        <input
                          type="text"
                          id="questionTitle"
                          placeholder="Задание по арифметике"
                          value={currentQuestion.title}
                          onChange={(e) =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </span>
                      
                      <span>
                        <h3 className="defaultStyle" style={{color:"#666"}}>Описание вопроса</h3>
                        <input
                          id="questionText"
                          value={currentQuestion.question_text}
                          placeholder="Ваш вопрос"
                          onChange={(e) =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              question_text: e.target.value,
                            })
                          }                          
                          required
                        />
                      </span>
                    </span>
                    
                    <h3 className="defaultStyle" style={{color:"#666"}}>Варианты ответа (напишите и нажмите на правильный)</h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                      }}
                    >
                      {currentQuestion.options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          placeholder={`Вариант ${index + 1}`}
                          value={typeof option === 'string' ? option : option.value}
                          onChange={(e) => {
                            const updatedOptions = [...currentQuestion.options];
                            updatedOptions[index] = e.target.value;
                            setCurrentQuestion({
                              ...currentQuestion,
                              options: updatedOptions,
                            });
                          }}
                          style={{ margin: "0" }}
                          className={
                            currentQuestion.correct_answer === index + 1
                              ? "correct-answer"
                              : ""
                          }
                          onClick={() => handleSelectCorrectAnswer(index)}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="superBtn"
                    style={{ marginTop: "30px" }}
                  >
                    {editingQuestionIndex !== null ? "Сохранить" : "Добавить"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Tasksection;
