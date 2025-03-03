import { Children, createContext, useState, useRef, useEffect, useCallback } from "react";
import {Circle, Rect} from "fabric";
export const TaskInterfaceContext = createContext(null);
import { handleObjectMoving, clearGuidelines } from "./canvas/snappingHelpers";

const TaskInterfaceProvider = ({children, canvas, setCanvas, currentQuestion, setContent}) => {
    const [selectedObject, setSelectedObject] = useState(null);
    const [properties, setProperties] = useState({
        width: "",
        height: "",
        diameter: "",
        color: "#fff"
    });
    const [onFocus, setOnFocus] = useState(false);
    const [questionDetails, setQuestionDetails] = useState(null);
    const [questionType, setQuestionType] = useState(null);
    const [isChoosingDropZone, setIsChoosingDropZone] = useState(null);
    const [dropZones, setDropZones] = useState(new Map());
    
    const addDropZone = (object) => {
        setDropZones(prev => {
            const newDropZones = new Map(prev);
            newDropZones.set(object.id, object);
            return newDropZones;
        });
    };

    console.log(questionType, dropZones, isChoosingDropZone)
    useEffect(()=>{
        if (currentQuestion){
            setQuestionDetails(currentQuestion);
            setQuestionType(currentQuestion.question_type);
        }
    }, [currentQuestion]);

    const [currentCanvas, setCurrentCanvas] = useState(null);
    console.log(canvas);
    const clearSettings = () => {
        setProperties({
            width: "",
            height: "",
            diameter: "",
            color: "#fff"
        });
    };
    const canvasRef = useRef(canvas); 
    const [guidelines, setGuideLines] = useState([]);

    useEffect(() => {
        if (canvas){
            setCurrentCanvas(canvas);
            canvasRef.current = canvas;
            canvas.on("object:moving", event => {
                handleObjectMoving(canvas, event.target, guidelines, setGuideLines);
            })

            canvas.on("object:modified", event => {
                clearGuidelines(canvas, guidelines, setGuideLines);
            })
        }
    }, [canvas]);

    useEffect(()=>{
        if (canvas && guidelines){
            console.log(guidelines);
            canvas.renderAll();
        }
    }, [guidelines])

    const setProperty = (name, value) => {
        setProperties(prev=>({...prev, [name]:value}));
    }

    const onBackspace = useCallback(() => {
        console.log("Canvas inside onBackspace:", Boolean(canvas), canvas);
        if (canvas && selectedObject) {
            canvas.remove(selectedObject);
            setSelectedObject(null);
            canvas.renderAll();
        } else {
            console.log("Canvas or selectedObject is missing.");
        }
    }, [canvas, selectedObject]);

    const onPaste = () => {
        if (selectedObject && canvas){
            if (canvas && selectedObject.type=="circle"){
                const circle = new Circle({
                    top:100,
                    left:50,
                    radius:properties.diameter/2,
                    fill: "#2f4dc6"
                });
                canvas.add(circle);
            }else if (canvas && selectedObject.type=="rect"){
                console.log(properties);
                const rectangle = new Rect({
                    top:100,
                    left:50,
                    width:properties.width,
                    height:properties.height,
                    fill: "#d84d42"
                });
                canvas.add(rectangle);
            }
        }
    }

    const handleSaveClick = () => {
        setContent({
            dropZones: Array.from(dropZones.values()),
            canvasData: canvas
        });
    }  

    return (
        <TaskInterfaceContext.Provider value={
            {onBackspace, selectedObject, setSelectedObject, 
            properties, setProperty, clearSettings, onPaste,
            onFocus, setOnFocus, questionDetails, questionType, 
            setQuestionType, isChoosingDropZone, setIsChoosingDropZone,
            dropZones, addDropZone, handleSaveClick
            }}
        >
            {children}
        </TaskInterfaceContext.Provider>
    )
}

export default TaskInterfaceProvider;