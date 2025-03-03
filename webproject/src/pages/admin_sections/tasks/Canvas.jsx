import React from 'react'
import { useContext, useEffect } from 'react'
import { TaskInterfaceContext } from './TaskContext'

const Canvas = ({
    currentQuestion,
    handleSelectCorrectAnswer,
    canvasRef
}) => {
    const {onBackspace, onPaste, onFocus} = useContext(TaskInterfaceContext);
    useEffect(() => {
        const handleKeyDown = (event) => {
            console.log(onFocus)
            if (!onFocus){
                if (event.key === "Backspace") {
                    console.log("Backspace pressed!");
                    onBackspace();
                }
                if ((event.ctrlKey || event.metaKey) && event.key === "c") {
                    console.log("Copy detected (Ctrl/Cmd + C)");
                }
                if ((event.ctrlKey || event.metaKey) && event.key === "v") {
                    console.log("Paste detected (Ctrl/Cmd + V)");
                    onPaste();
                }
            }
        };
    
        window.addEventListener("keydown", handleKeyDown);
    
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      }, [onBackspace, onFocus]);
    return (
        <canvas className={`taskPreview ${
            currentQuestion.template ? `template-${currentQuestion.template}` : ""
        }`} id="canvas" ref={canvasRef}
        >
            <p
                className="defaultStyle"
                style={{
                margin: "0",
                padding: "20px",
                maxWidth: "500px",
                maxHeight: "70px",
                fontSize: "large",
                textWrap: "wrap",
                textOverflow: "ellipsis",
                textAlign: "center",
                }}
            >
                {currentQuestion.title}
            </p>
            <div className="previewContent">
                <p
                style={{
                    margin: "0",
                    fontSize: "xx-large",
                    maxWidth: "500px",
                    maxHeight: "105px",
                    textWrap: "wrap",
                    textOverflow: "ellipsis",
                    textAlign: "center",
                }}
                >
                {currentQuestion.question_text}
                </p>
                <div className="previewOptions">
                {currentQuestion.options.map((option, index) => (
                    <div
                    key={index}
                    className={`previewOption ${
                        currentQuestion.correct_answer === index + 1
                        ? "correct-answer"
                        : ""
                    }`}
                    onClick={() => handleSelectCorrectAnswer(index)}
                    >
                    {currentQuestion.question_type ==
                    "multiple_choice_text" ? (
                        <p>{option}</p>
                    ) : (
                        <img
                        src={option}
                        alt={`Option ${index + 1}`}
                        style={{ width: "100px", height: "100px" }}
                        />
                    )}
                    </div>
                ))}
                </div>
            </div>
        </canvas>
    )
}

export default Canvas