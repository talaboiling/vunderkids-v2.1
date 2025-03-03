import React, { useEffect, useRef, useState } from "react";
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DraggableItem from './DraggableItem';
import DroppablePlaceholder from './DroppablePlaceholder';
import CustomDragLayer from './CustomDragLayer';
import staricon from "../../assets/navStars.webp";
import cupicon from "../../assets/navCups.webp";
import correctlion from "../../assets/lion_correct.webp";
import wronglion from "../../assets/lion_incorrect.webp";
import audioOn from "../../assets/taskaudio_new.svg";
import audioOff from "../../assets/notaskaudio.svg";
import bgmusicOn from "../../assets/bgmusic_new.svg";
import bgmusicOff from "../../assets/nobgmusic.svg";
import CloseIcon from '@mui/icons-material/Close';
import { Canvas, Rect, Circle, StaticCanvas } from "fabric";
import classes from "./TaskModal.module.css"
import DnDquestion from "./DragAndDrop/DnDquestion";

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
  const [content, setContent] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef(null);
  const [dropZones, setDropZones] = useState(null);

  console.log(currentQuestion)
  useEffect(()=>{
    if (currentQuestion){
      setContent(currentQuestion.content);
      loadCanvas(currentQuestion.content.canvasData, currentQuestion.content.dropZones);
    }

    return () => {
      if (canvas){
        canvas.dispose();
      }
    }
  }, [currentQuestion]);

  console.log(canvas);

  useEffect(()=>{
    if (canvas){
      canvas.renderAll();
    }
  },[canvas]);

  const loadCanvas = (canvasJson, dropZones) => {
    const canvasElement = document.getElementById("clientcanvas");
    
    const newCanvas = new StaticCanvas(canvasRef.current, {
      width: canvasElement?.clientWidth,
      height: canvasElement?.clientHeight,
    });

    console.log(canvasJson, dropZones);


    const nonDropZoneObjects = canvasJson.objects.filter(
      (obj) => !obj.isDropZone
    );
    const filteredCanvasJson = { ...canvasJson, objects: nonDropZoneObjects };
    
    newCanvas.loadFromJSON(filteredCanvasJson, () => {
      newCanvas.renderAll();
      // Delay adding drop zones slightly to ensure loadFromJSON is fully done.
      setTimeout(() => {
        dropZones.forEach((dz) => {
          const dropZone = new Rect({
            left: dz.left,
            top: dz.top,
            width: dz.width,
            height: dz.height,
            fill: dz.fill || 'rgba(0,0,0,0.1)',
            stroke: dz.stroke || 'blue',
            strokeDashArray: dz.strokeDashArray || [5, 5],
            selectable: false,
            evented: false,
          });
          newCanvas.add(dropZone);
        });
        newCanvas.renderAll();
        setCanvas(newCanvas);
      }, 10); // adjust delay as needed
    });
  }


  return (
    <dialog className="studmodal" open style={{display:"flex", justifyContent:"center"}}>
      <div className="studmodal-content">
        <div className="modalHeader" style={{position: "relative"}}>
          <span style={{ display: "flex", flexDirection: "row", gap: "2rem", alignItems:"center" }}>
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
            <button
              className="transBtn"
              onClick={toggleMute}
              style={{ color: "gray" }}
            >
              {isMuted ? (
                <div className="bgmusicOff" >
                  <img src={bgmusicOff} alt="music off" style={{width:"40px", height:"40px"}}/>
                </div>
              ) : (
                <div className="bgmusicOn">
                  <img src={bgmusicOn} alt="music on" style={{width:"40px", height:"40px"}}/>
                </div>
              )}
            </button>
            {currentQuestion.audio && (
              <>
                <div className="taskmodalaudio">
                  <button className="transBtn" onClick={toggleAudio}>
                    {isAudioPlaying ? (
                      <div className="audioOn">
                        <img src={audioOn} alt="audio on" style={{width:"40px", height:"40px"}}/>
                      </div>
                    ) : (
                      <div className="audioOff">
                        <img src={audioOff} alt="audio off" style={{width:"40px", height:"40px"}}/>
                      </div>
                    )}
                  </button>
                </div>
                <audio
                  ref={audioRef}
                  src={currentQuestion.audio}
                  onEnded={() => setIsAudioPlaying(false)}
                />
              </>
            )}
          </span>

          <button
            className="modalCloseBtn"
            onClick={closeTaskModal}
          >
            {t("close")}
          </button>
          <button
            className="transBtn modalCloseBtnMob"
            onClick={closeTaskModal}
          >
            <CloseIcon></CloseIcon>
          </button>
        </div>
        <div className={`studtaskDetails ${
              currentQuestion?.template
                ? `template-${currentQuestion.template}`
                : ""
            }`} style={{position: "relative"}}>
          <canvas
            id="clientcanvas"
            ref={canvasRef}
            style={{display: "block"}}
          >
          </canvas>
          <div className={classes["overlay-content"]}>
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
                    {/* <span
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
                          {currentQuestion.question_text}
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
                      <div
                        style={{
                          float: "right",
                          position: "absolute",
                          right: "0",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        
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
                    </span> */}
                    {currentQuestion.question_type.startsWith("drag_and_drop") ? (
                      <DnDquestion 
                        currentQuestion={currentQuestion} 
                        droppedOrder={droppedOrder}
                        handleDragEnd={handleDragEnd}
                      />
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
