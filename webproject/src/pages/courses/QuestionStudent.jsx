import React, {useState, useRef, useEffect} from 'react';
import classes from "./TaskModal.module.css";
import DnDquestion from './DragAndDrop/DnDquestion';
import Outside from './Outside';

const QuestionStudent = ({currentQuestion, showFeedback, handleSubmit, 
    selectedOption, setSelectedOption, handleOptionClick}) => {

    const [content, setContent] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const canvasRef = useRef(null);
    const [dropZones, setDropZones] = useState(null);
    const [outsideElements, setOutsideElements] = useState([]);

    console.log(currentQuestion);

    function isProblemSolved(userAnswers) {
        if (currentQuestion.question_type==="drag_and_drop_images"){
            const currentCorrectAnswers = currentQuestion.content.correctAnswer;
            return currentCorrectAnswers.every(correct => {
            const userMapping = userAnswers.find(userAnswer => userAnswer.item === correct.item);
            return userMapping && userMapping.answer === correct.answer;
            });
        }
    }

    function checkCorrectAnswer(userAnswers){
        const solved = isProblemSolved(userAnswers);
        console.log(solved);
        if (solved){
            handleSubmit();
        }
    }

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

    useEffect(()=>{
        if (canvas){
          canvas.renderAll();
        }
    },[canvas]);
    
    console.log(canvas);

    const loadCanvas = (canvasJson, dropZones) => {
        const canvasElement = document.getElementById("clientcanvas");
        
        const newCanvas = new fabric.StaticCanvas(canvasRef.current, {
          width: canvasElement?.clientWidth,
          height: canvasElement?.clientHeight,
        });
    
        console.log(canvasJson, dropZones);
    
    
        const nonDropZoneObjects = canvasJson.objects.filter(
          (obj) => {
            if (!obj.hasOwnProperty('metadata')) {
                return obj;
            }
            if (!obj.metadata.hasOwnProperty('isDrop')){
                return obj;
            }
          }
        );
        const currentOutsideElements = canvasJson.objects.filter(obj=>obj.hasOwnProperty('metadata') && (obj.metadata.isDrop || obj.metadata.isDrag));
        
        setOutsideElements([...currentOutsideElements]);
        const filteredCanvasJson = { ...canvasJson, objects: nonDropZoneObjects };
        
        newCanvas.loadFromJSON(filteredCanvasJson, () => {
          newCanvas.renderAll();
          // Delay adding drop zones slightly to ensure loadFromJSON is fully done.
          setTimeout(() => {
            newCanvas.renderAll();
            setCanvas(newCanvas);
          }, 10); // adjust delay as needed
        });
    }

    console.log(outsideElements);

    return (
        <div className={`studtaskDetails ${
            currentQuestion?.template
              ? `template-${currentQuestion.template}`
              : ""
            }`} style={{position: "relative"}}
        >
            <canvas
                id="clientcanvas"
                ref={canvasRef}
                style={{display: "block"}}
            >
            </canvas>
            {currentQuestion.question_type.startsWith("drag_and_drop") && <div style={{position:"absolute", width:"100%", height:"100%"}}>
                <DnDquestion 
                    currentQuestion={currentQuestion} 
                    drags={outsideElements.filter(element=>{
                        if (element.metadata && element.metadata.isDrag){
                            return element
                        }
                    })}
                    drops={outsideElements.filter(element=>{
                        if (element.metadata && element.metadata.isDrop){
                            return element
                        }
                    })}
                    checkCorrectAnswer={checkCorrectAnswer}
                />
            </div>}

            {currentQuestion.question_type.startsWith("multiple_choice_text") && <div className={classes["overlay-content"]} id="overlay-content">
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
                    <li>
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
                    {(
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
            </div>}
      </div>
    )
}

export default QuestionStudent