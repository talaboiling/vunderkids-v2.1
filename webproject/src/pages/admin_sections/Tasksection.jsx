import React, { useEffect, useState } from 'react';
import Superside from "../admin_components/Superside";
import { useParams, Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import bgtask from "../../assets/bgtask.svg";
import bgvideo from "../../assets/videolessonthumb.svg";

const Tasksection = () => {
  const { courseId, sectionId } = useParams();
  const [section, setSection] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [videoDetails, setVideoDetails] = useState({
    url: "",
    name: "",
    description: "",
    thumbnail: ""
  });
  const [file, setFile] = useState(null);
  const [taskDetails, setTaskDetails] = useState({
    type: "",
    template: "",
    topText: "",
    taskText: "",
    answers: ["", "", "", ""],
    correctAnswer: ""
  });
  const [questions, setQuestions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  useEffect(() => {
    // Load courses from local storage
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      const courses = JSON.parse(savedCourses);
      const course = courses.find(course => course.name === courseId);
      if (course) {
        const section = course.sections.find(section => section.name === sectionId);
        if (section) {
          if (!section.videos) section.videos = [];
          if (!section.tasks) section.tasks = [];
          setSection(section);
        }
      }
    }
  }, [courseId, sectionId]);

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    const updatedVideoDetails = { ...videoDetails, thumbnail: file ? URL.createObjectURL(file) : videoDetails.thumbnail };

    const updatedSection = {
      ...section,
      videos: isEditingVideo
        ? section.videos.map((video, index) => (index === selectedTaskIndex ? updatedVideoDetails : video))
        : [...section.videos, updatedVideoDetails]
    };

    setSection(updatedSection);
    setShowVideoModal(false);
    resetVideoDetails();

    // Save updated section to local storage
    saveSectionToLocalStorage(updatedSection);
  };

  const resetVideoDetails = () => {
    setVideoDetails({
      url: "",
      name: "",
      description: "",
      thumbnail: ""
    });
    setFile(null);
    setIsEditingVideo(false);
  };

  const handleDeleteVideo = (index) => {
    if (window.confirm("Вы действительно хотите удалить этот видеоурок?")) {
      const updatedSection = {
        ...section,
        videos: section.videos.filter((_, i) => i !== index)
      };
      setSection(updatedSection);

      // Save updated section to local storage
      saveSectionToLocalStorage(updatedSection);
    }
  };
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = taskDetails; // Ensure the current question is updated
    setQuestions(updatedQuestions);
    resetTaskDetails();
    setCurrentQuestionIndex(updatedQuestions.length); // Move to the next question index
  };

  const loadQuestion = (index) => {
    const question = questions[index];
    setTaskDetails({
      type: question.type,
      template: question.template,
      topText: question.topText,
      taskText: question.taskText,
      answers: question.answers,
      correctAnswer: question.correctAnswer
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
      correctAnswer: ""
    });
  };

  const handleFinishTasks = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = taskDetails; // Ensure the current question is saved
    const finalQuestions = updatedQuestions;
  
    const updatedSection = isEditingTask
      ? {
          ...section,
          tasks: section.tasks.map((task, index) =>
            index === editingTaskIndex ? { questions: finalQuestions } : task
          )
        }
      : {
          ...section,
          tasks: [...section.tasks, { questions: finalQuestions }]
        };
  
    setSection(updatedSection);
    setShowTaskModal(false);
    setQuestions([]);
    resetTaskDetails();
    saveSectionToLocalStorage(updatedSection);
    setIsEditingTask(false);
    setCurrentQuestionIndex(0);
  };

  const saveSectionToLocalStorage = (updatedSection) => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      const courses = JSON.parse(savedCourses);
      const courseIndex = courses.findIndex(course => course.name === courseId);
      if (courseIndex > -1) {
        const sectionIndex = courses[courseIndex].sections.findIndex(section => section.name === sectionId);
        if (sectionIndex > -1) {
          courses[courseIndex].sections[sectionIndex] = updatedSection;
          localStorage.setItem('courses', JSON.stringify(courses));
        }
      }
    }
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
    setTaskDetails({ ...taskDetails, correctAnswer: taskDetails.answers[index] });
  };

  const handleDeleteTask = (index) => {
    if (window.confirm("Вы действительно хотите удалить это задание?")) {
      const updatedSection = {
        ...section,
        tasks: section.tasks.filter((_, i) => i !== index)
      };
      setSection(updatedSection);

      // Save updated section to local storage
      saveSectionToLocalStorage(updatedSection);
    }
  };

  const openVideo = (url) => {
    window.open(url, "_blank");
  };

  const openTask = (index) => {
    setSelectedTaskIndex(index);
    setShowQuestionsModal(true);
    setCurrentQuestionIndex(0);
  };

  const handleEditVideo = (index) => {
    setSelectedTaskIndex(index);
    setVideoDetails(section.videos[index]);
    setIsEditingVideo(true);
    setShowVideoModal(true);
  };

  const handleEditTask = (index) => {
    setEditingTaskIndex(index);
    const task = section.tasks[index];
    setQuestions(task.questions);
    setIsEditingTask(true);
    setShowTaskModal(true);
  };

  const nextQuestion = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = taskDetails; // Save the current question before moving
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
    updatedQuestions[currentQuestionIndex] = taskDetails; // Save the current question before moving
    setQuestions(updatedQuestions);
    if (currentQuestionIndex > 0) {
      loadQuestion(currentQuestionIndex - 1);
    }
  };

  if (!section) {
    return <div>Loading...</div>;
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
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
            {section.name}
          </p>
          <p className='defaultStyle' style={{ padding: "10px 25px", borderRadius: "20px", backgroundColor: "lightgray", marginLeft: "20px" }}>{courseId}</p>
        </div>

        <div className="superCont sectCont">
          {section.videos && section.videos.map((video, index) => (
            <div key={index} className="vidBlock">
              <div className='thumbcontainer'>
                <img src={bgvideo || 'placeholder.png'} alt={video.name} className="taskThumbnail" onClick={() => openVideo(video.url)} />
              </div>

              <p style={{backgroundColor:"white", margin:"0", padding:"7px 40px", borderRadius:"10px"}}>Видеоурок</p>
              <div className="taskHover">
                <p><strong>Название:</strong> {video.name}</p>
                <p><strong>Описание:</strong> {video.description}</p>
              </div>
              <button 
                onClick={() => handleDeleteVideo(index)} 
                className="deleteBtn"
              >
                <DeleteForeverIcon sx={{ color: "darkred" }} />
              </button>
              <button 
                onClick={() => handleEditVideo(index)} 
                className="deleteBtn editBtn"
              >
                <EditIcon sx={{ color: "black" }} />
              </button>
            </div>
          ))}
          {section.tasks && section.tasks.map((task, index) => (
            <div key={index} className="taskBlock" onClick={() => openTask(index)}>
              <img src={bgtask} alt="" style={{paddingTop:"20px", scale:"1.3", overflow:"hidden"}}/>
              <p style={{backgroundColor:"white", margin:"0", padding:"7px 40px", borderRadius:"10px"}}>Задание</p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteTask(index); }} 
                className="deleteBtn"
              >
                <DeleteForeverIcon sx={{ color: "darkred" }} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleEditTask(index); }} 
                className="deleteBtn editBtn"
              >
                <EditIcon sx={{ color: "black" }} />
              </button>
            </div>
          ))}

          <div className="taskAdder">
            <button className="adderBtn" onClick={() => {
              setShowVideoModal(true);
              resetVideoDetails(); // Reset video details for new entry
            }}>Видеоурок</button>
            <button className="adderBtn" onClick={() => {
              setShowTaskModal(true);
              resetTaskDetails(); // Reset task details for new entry
              setQuestions([]); // Reset questions for new task
            }}>Задание</button>
          </div>
        </div>
      </div>

      {showVideoModal && (
        <dialog open={showVideoModal} onClose={() => setShowVideoModal(false)} className="modal supermodal" style={{ padding: "60px" }}>
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
            <h2 className="defaultStyle" style={{ color: "#666" }}>{isEditingVideo ? 'Редактировать видеоурок' : 'Добавить видеоурок'}</h2>
            <form onSubmit={handleVideoSubmit}>
              <div className="formVideo">
                <span>
                  <label htmlFor="videoUrl">URL видео:</label><br />
                  <input
                    type="text"
                    id="videoUrl"
                    value={videoDetails.url}
                    onChange={(e) => setVideoDetails({ ...videoDetails, url: e.target.value })}
                    required
                  />
                </span>
                <span style={{ marginLeft: "2rem" }}>
                  <label htmlFor="videoName">Название видео:</label><br />
                  <input
                    type="text"
                    id="videoName"
                    value={videoDetails.name}
                    onChange={(e) => setVideoDetails({ ...videoDetails, name: e.target.value })}
                    required
                  />
                </span>
                <span>
                  <label htmlFor="videoDescription">Описание:</label><br />
                  <textarea
                    id="videoDescription"
                    value={videoDetails.description}
                    onChange={(e) => setVideoDetails({ ...videoDetails, description: e.target.value })}
                    style={{ width: "300px", height:"100px"}}
                    required
                  /><br />
                </span>
              </div>
              <button type="submit" className="superBtn" style={{ marginTop: "30px" }}>{isEditingVideo ? 'Сохранить' : 'Добавить'}</button>
            </form>
          </div>
        </dialog>
      )}

      {showTaskModal && (
        <dialog open={showTaskModal} onClose={() => setShowTaskModal(false)} className="modal supermodal" style={{ padding: "60px" }}>
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
            <h2 className="defaultStyle" style={{ color: "#666" }}>{isEditingTask ? 'Редактировать задание' : 'Добавить задание'}</h2>
            <div className="taskConstructor">
              <div className="taskPreview">
                <p className='defaultStyle' style={{margin:"0", padding:"40px", fontSize:"large"}}>{taskDetails.topText}</p>
                <div className="previewContent">
                  <p style={{margin:"0", fontSize:"xx-large"}}>{taskDetails.taskText}</p>
                </div>
              </div>
              <div className="taskDetails">
                <form onSubmit={handleTaskSubmit} className=''>
                  <div className="formConstructor">
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2rem", width: "60%", marginBottom: "40px" }}>
                      <h3 className='defaultStyle' style={{ color: "#666" }}>Выберите тип задачи</h3>
                      <input list='tasktype' placeholder='Выбор правильного ответа' required style={{ margin: "0" }} value={taskDetails.type} onChange={(e) => setTaskDetails({ ...taskDetails, type: e.target.value })} />
                      <datalist id='tasktype'>
                        <option value='Выбор правильного ответа' />
                        <option value='Ввод текста' />
                        <option value='Загрузка файла' />
                      </datalist>
                      <button className='transBtn' style={{ backgroundColor: "#aaa", borderRadius: "7px", padding: "8px" }}>
                        <AddIcon sx={{ color: "#333" }} />
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: 'column', gap: "1rem", marginBottom: "40px" }}>
                      <h3 className='defaultStyle' style={{ color: "#666" }}>Выберите шаблон</h3>
                      <ul style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
                        <li
                          className={`bgitem ${taskDetails.template === '1' ? 'selected-template' : ''}`}
                          onClick={() => setTaskDetails({ ...taskDetails, template: '1' })}
                        >
                          1
                        </li>
                        <li
                          className={`bgitem ${taskDetails.template === '2' ? 'selected-template' : ''}`}
                          onClick={() => setTaskDetails({ ...taskDetails, template: '2' })}
                        >
                          2
                        </li>
                        <li
                          className={`bgitem ${taskDetails.template === '3' ? 'selected-template' : ''}`}
                          onClick={() => setTaskDetails({ ...taskDetails, template: '3' })}
                        >
                          3
                        </li>
                        <li
                          className={`bgitem ${taskDetails.template === '4' ? 'selected-template' : ''}`}
                          onClick={() => setTaskDetails({ ...taskDetails, template: '4' })}
                        >
                          4
                        </li>
                      </ul>
                    </div>
                    <div style={{ display: "flex", flexDirection: 'row', gap: "1rem", marginBottom: "40px" }}>
                      <span>
                        <label htmlFor="" className='defaultStyle' style={{ fontSize: "medium", color: "#666" }}>Текст сверху</label>
                        <input type="text" placeholder='Мой вопрос' style={{ margin: "0" }} value={taskDetails.topText} onChange={(e) => setTaskDetails({ ...taskDetails, topText: e.target.value })} />
                      </span>
                      <span>
                        <label htmlFor="" className='defaultStyle' style={{ fontSize: "medium", color: "#666" }}>Текст задачи</label>
                        <input type="text" placeholder='15 + 4 =' style={{ margin: "0" }} value={taskDetails.taskText} onChange={(e) => setTaskDetails({ ...taskDetails, taskText: e.target.value })} />
                      </span>
                    </div>
                    <label htmlFor="" className='defaultStyle' style={{ fontSize: "medium", color: "#666" }}>Варианты ответа (напишите и нажмите на правильный)</label>
                    <div style={{ display: "flex", flexDirection: 'row', gap: "1rem" }}>
                      {taskDetails.answers.map((answer, index) => (
                        <input
                          key={index}
                          type="text"
                          placeholder={String.fromCharCode(97 + index)}
                          value={answer}
                          style={{ margin: "0" }}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          onClick={() => handleSelectCorrectAnswer(index)}
                          className={taskDetails.correctAnswer === answer ? "correct-answer" : ""}
                        />
                      ))}
                    </div>
                    <div className="questionNavigation">
                      <button type="button" onClick={prevQuestion} className="transBtn" disabled={currentQuestionIndex === 0}><ArrowBackIosNewIcon/><p className='defaultStyle'>Prev</p></button>
                      <button type="button" onClick={nextQuestion} className="transBtn" disabled={currentQuestionIndex >= questions.length - 1}><ArrowForwardIosIcon/><p className='defaultStyle'>Next</p></button>
                    </div>
                  </div>
                  <div style={{ marginTop: "40px" }}>
                    <button type="button" onClick={handleTaskSubmit} className='superBtn' style={{ backgroundColor: "#D5E5EE", marginRight: "20px" }}>Добавить еще</button>
                    <button type="button" onClick={handleFinishTasks} className='superBtn'>{isEditingTask ? 'Сохранить' : 'Закончить'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </dialog>
      )}

      {showQuestionsModal && (
        <dialog open={showQuestionsModal} onClose={() => setShowQuestionsModal(false)} className="modal supermodal" style={{ padding: "60px" }}>
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
            <h2 className="defaultStyle" style={{ color: "#666" }}>Все вопросы</h2>
            <div className="questionsList">
              {selectedTaskIndex !== null && section.tasks[selectedTaskIndex].questions.length > 0 && (
                <>
                  <div className="questionItem">
                    <p><strong>Вопрос {currentQuestionIndex + 1}:</strong></p>
                    <p><strong>Тип задачи:</strong> {section.tasks[selectedTaskIndex].questions[currentQuestionIndex].type}</p>
                    <p><strong>Шаблон:</strong> {section.tasks[selectedTaskIndex].questions[currentQuestionIndex].template}</p>
                    <p><strong>Текст сверху:</strong> {section.tasks[selectedTaskIndex].questions[currentQuestionIndex].topText}</p>
                    <p><strong>Текст задачи:</strong> {section.tasks[selectedTaskIndex].questions[currentQuestionIndex].taskText}</p>
                    <p><strong>Варианты ответа:</strong> {section.tasks[selectedTaskIndex].questions[currentQuestionIndex].answers.join(', ')}</p>
                    <p><strong>Правильный ответ:</strong> {section.tasks[selectedTaskIndex].questions[currentQuestionIndex].correctAnswer}</p>
                  </div>
                  <div className="questionNavigation">
                    <button onClick={prevQuestion} className="transBtn"><ArrowBackIosNewIcon/><p className='defaultStyle'>Prev</p></button>
                    <button onClick={nextQuestion} className="transBtn"><ArrowForwardIosIcon/><p className='defaultStyle'>Next</p></button>
                  </div>
                </>
              )}
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Tasksection;
