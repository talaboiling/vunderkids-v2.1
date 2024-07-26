import React from "react";
import mathIcon from "../../assets/calculator.png";
import englishIcon from "../../assets/english.png";

const CourseCard = ({ course, t }) => {
  return (
    <div className="courseItem" key={course.id}>
      <div className="courseItemLeft">
        <p style={{ margin: "0" }}>{course.name}</p>
        <progress value={course.percentage_completed} />
        <p className="defaultStyle">
          {t("completedTasks1")}
          {course.completed_tasks}
          {t("completedTasks2")}
          {course.total_tasks} {t("completedTasks3")}
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
  );
};

export default CourseCard;
