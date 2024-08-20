import React, { useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import staricon from "../../assets/navStars.webp";
import cupicon from "../../assets/navCups.webp";
import correctlion from "../../assets/lion_correct.webp";
import wronglion from "../../assets/lion_incorrect.webp";
import audioOn from "../../assets/taskaudio_new.svg";
import audioOff from "../../assets/notaskaudio.svg";
import bgmusicOn from "../../assets/bgmusic_new.svg";
import bgmusicOff from "../../assets/nobgmusic.svg";

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
  audioRef,
  setIsAudioPlaying,
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <dialog className="studmodal" open>
      <div className="studmodal-content">
        <div className="modalHeader">
          <span style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
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
            {t("close")}
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
                feedbackMessage === "Correct!" ? "fbmcorrect" : "fbmincorrect"
              }`}
            >
              <div className="feedbackContent">
                <img
                  src={feedbackMessage === "Correct!" ? correctlion : wronglion}
                  alt="lion mascot"
                />
                {feedbackMessage === "Correct!" ? (
                  <p
                    style={{
                      color: "limegreen",
                      fontSize: "xx-large",
                      fontWeight: "700",
                      textAlign: "center",
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "15px",
                      border: "5px solid green",
                    }}
                  >
                    {t("correct")}
                  </p>
                ) : feedbackMessage === "Incorrect!" ? (
                  <p
                    style={{
                      color: "black",
                      fontSize: "xx-large",
                      fontWeight: "700",
                      textAlign: "center",
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "15px",
                      border: "5px solid #fa3b3b",
                    }}
                  >
                    {t("incorrect")}
                  </p>
                ) : feedbackMessage === "Try Again" ? (
                  <p
                    style={{
                      color: "orange",
                      fontSize: "xx-large",
                      fontWeight: "700",
                      textAlign: "center",
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "15px",
                      border: "5px solid orange",
                    }}
                  >
                    {t("tryAgain")}
                  </p>
                ) : null}
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
                      flexDirection: "column",
                      alignItems: "center",
                      maxWidth: "500px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      className={`questionTitle ${
                        currentQuestion?.template
                          ? `qt-template-${currentQuestion.template}`
                          : ""
                      }`}
                    >
                      <strong>{currentQuestionIndex + 1}. </strong>
                      <i>{currentQuestion.title}:</i> <br />
                      <strong>
                        {currentQuestion.question_text
                          .split("_")
                          .map((part, index) => (
                            <React.Fragment key={index}>
                              {part}
                              {index <
                                currentQuestion.question_text.split("_")
                                  .length -
                                  1 && (
                                <span className="dnd-placeholder">
                                  {droppedOrder[index]?.value || "_____"}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                      </strong>
                    </span>
                    {currentQuestion.is_attempted && (
                      <strong
                        style={{
                          color: "green",
                          padding: "35px",
                          backdropFilter: "blur(2px)",
                        }}
                      >
                        {t("alreadyAnswered")}
                      </strong>
                    )}
                    {currentQuestion.audio && (
                      <>
                        <div className="taskmodalaudio">
                          <button className="transBtn" onClick={toggleAudio}>
                            {isAudioPlaying ? (
                              <div className="audioOn">
                                <img src={audioOn} alt="audio on" />
                              </div>
                            ) : (
                              <div className="audioOff">
                                <img src={audioOff} alt="audio off" />
                              </div>
                            )}
                          </button>
                        </div>
                        <li></li>
                        <audio
                          ref={audioRef}
                          src={currentQuestion.audio}
                          onEnded={() => setIsAudioPlaying(false)}
                        />
                      </>
                    )}
                    <div
                      style={{
                        float: "right",
                        position: "absolute",
                        right: "0",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <button
                        className="transBtn"
                        onClick={toggleMute}
                        style={{ color: "gray" }}
                      >
                        {isMuted ? (
                          <div className="bgmusicOff">
                            <img src={bgmusicOff} alt="music off" />
                          </div>
                        ) : (
                          <div className="bgmusicOn">
                            <img src={bgmusicOn} alt="music on" />
                          </div>
                        )}
                      </button>
                      <input
                        type="range"
                        id="volumeControl"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{ scale: "0.6" }}
                      />
                    </div>
                  </span>
                  {currentQuestion.question_type.startsWith("drag_and_drop") ? (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="droppable" direction="horizontal">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="dndPlaceholders"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              flexWrap: "wrap",
                              gap: "1rem",
                            }}
                          >
                            {currentQuestion.question_text
                              .split("_")
                              .map((text, index) => (
                                <span key={index}>
                                  {text}
                                  {index <
                                    currentQuestion.question_text.split("_")
                                      .length -
                                      1 && (
                                    <Droppable
                                      droppableId={`droppable-${index}`}
                                      direction="horizontal"
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.droppableProps}
                                          className="placeholder"
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                            border: "2px dashed #ccc",
                                            display: "inline-block",
                                            backgroundColor:
                                              snapshot.isDraggingOver
                                                ? "lightblue"
                                                : "inherit",
                                          }}
                                        >
                                          {droppedOrder[index] && (
                                            <Draggable
                                              key={`option-${droppedOrder[index].id}`}
                                              draggableId={`option-${droppedOrder[index].id}`}
                                              index={index}
                                            >
                                              {(provided, snapshot) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  style={{
                                                    ...provided.draggableProps
                                                      .style,
                                                    width: "100px",
                                                    height: "100px",
                                                    background:
                                                      snapshot.isDragging
                                                        ? "lightgreen"
                                                        : "lightgray",
                                                  }}
                                                >
                                                  {
                                                    currentQuestion.options.find(
                                                      (option) =>
                                                        option.id ===
                                                        droppedOrder[index]
                                                    )?.value
                                                  }
                                                </div>
                                              )}
                                            </Draggable>
                                          )}
                                          {provided.placeholder}
                                        </div>
                                      )}
                                    </Droppable>
                                  )}
                                </span>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Droppable droppableId="options" direction="horizontal">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="dndOptions"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              flexWrap: "wrap",
                              gap: "1rem",
                            }}
                          >
                            {currentQuestion.options.map((option, idx) => (
                              <Draggable
                                key={`option-${option.id}`}
                                draggableId={`option-${option.id}`}
                                index={idx}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                      width: "100px",
                                      height: "100px",
                                      background: snapshot.isDragging
                                        ? "lightgreen"
                                        : "lightgray",
                                      textAlign: "center",
                                      lineHeight: "100px",
                                    }}
                                  >
                                    {option.value}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    <ul
                      className={
                        currentQuestion.question_type === "multiple_choice_text"
                          ? "studTaskOptions"
                          : "studTaskImgs"
                      }
                    >
                      {currentQuestion.options.map((option, idx) => (
                        <li
                          key={idx}
                          className={
                            currentQuestion.question_type ===
                            "multiple_choice_text"
                              ? `studTaskOption ${
                                  selectedOption === option.id
                                    ? "studTaskOptionSelected"
                                    : ""
                                }`
                              : `studTaskImg ${
                                  selectedOption === option.id
                                    ? "studTaskImgSelected"
                                    : ""
                                }`
                          }
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
                (selectedOption === null && droppedOrder.length === 0) ||
                isButtonDisabled
              }
              className={`${
                currentQuestionIndex === questions.length - 1
                  ? ""
                  : "orangeButton"
              }`}
              style={{ float: "right" }}
            >
              {currentQuestionIndex === questions.length - 1
                ? t("finish")
                : t("next")}
            </button>
          </span>
        </div>
      </div>
    </dialog>
  );
};

export default TaskModal;
