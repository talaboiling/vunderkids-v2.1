import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import placeholderPfp from "../../assets/placehoder_pfp.png";
import mathIcon from "../../assets/calculator.png";
import englishIcon from "../../assets/english.png";
import {
  fetchUserData,
  fetchCourses,
  fetchSections,
  fetchCourse,
} from "../../utils/apiService";
const Math = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log(courseId);
        const courseData = await fetchCourse(courseId);
        const sectionsData = await fetchSections(courseId);
        setSections(sectionsData);
        setCourse(courseData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  console.log(course);

  const openVideoModal = (url) => {
    setVideoUrl("https://www.youtube.com/embed/_ALtBbXcyXc");
    setShowVideoModal(true);
  };

  const openTaskModal = () => {
    setShowTaskModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
  };

  if (!course) {
    return <div>Loading</div>;
  }

  return (
    <div className="rtdash rtrat">
      <Sidebar />
      <div className="centralLessons">
        <Navdash />
        <div className="ratingCentral">
          <div className="lessonsMain">
            <div className="coursesCards">
              <div className="courseItem" key={course.id}>
                <div className="courseItemLeft">
                  <p style={{ margin: "0" }}>{course.name}</p>
                  <progress value={course.percentage_completed} />
                  <p className="defaultStyle">
                    Выполнено {course.completed_tasks} из {course.total_tasks}{" "}
                    заданий
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
                Начало курса{" "}
              </h2>

              {sections.map((section, index) => (
                <>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <hr />
                    <h2 className="defaultStyle" style={{ color: "#aaa" }}>
                      {section.title}
                    </h2>
                    <hr />
                  </div>
                  {section.contents.map((content, index) => (
                    <div className="lessonsLinks">
                      {content.content_type === "lesson" ? (
                        <Link
                          to="/dashboard/courses/course_id/sections/section_id/conten ts/content_id"
                          className="lessonLink lessonvideo"
                        >
                          Урок: {content.title}
                        </Link>
                      ) : (
                        <Link // Specify a default link or handle the case differently
                          to="/somewhere-else" // Replace with appropriate URL or logic
                          className="lessonLink" // Optional class for styling
                        >
                          Задание: {content.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>

          <div className="lessonsProg">
            <p>Что мы будем проходить:</p>
            <div className="progList">
              {sections.map((section, index) => (
                <div className="progItem">
                  <p>{section.title}</p>
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
    </div>
  );
};

export default Math;
