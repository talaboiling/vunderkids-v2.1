import { Children, createContext, useState, useRef, useEffect, useCallback } from "react";
export const TaskInterfaceContext = createContext(null);
import { handleObjectMoving, clearGuidelines } from "./canvas/snappingHelpers";
import { fabric } from "fabric";

const TaskInterfaceProvider = ({children, canvas, setCanvas, currentQuestion, setContent,handleCorrectAnswer}) => {
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
    const [isLinkingDnd, setIsLinkingDnd] = useState(false);
    const [links, setLinks] = useState([]);

    const addDropZone = (object) => {
        setDropZones(prev => {
            const newDropZones = new Map(prev);
            newDropZones.set(object.id, object);
            return newDropZones;
        });
    };

    console.log(questionType, dropZones, isChoosingDropZone, canvas)
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

    // const onBackspace = useCallback(() => {
    //     console.log("Canvas inside onBackspace:", Boolean(canvas), canvas);
    //     if (canvas && selectedObject) {
    //         canvas.remove(selectedObject);
    //         setSelectedObject(null);
    //         canvas.renderAll();
    //     } else {
    //         console.log("Canvas or selectedObject is missing.");
    //     }
    // }, [canvas, selectedObject]);

    function addImage(imageSrc){   
        console.log(imageSrc, canvas);
        if (canvas) {
            fabric.Image.fromURL(imageSrc, (img) => {
              img.scaleToWidth(100);
              img.scaleToHeight(100);
              img.set({
                left: canvas.width / 2 - img.width / 4,
                top: canvas.height / 2 - img.height / 4,
                selectable: true,
                lockUniScaling: true,
              });
              img.setControlsVisibility({
                mt: false, // top middle
                mb: false, // bottom middle
                ml: false, // middle left
                mr: false, // middle right
              });
              canvas.add(img);
              console.log(img);
              canvas.renderAll();
            });
          }
    }

    const onPaste = () => {
        console.log(selectedObject, canvas);
        if (selectedObject && canvas){
            if (canvas && selectedObject.type=="circle"){
                const circle = new fabric.Circle({
                    top:100,
                    left:50,
                    radius:properties.diameter/2,
                    fill: "#2f4dc6"
                });
                canvas.add(circle);
            }else if (canvas && selectedObject.type=="rect"){
                console.log(properties);
                const rectangle = new fabric.Rect({
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
        if (questionType=="drag_and_drop_text"){
            setContent({
                dropZones: Array.from(dropZones.values()),
                canvasData: canvas
            });
        } else if (questionType=="drag_and_drop_images"){
            setContent({
                links: [...links],
                canvasData: canvas
            });
            handleCorrectAnswer([...links]);
        }
    }  
    

    console.log(links);
    function removeObject(){
        if (selectedObject && canvas){
            canvas.remove(selectedObject);
            canvas.renderAll();
        }
    }

    return (
        <TaskInterfaceContext.Provider value={
            {selectedObject, setSelectedObject, 
                properties, setProperty, clearSettings, onPaste,
                onFocus, setOnFocus, questionDetails, questionType, 
                setQuestionType, isChoosingDropZone, setIsChoosingDropZone,
                dropZones, addDropZone, handleSaveClick, addImage, removeObject,
                isLinkingDnd, setIsLinkingDnd, links, setLinks
            }}
        >
            {children}
        </TaskInterfaceContext.Provider>
    )
}

export default TaskInterfaceProvider;