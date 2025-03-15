import React, { useState } from "react";
import styles from "./QuestionsCreator.module.css";

const QuestionsCreator = () => {
  const [questions, setQuestions] = useState([
    {
      heading: "",
      image: "",
      answerType: "text", // can be "text" or "image"
      answers: ["", "", ""],
      order:1
    },
    {
        heading: "",
        image: "",
        answerType: "text", // can be "text" or "image"
        answers: ["", "", ""],
        order:2
    }  
  ]);

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex][field] = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { heading: "", image: "", answerType: "text", answers: ["", "", ""] },
    ]);
  };

  const handleImageChange = (qIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleQuestionChange(qIndex, "image", imageUrl);
    }
  };

  const handleAnswerImageChange = (qIndex, aIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleAnswerChange(qIndex, aIndex, imageUrl);
    }
  };

  return (
    <div className={styles.questionsList}>
      {questions.map((question, qIndex) => (
        <div key={question.order} className={styles.questionItem}>
          <p>Question {qIndex+1}</p>
          <input
            type="text"
            placeholder="Question heading"
            value={question.heading}
            onChange={(e) =>
              handleQuestionChange(qIndex, "heading", e.target.value)
            }
            className={styles.questionHeading}
          />

          <div style={{ margin: "0.5rem 0" }}>
            <label>Upload question image: </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(qIndex, e)}
            />
            {question.image && (
              <img
                src={question.image}
                alt="question preview"
                className={styles.questionImage}
              />
            )}
          </div>

          <div style={{ margin: "0.5rem 0" }}>
            <label>Answer Type: </label>
            <select
              value={question.answerType}
              onChange={(e) =>
                handleQuestionChange(qIndex, "answerType", e.target.value)
              }
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </div>

          <div className={styles.answers}>
            {[0, 1, 2, 3].map((aIndex) => (
              <div key={aIndex} className={styles.answer}>
                {question.answerType === "text" ? (
                  <input
                    type="text"
                    placeholder={`Answer ${aIndex + 1}`}
                    value={question.answers[aIndex]}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, e.target.value)
                    }
                    className={styles.answerInput}
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleAnswerImageChange(qIndex, aIndex, e)
                      }
                      className={styles.answerImageInput}
                    />
                    {question.answers[aIndex] && (
                      <img
                        src={question.answers[aIndex]}
                        alt={`Answer ${aIndex + 1}`}
                        className={styles.answerPreview}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button type="button" onClick={addQuestion}>
        Add Question
      </button>
    </div>
  );
};

export default QuestionsCreator;