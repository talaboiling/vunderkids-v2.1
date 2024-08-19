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
  const { courseId, sectionId, chapterId } = useParams();
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
    question_type: "",
    template: "",
    title: "",
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
    images: ["", "", "", ""],
    drag_answers: ["", "", "", ""],
    imagesToUpdate: {},
    audio: null, // Add this line
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [isEditingVideo, setIsEditingVideo] = useState(false);

  useEffect(() => {
    const fetchContentsData = async () => {
      try {
        const contentsData = await fetchContents(
          courseId,
          sectionId,
          chapterId
        );
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
        const updatedTask = await updateTask(
          courseId,
          sectionId,
          contents[selectedTaskIndex].id,
          taskData
        );
        updatedContents = contents.map((content, index) =>
          index === selectedTaskIndex ? updatedTask : content
        );
      } else {
        const newTask = await createTask(
          courseId,
          sectionId,
          chapterId,
          taskData
        );
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
        chapterId,
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
        chapterId,
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
        await deleteLesson(courseId, sectionId, chapterId, id);
        updatedContents = contents.filter((content) => content.id !== id);
      } else if (type === "task") {
        await deleteTask(courseId, sectionId, chapterId, id);
        updatedContents = contents.filter((content) => content.id !== id);
      }

      setContents(updatedContents);
    }
  };

  const fetchTaskQuestions = async (taskId) => {
    const response = await fetchQuestions(
      courseId,
      sectionId,
      chapterId,
      taskId
    );
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
    setLoading(true);

    const formData = new FormData();
    formData.append("title", currentQuestion.title);
    formData.append("question_text", currentQuestion.question_text);
    formData.append("question_type", currentQuestion.question_type);
    formData.append("template", currentQuestion.template);
    if (currentQuestion.audio && currentQuestion.audio instanceof File) {
      formData.append("audio", currentQuestion.audio);
    }

    if (currentQuestion.question_type === "multiple_choice_text") {
      const options = currentQuestion.options.map((option, idx) => ({
        id: idx + 1,
        value: option,
      }));
      formData.append("options", JSON.stringify(options));
      formData.append("correct_answer", currentQuestion.correct_answer);
    }

    if (currentQuestion.question_type === "multiple_choice_images") {
      if (Object.keys(currentQuestion.imagesToUpdate || {}).length > 0) {
        Object.keys(currentQuestion.imagesToUpdate).forEach((key) => {
          formData.append(`image_${key}`, currentQuestion.imagesToUpdate[key]);
        });
      }
      formData.append("correct_answer", currentQuestion.correct_answer);
    }

    if (currentQuestion.question_type === "drag_and_drop_text") {
      const options = currentQuestion.options.map((option, idx) => ({
        id: idx + 1,
        value: option,
      }));
      formData.append("options", JSON.stringify(options));
      const filteredDragAnswers = currentQuestion.drag_answers
        .map((order, idx) => {
          const orderNum = parseInt(order, 10);
          return order !== "" &&
            orderNum > 0 &&
            orderNum <= currentQuestion.options.length
            ? { order: orderNum, id: idx + 1 }
            : null;
        })
        .filter((answer) => answer !== null)
        .sort((a, b) => a.order - b.order)
        .map((answer) => answer.id);
      formData.append("correct_answer", JSON.stringify(filteredDragAnswers));
    }

    if (currentQuestion.question_type === "drag_and_drop_images") {
      if (Object.keys(currentQuestion.imagesToUpdate || {}).length > 0) {
        Object.keys(currentQuestion.imagesToUpdate).forEach((key) => {
          formData.append(`image_${key}`, currentQuestion.imagesToUpdate[key]);
        });
      }
      const filteredDragAnswers = currentQuestion.drag_answers
        .map((order, idx) => {
          const orderNum = parseInt(order, 10);
          return order !== "" &&
            orderNum > 0 &&
            orderNum <= currentQuestion.images.length
            ? { order: orderNum, id: idx + 1 }
            : null;
        })
        .filter((answer) => answer !== null)
        .sort((a, b) => a.order - b.order)
        .map((answer) => answer.id);
      formData.append("correct_answer", JSON.stringify(filteredDragAnswers));
    }

    try {
      let response;
      if (editingQuestionIndex !== null) {
        response = await updateQuestion(
          courseId,
          sectionId,
          chapterId,
          contents[selectedTaskIndex].id,
          questions[editingQuestionIndex].id,
          formData,
          true // Indicate that this is a multipart request
        );
        const updatedQuestions = questions.map((q, i) =>
          i === editingQuestionIndex ? response : q
        );
        setQuestions(updatedQuestions);
      } else {
        response = await createQuestion(
          courseId,
          sectionId,
          chapterId,
          contents[selectedTaskIndex].id,
          formData,
          true // Indicate that this is a multipart request
        );
        setQuestions([...questions, response]);
      }
      setShowQuestionModal(false);
      resetQuestionForm();
    } catch (error) {
      console.error("Failed to save question", error);
    } finally {
      setLoading(false);
    }
  };

  const resetQuestionForm = () => {
    setCurrentQuestion({
      question_type: "multiple_choice_text",
      template: "",
      title: "",
      question_text: "",
      options: ["", "", "", ""],
      correct_answer: "",
      images: ["", "", "", ""],
      drag_answers: ["", "", "", ""],
      audio: null,
    });
    setEditingQuestionIndex(null);
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];

    // Update the currentQuestion options with the new file
    const updatedImages = [...currentQuestion.options];
    updatedImages[index] = file;

    // Append the new file to imagesToUpdate
    const updatedImagesToUpdate = {
      ...currentQuestion.imagesToUpdate,
      [index + 1]: file,
    };

    setCurrentQuestion({
      ...currentQuestion,
      options: updatedImages,
      imagesToUpdate: updatedImagesToUpdate,
    });
  };

  const handleSelectCorrectAnswer = (optionIndex) => {
    setCurrentQuestion({
      ...currentQuestion,
      correct_answer: optionIndex + 1, // Store as a 1-based index
    });
  };

  const handleEditQuestion = (index) => {
    const question = questions[index];
    console.log(question.audio);
    const formattedOptions = Array.isArray(question.options)
      ? question.options
      : [];
    const formattedImages = Array.isArray(question.images)
      ? question.images
      : [];

    setCurrentQuestion({
      ...question,
      options:
        formattedOptions.length > 0
          ? formattedOptions.map((opt) => opt.value)
          : ["", "", "", ""],
      images:
        formattedImages.length > 0
          ? formattedImages.map((img) => img.image)
          : ["", "", "", ""],
      correct_answer: question.correct_answer,
      drag_answers: Array.isArray(question.correct_answer)
        ? question.correct_answer
        : ["", "", "", ""],
      audio: question.audio || null, // Add this line
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
      await deleteQuestion(
        courseId,
        sectionId,
        chapterId,
        contents[selectedTaskIndex].id,
        questionId
      );
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

        <div className="superCont sectCont ">
          {contents &&
            contents.map((content, index) => (
              <div
                key={index}
                className={`vidBlock ${content.content_type} ${
                  content.template ? `template-${content.template}` : ""
                }`}
              >
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
                    <div
                      className={`contentTitle ${
                        content.title.length > 20 ? "title-slider" : ""
                      }`}
                    >
                      <div className="title-slide">
                        <p style={{ margin: "0" }}>{content.title}</p>
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
                    <div
                      className={`contentTitle ${
                        content.title.length > 15 ? "title-slider" : ""
                      }`}
                    >
                      <div className="title-slide">
                        <p style={{ margin: "0" }}>{content.title}</p>
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
                <label htmlFor="videoUrl">URL видео:</label>
                <label htmlFor="videoName">Название видео:</label>
                <input
                  type="text"
                  id="videoUrl"
                  value={videoDetails.video_url}
                  placeholder="https://www.youtube.com/watch?=..."
                  onChange={(e) =>
                    setVideoDetails({
                      ...videoDetails,
                      video_url: e.target.value,
                    })
                  }
                  required
                />

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
                <label htmlFor="taskTitle">Название задания:</label>
                <label htmlFor="taskDescription">Описание задания:</label>
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
          {loading ? (
            <Loader />
          ) : (
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
              <button
                onClick={() => {
                  setCurrentQuestion({
                    question_type: "",
                    template: "",
                    title: "",
                    question_text: "",
                    options: ["", "", "", ""],
                    correct_answer: "",
                    images: ["", "", "", ""],
                    drag_answers: ["", "", "", ""],
                  });
                  setEditingQuestionIndex(null);
                  setShowQuestionModal(true);
                }}
                className="adderBtn"
                style={{ marginTop: "20px" }}
              >
                Добавить вопрос
              </button>
              <div className="questionsList">
                {selectedTaskIndex !== null && questions.length > 0 && (
                  <ul>
                    {questions.map((question, index) => (
                      <li
                        key={index}
                        onClick={() => handleEditQuestion(index)}
                        className="questions"
                      >
                        <p className="defaultStyle">{index + 1}.</p>
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
              </div>
            </div>
          )}
        </dialog>
      )}

      {showQuestionModal && (
        <dialog
          open={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
          className="modal supermodal"
          style={{ padding: "60px" }}
        >
          {loading ? (
            <Loader />
          ) : (
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
                {editingQuestionIndex !== null
                  ? "Редактировать вопрос"
                  : "Добавить вопрос"}
              </h2>
              <div className="taskConstructor">
                <div
                  className={`taskPreview ${
                    currentQuestion.template
                      ? `template-${currentQuestion.template}`
                      : ""
                  }`}
                >
                  <p
                    className="defaultStyle"
                    style={{
                      margin: "0",
                      padding: "20px",
                      maxWidth: "500px",
                      maxHeight: "70px",
                      fontSize: "large",
                      textWrap: "wrap",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {currentQuestion.title}
                  </p>
                  <div className="previewContent">
                    <p
                      style={{
                        margin: "0",
                        fontSize: "xx-large",
                        maxWidth: "500px",
                        maxHeight: "105px",
                        textWrap: "wrap",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                      }}
                    >
                      {currentQuestion.question_text}
                    </p>
                    <div className="previewOptions">
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className={`previewOption ${
                            currentQuestion.correct_answer === index + 1
                              ? "correct-answer"
                              : ""
                          }`}
                          onClick={() => handleSelectCorrectAnswer(index)}
                        >
                          {currentQuestion.question_type ==
                          "multiple_choice_text" ? (
                            <p>{option}</p>
                          ) : (
                            <img
                              src={option}
                              alt={`Option ${index + 1}`}
                              style={{ width: "100px", height: "100px" }}
                            />
                          )}
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
                          marginBottom: "40px",
                          width: "80%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "60%",
                          }}
                        >
                          <h3
                            className="defaultStyle"
                            style={{ color: "#666" }}
                          >
                            Выберите тип задачи
                          </h3>

                          <select
                            list="questiontype"
                            id="questionType"
                            placeholder="Выбор правильного ответа"
                            style={{ margin: "0" }}
                            value={currentQuestion.question_type} // Add this line
                            onChange={(e) => {
                              setCurrentQuestion({
                                ...currentQuestion,
                                question_type: e.target.value,
                              });
                            }}
                            required
                          >
                            <option value="">Выберите тип задачи</option>
                            <option value="multiple_choice_text">
                              Выбор правильного ответа
                            </option>
                            <option value="multiple_choice_images">
                              Выбор правильного рисунка
                            </option>
                            <option value="drag_and_drop_text">
                              Драг н дроп текст
                            </option>
                            <option value="drag_and_drop_images">
                              Драг н дроп рисунки
                            </option>
                          </select>
                        </div>
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
                            margin: "0",
                          }}
                        >
                          <li
                            className={`bgitem template-1 ${
                              currentQuestion.template === "1"
                                ? "selected-template"
                                : ""
                            }`}
                            onClick={() =>
                              setCurrentQuestion({
                                ...currentQuestion,
                                template: "1",
                              })
                            }
                          >
                            1
                          </li>
                          <li
                            className={`bgitem template-2 ${
                              currentQuestion.template === "2"
                                ? "selected-template"
                                : ""
                            }`}
                            onClick={() =>
                              setCurrentQuestion({
                                ...currentQuestion,
                                template: "2",
                              })
                            }
                          >
                            2
                          </li>
                          <li
                            className={`bgitem template-3 ${
                              currentQuestion.template === "3"
                                ? " selected-template"
                                : ""
                            }`}
                            onClick={() =>
                              setCurrentQuestion({
                                ...currentQuestion,
                                template: "3",
                              })
                            }
                          >
                            3
                          </li>
                          <li
                            className={`bgitem template-4 ${
                              currentQuestion.template === "4"
                                ? "selected-template"
                                : ""
                            }`}
                            onClick={() =>
                              setCurrentQuestion({
                                ...currentQuestion,
                                template: "4",
                              })
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
                          <h3
                            className="defaultStyle"
                            style={{ color: "#666" }}
                          >
                            Название вопроса
                          </h3>
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
                          <h3
                            className="defaultStyle"
                            style={{ color: "#666" }}
                          >
                            Описание вопроса
                          </h3>
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
                        <span>
                          <h3
                            className="defaultStyle"
                            style={{ color: "#666" }}
                          >
                            Загрузить аудио файл
                          </h3>
                          {currentQuestion.audio && (
                            <audio controls>
                              <source
                                src={currentQuestion.audio}
                                type="audio/mp3"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => {
                              setCurrentQuestion({
                                ...currentQuestion,
                                audio: e.target.files[0],
                              });
                            }}
                          />
                        </span>
                      </span>

                      {currentQuestion.question_type ===
                        "multiple_choice_text" && (
                        <>
                          <h3
                            className="defaultStyle"
                            style={{ color: "#666" }}
                          >
                            Варианты ответа (нажмите на правильный)
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "1rem",
                            }}
                          >
                            {currentQuestion.options.map((option, index) => (
                              <input
                                key={index + 1}
                                type="text"
                                placeholder={`Вариант ${index + 1}`}
                                value={
                                  typeof option === "string"
                                    ? option
                                    : option.value
                                }
                                onChange={(e) => {
                                  const updatedOptions = [
                                    ...currentQuestion.options,
                                  ];
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
                        </>
                      )}

                      {currentQuestion.question_type ===
                        "multiple_choice_images" && (
                        <>
                          <h3
                            className="defaultStyle"
                            style={{ color: "#666" }}
                          >
                            Варианты ответа (нажмите на правильный)
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "1rem",
                            }}
                          >
                            {currentQuestion.options.map((image, index) => (
                              <div
                                className="optionsImgUpload"
                                key={index}
                                style={{
                                  border:
                                    index === currentQuestion.correct_answer - 1
                                      ? "2px solid green"
                                      : "none",
                                }}
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="optionImgUpload"
                                  onChange={(e) => handleImageUpload(e, index)}
                                />
                                {image && (
                                  <img
                                    src={
                                      typeof image === "string"
                                        ? image
                                        : URL.createObjectURL(image)
                                    }
                                    alt={`Option ${index + 1}`}
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      border:
                                        index ===
                                        currentQuestion.correct_answer - 1
                                          ? "2px solid green"
                                          : "none",
                                    }}
                                  />
                                )}
                                <input
                                  type="radio"
                                  name="correctAnswer"
                                  style={{ scale: "1.5" }}
                                  checked={
                                    index === currentQuestion.correct_answer - 1
                                  }
                                  onChange={() =>
                                    handleSelectCorrectAnswer(index)
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {currentQuestion.question_type ===
                        "drag_and_drop_text" && (
                        <>
                          <h3
                            className="defaultStyle"
                            style={{ color: "#666" }}
                          >
                            Варианты ответа (введите порядок правильных ответов)
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "1rem",
                            }}
                          >
                            {currentQuestion.options.map((option, index) => (
                              <div className="optionsImgUpload" key={index}>
                                <input
                                  type="text"
                                  placeholder={`Вариант ${index + 1}`}
                                  value={
                                    typeof option === "string"
                                      ? option
                                      : option.value
                                  }
                                  onChange={(e) => {
                                    const updatedOptions = [
                                      ...currentQuestion.options,
                                    ];
                                    updatedOptions[index] = e.target.value;
                                    setCurrentQuestion({
                                      ...currentQuestion,
                                      options: updatedOptions,
                                    });
                                  }}
                                  style={{ margin: "0" }}
                                />
                                <input
                                  type="number"
                                  placeholder={`Порядок`}
                                  min="1"
                                  max={currentQuestion.options.length}
                                  value={currentQuestion.drag_answers[index]}
                                  onChange={(e) => {
                                    const orderValue = e.target.value
                                      ? parseInt(e.target.value, 10)
                                      : "";
                                    const updatedDragAnswers = [
                                      ...currentQuestion.drag_answers,
                                    ];
                                    updatedDragAnswers[index] = orderValue;
                                    setCurrentQuestion({
                                      ...currentQuestion,
                                      drag_answers: updatedDragAnswers,
                                    });
                                  }}
                                  style={{ width: "100px", marginTop: "5px" }}
                                />
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {currentQuestion.question_type ===
                        "drag_and_drop_images" && (
                        <>
                          <h3
                            className="defaultStyle"
                            style={{ color: "#666" }}
                          >
                            Варианты ответа (введите порядок правильных ответов)
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "1rem",
                            }}
                          >
                            {currentQuestion.images.map((image, index) => (
                              <div className="optionsImgUpload" key={index}>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="optionImgUpload"
                                  onChange={(e) => handleImageUpload(e, index)}
                                />
                                {image && (
                                  <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Option ${index + 1}`}
                                    style={{ width: "100px", height: "100px" }}
                                  />
                                )}
                                <input
                                  type="number"
                                  placeholder={`Порядок`}
                                  min="1"
                                  max={currentQuestion.images.length}
                                  value={currentQuestion.drag_answers[index]}
                                  onChange={(e) => {
                                    const orderValue = e.target.value
                                      ? parseInt(e.target.value, 10)
                                      : "";
                                    const updatedDragAnswers = [
                                      ...currentQuestion.drag_answers,
                                    ];
                                    updatedDragAnswers[index] = orderValue;
                                    setCurrentQuestion({
                                      ...currentQuestion,
                                      drag_answers: updatedDragAnswers,
                                    });
                                  }}
                                  style={{ width: "100px", marginTop: "5px" }}
                                />
                              </div>
                            ))}
                          </div>
                        </>
                      )}
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
          )}
        </dialog>
      )}
    </div>
  );
};

export default Tasksection;
