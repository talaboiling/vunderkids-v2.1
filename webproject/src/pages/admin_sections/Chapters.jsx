import { useEffect, useState } from "react";
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
    fetchSection,
    fetchCourse,
    fetchContents,
    createChapters,
    deleteChapter,
    updateChapter,
    fetchChapters,
    fetchChapter,
} from "../../utils/apiService";

const Chapters = () => {
  const { courseId, sectionId } = useParams();
  const [contents, setContents] = useState([]);
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
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

  

  if(loading){
    return <Loader />
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
        <div className="superCont chapterCont">
          <p style={{ fontSize: "x-large", fontWeight: "700", color: "#444", alignSelf:"center" }}>
            Тараулар
          </p>
          <div className="chapters">
            <div className="addChapter">
              <button className="chapterAdder" >{/*onClick={handleClickOpen}*/}
                <AddIcon sx={{ fontSize: 30 }} />
                Тарау қосу
            </button>
            </div>
            <ul className="chapterList">
              <li className="chapter">chapter1</li>
              <li className="chapter">chapter2</li>
              <li className="chapter">chapter3</li>
              <li className="chapter">chapter1</li>
              <li className="chapter">chapter2</li>
              <li className="chapter">chapter3</li>
              <li className="chapter">chapter1</li>
              <li className="chapter">chapter2</li>
              <li className="chapter">chapter3</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chapters