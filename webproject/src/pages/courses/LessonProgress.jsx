import React from 'react'

const LessonProgress = ({
    sections,
    t,
}) => {
  return (
    <>
    <h3
        className="defaultStyle"
        style={{ color: "black", fontWeight: "800", fontSize: "x-large" }}
    >
        {t ('whatWeLearn')}
    </h3>
    <div className="progList">
        {sections.map((section, index) => (
        <div className="progItem" key={index}>
            <p style={{ margin: "0", marginBottom: "15px" }}>
            {section.title}
            </p>
            <progress
            value={section.percentage_completed / 100}
            max="1"
            ></progress>
        </div>
        ))}
    </div>
    </>
  )
}

export default LessonProgress