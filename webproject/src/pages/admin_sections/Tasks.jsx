import React, { useState, useEffect } from "react";
import Superside from "../admin_components/Superside";
import { Link, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';

const Tasks = () => {
  const [showModal, setOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Load courses from local storage
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  useEffect(() => {
    // Save courses to local storage whenever courses change
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCourseName("");
    setCourseDesc("");
    setSections([]);
    setEditingCourseId(null);
  };

  const handleAddSection = () => {
    const newSection = {
      id: Date.now().toString(),
      name: "",
    };
    setSections([...sections, newSection]);
  };

  const handleDeleteSection = (id) => {
    const updatedSections = sections.filter((section) => section.id !== id);
    setSections(updatedSections);
  };

  const handleSectionNameChange = (id, newName) => {
    const updatedSections = sections.map((section) => {
      if (section.id === id) {
        return { ...section, name: newName };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!courseName.trim() || !courseDesc.trim()) {
      alert("Course name and description cannot be empty");
      return;
    }

    const nonEmptySections = sections.filter(section => section.name.trim());

    const newCourse = {
      id: editingCourseId ? editingCourseId : Date.now().toString(),
      name: courseName,
      description: courseDesc,
      sections: nonEmptySections,
    };

    const updatedCourses = editingCourseId
      ? courses.map((course) => (course.id === editingCourseId ? newCourse : course))
      : [...courses, newCourse];

    setCourses(updatedCourses);
    handleClose();
  };

  const handleEditCourse = (id) => {
    const courseToEdit = courses.find((course) => course.id === id);
    setCourseName(courseToEdit.name);
    setCourseDesc(courseToEdit.description);
    setSections(courseToEdit.sections);
    setEditingCourseId(id);
    setOpen(true);
  };

  const handleDeleteCourse = () => {
    if (window.confirm("Вы действительно хотите удалить этот курс?")) {
      const updatedCourses = courses.filter((course) => course.id !== editingCourseId);
      setCourses(updatedCourses);
      handleClose();
    }
  };

  const handleNavigateToSection = (courseId, sectionId) => {
    navigate(`/admindashboard/tasks/${courseId}/${sectionId}`);
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

        <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
          Мои курсы
        </p>
        <div className="superCont coursesList">
          <button className="courseAdder" onClick={handleClickOpen}>
            <AddIcon sx={{ fontSize: 50 }} />
            Создать курс
          </button>

          {courses.map((course) => (
            <div key={course.id} className="addedCourses">
              <div style={{display:"flex", flexDirection:"column", alignItems:'center', gap:"0.5rem"}}>
                <h3 className="defaultStyle" style={{fontSize:"x-large", color:"black"}}>{course.name}</h3>
                <p className="defaultStyle" style={{color:"#666"}}>{course.description} класс</p>
              </div>
              
              <ul className="sectListInfo">
                {course.sections.map((section, index) => (
                  <li 
                    className="sectionsInfo" 
                    key={section.id}
                    onClick={() => handleNavigateToSection(course.name, section.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>{index + 1}.</span>
                    {section.name}
                  </li>
                ))}
              </ul>
              <button className="superBtn" onClick={() => handleEditCourse(course.id)}>
                <EditIcon />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <dialog
          open={showModal}
          onClose={handleClose}
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
              onClick={handleClose}
            >
              <CloseIcon sx={{ color: "gray" }} />
            </button>
            <h2 className="defaultStyle" style={{ color: "#666" }}>
              {editingCourseId ? "Редактировать курс" : "Добавить курс"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="formCont">
                <div className="formLeft">
                  <label htmlFor="courseName">Название курса:</label> <br />
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Математика"
                    required
                  />{" "}
                  <br />
                  <label htmlFor="courseDesc">Выберите уровень</label> <br />
                  <input
                    list="levels"
                    id="gender"
                    name="courseDesc"
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    placeholder="Дошкольный"
                    required
                  />
                  <datalist id="levels">
                    <option value="1"></option>
                    <option value="2"></option>
                    <option value="3"></option>
                  </datalist>

                  <button
                    type="submit"
                    className="superBtn"
                    style={{ marginTop: "30px" }}
                  >
                    {editingCourseId ? "Сохранить изменения" : "Добавить курс"}
                  </button>

                  {editingCourseId && (
                    <button
                      type="button"
                      className="superBtn"
                      style={{ marginTop: "10px", color: "red", marginLeft:"10px"}}
                      onClick={handleDeleteCourse}
                    >
                      Удалить курс
                    </button>
                  )}
                </div>

                <div className="formRight">
                  <label htmlFor="coursePrice">Добавить секций</label> <br />
                  <button
                    type="button"
                    style={{
                      border: "2px dotted #aaa",
                      color: "#aaa",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      width: "200px",
                      marginBottom: "20px",
                    }}
                    onClick={handleAddSection}
                  >
                    <AddIcon sx={{ color: "#aaa" }} />
                  </button>{" "}
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="sections">
                      {(provided) => (
                        <ul className="sectList" {...provided.droppableProps} ref={provided.innerRef}>
                          {sections.map((section, index) => (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                              {(provided) => (
                                <li className="sectAdder" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                  <input
                                    style={{ margin: "0" }}
                                    type="text"
                                    value={section.name}
                                    onChange={(e) =>
                                      handleSectionNameChange(section.id, e.target.value)
                                    }
                                  />
                                  <button onClick={() => handleDeleteSection(section.id)} className="transBtn">
                                    <DeleteForeverIcon />
                                  </button>
                                  <button className="transBtn" name="dragger" {...provided.dragHandleProps}>
                                    <MenuIcon />
                                  </button>
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Tasks;
