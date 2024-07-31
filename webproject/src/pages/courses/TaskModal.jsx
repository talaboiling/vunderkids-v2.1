import React, { useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import staricon from "../../assets/navStars.webp";
import cupicon from "../../assets/navCups.webp";
import correctlion from "../../assets/lion_correct.webp";
import wronglion from "../../assets/lion_incorrect.webp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const TaskModal = ({
  user,
  questions,
  currentQuestionIndex,
  selectedOption,
  setSelectedOption,
  feedbackMessage,
  showFeedback,
  toggleAudio,
  isAudioPlaying,
  isMuted,
  toggleMute,
  volume,
  handleVolumeChange,
  handleOptionClick,
  handleDragEnd,
  droppedOrder,
  handleSubmit,
  handleNextQuestion,
  closeTaskModal,
  t,
  isButtonDisabled,
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const audioRef = useRef(null);

  return (
    <dialog className="studmodal" open>
      <div className="studmodal-content">
        <div className="modalHeader">
          <span
            style={{ display: "flex", flexDirection: "row", gap: "2rem" }}
          >
            <p
              className="lndsh"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px 20px",
                gap: "0.5rem",
              }}
            >
              <img src={staricon} alt="" className="defaultIcon" />
              {user.stars}
            </p>
            <p
              className="lndsh"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px 20px",
                gap: "0.5rem",
              }}
            >
              <img src={cupicon} alt="" className="defaultIcon" />
              {user.cups}
            </p>
          </span>

          <button
            style={{
              float: "right",
              backgroundColor: "lightgray",
              border: "none",
              borderRadius: "10px",
              color: "#666",
            }}
            onClick={closeTaskModal}
          >
            {t ('close')}
          </button>
        </div>
        <div
          className={`studtaskDetails ${
            currentQuestion?.template
              ? `template-${currentQuestion.template}`
              : ""
          }`}
        >
          {showFeedback && (
            <div
              className={`feedbackMessage ${
                feedbackMessage === "Correct!"
                  ? "fbmcorrect"
                  : "fbmincorrect"
              }`}
            >
              <div className="feedbackContent">
                <img src={feedbackMessage === "Correct!" ? correctlion : wronglion} alt="lion mascot" />
                <p
                  style={{
                    color: "black",
                    fontSize: "xx-large",
                    fontWeight: "700",
                    textAlign: "center",
                    backgroundColor:"white",
                    padding:"10px",
                    borderRadius:"10px",
                  }}
                >
                  {feedbackMessage === "Correct!"
                  ? t ('correct')
                  : t ('incorrect')}
                </p>
              </div>
            </div>
          )}
          <div className="questionCarousel">
            <div className="questionContent">
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  fontSize: "x-large",
                  padding: "7px 0",
                  gap: "1rem",
                }}
              >
                <li key={currentQuestionIndex}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: "0.33rem",
                      maxWidth: "500px",
                      textAlign: "center",
                      
                    }}
                  >
                    <span 
                      className=
                        {`questionTitle ${
                          currentQuestion?.template 
                            ? `qt-template-${currentQuestion.template}` 
                            : ""
                          }`}>
                      <strong>{currentQuestionIndex + 1}. </strong>
                      <i>{currentQuestion.title}:</i>{" "} <br />
                      <strong>{currentQuestion.question_text}</strong>
                    </span>
                    {currentQuestion.is_attempted && (
                      <strong style={{ color: "green", marginTop: "50px" }}>
                        {t ('alreadyAnswered')}
                      </strong>
                    )}
                    {currentQuestion.audio && (
                      <>
                        <div className="taskmodalaudio">
                          <button className="" onClick={toggleAudio}>
                            {isAudioPlaying ? <PauseIcon sx={{ fontSize: 50 }} /> : <PlayArrowIcon sx={{ fontSize: 50 }} />}
                          </button>
                        </div>
                        
                        <audio ref={audioRef} src={currentQuestion.audio} />
                      </>
                    )}
                    <div style={{
                          float: "right",
                          position:"absolute",
                          right:"0",
                          display:"flex",
                          flexDirection:"column",
                        }} className="audioContainer">
                      <button
                        className="transBtn"
                        onClick={toggleMute}
                        style={{color:"gray"}}
                      >
                        {isMuted ? <VolumeOffIcon sx={{fontSize:"70px"}}/> : <VolumeUpIcon sx={{fontSize:"70px"}}/>}
                      </button>
                      <input
                        type="range"
                        id="volumeControl"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                      />
                    </div>
                  </span>
                  {currentQuestion.question_type.startsWith(
                    "drag_and_drop"
                  ) ? (
                    <ul
                      className="studTaskOptions"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      {currentQuestion.options.map((option, idx) => (
                        <li
                          key={idx}
                          className="studTaskOption"
                          draggable
                          onDragStart={() => handleDragStart(option.id)}
                          onDrop={(event) => handleDrop(event, idx)}
                          onDragOver={allowDrop}
                          style={{ cursor: "move" }}
                        >
                          {currentQuestion.question_type ===
                          "drag_and_drop_images" ? (
                            <img
                              src={option.value}
                              alt={`option-${idx}`}
                              style={{ width: "100px", height: "100px" }}
                            />
                          ) : (
                            option.value
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className={currentQuestion.question_type === "multiple_choice_text" ?
                      "studTaskOptions" : "studTaskImgs"
                    }>
                      {currentQuestion.options.map((option, idx) => (
                        <li
                          key={idx}
                          className={currentQuestion.question_type === "multiple_choice_text" ? (
                            `studTaskOption ${
                            selectedOption === option.id
                              ? "studTaskOptionSelected"
                              : ""
                          }`
                          ) : (
                            `studTaskImg ${
                            selectedOption === option.id
                              ? "studTaskImgSelected"
                              : ""
                            }`
                          )}
                          onClick={() => {
                            handleOptionClick(option.id);
                          }}
                        >
                          {currentQuestion.question_type ===
                          "multiple_choice_images" ? (
                            <img
                              src={option.value}
                              alt={`option-${idx}`}
                              style={{ width: "100px", height: "100px" }}
                            />
                          ) : (
                            option.value
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="navigationButtons">
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <progress
              value={progress - 100 / questions.length}
              max="100"
              style={{ width: "60%", marginTop: "10px" }}
            ></progress>
            <button
              onClick={
                currentQuestionIndex === questions.length - 1
                  ? handleSubmit
                  : handleNextQuestion
              }
              disabled={
                (selectedOption === null && droppedOrder.length === 0) || isButtonDisabled
              }
              className={`${
                currentQuestionIndex === questions.length - 1
                  ? ""
                  : "orangeButton"
              }`}
              style={{ float: "right" }}
            >
              {currentQuestionIndex === questions.length - 1
                ? t ('finish')
                : t ('next')}
            </button>
          </span>
        </div>
      </div>
    </dialog>
  );
};

export default TaskModal;
