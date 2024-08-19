import React, { useEffect, useState } from "react";
import Superside from "../admin_components/Superside";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import Loader from "../Loader";
import {
  fetchSection,
  fetchCourse,
  createChapters,
  deleteChapter,
  updateChapter,
  fetchChapters,
} from "../../utils/apiService";

const Chapters = () => {
  const { courseId, sectionId } = useParams();
  const [contents, setContents] = useState([]);
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContentsData = async () => {
      try {
        const contentsData = await fetchChapters(courseId, sectionId);
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

  const handleOpenAddDialog = () => {
    setChapterTitle("");
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (chapter) => {
    setSelectedChapter(chapter);
    setChapterTitle(chapter.title);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleAddChapter = async () => {
    try {
      await createChapters(courseId, sectionId, { title: chapterTitle });
      const updatedChapters = await fetchChapters(courseId, sectionId);
      setContents(updatedChapters);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Failed to add chapter", error);
    }
  };

  const handleEditChapter = async () => {
    try {
      await updateChapter(courseId, sectionId, selectedChapter.id, {
        title: chapterTitle,
      });
      const updatedChapters = await fetchChapters(courseId, sectionId);
      setContents(updatedChapters);
      handleCloseEditDialog();
    } catch (error) {
      console.error("Failed to edit chapter", error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await deleteChapter(courseId, sectionId, chapterId);
      const updatedChapters = await fetchChapters(courseId, sectionId);
      setContents(updatedChapters);
    } catch (error) {
      console.error("Failed to delete chapter", error);
    }
  };

  const handleChapterClick = (chapterId) => {
    navigate(
      `/admindashboard/tasks/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}`
    );
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
          <Link to={"/admindashboard/tasks"} style={{color:"black"}}>
            <p
              className="defaultStyle"
              style={{
                padding: "10px 25px",
                borderRadius: "20px",
                backgroundColor: "lightgray",
                marginRight: "20px",
              }}
            >
              {course.name} ({course.grade} класс)
            </p>
          </Link>
          <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
            {'>'} {section.title}
          </p>
        </div>
        <div className="superCont chapterCont">
          <p
            style={{
              fontSize: "x-large",
              fontWeight: "700",
              color: "#444",
              alignSelf: "center",
            }}
          >
            Главы
          </p>
          <div className="chapters">
            <div className="addChapter">
              <button className="chapterAdder" onClick={handleOpenAddDialog}>
                <AddIcon sx={{ fontSize: 30 }} />
                Добавить главы
              </button>
            </div>

            <ul className="chapterList">
              {contents.map((chapter) => (
                <li
                  key={chapter.id}
                  className="chapter"
                  onClick={() => handleChapterClick(chapter.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    margin: "5px 0",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  <span>{chapter.title}</span>
                  <span>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditDialog(chapter);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChapter(chapter.id);
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Add Chapter Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Добавить Главу</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название главы"
            fullWidth
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Отменить</Button>
          <Button onClick={handleAddChapter} disabled={!chapterTitle}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Chapter Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Изменить Главу</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название главы"
            fullWidth
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Отменить</Button>
          <Button onClick={handleEditChapter} disabled={!chapterTitle}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Chapters;
