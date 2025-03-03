import React, { useEffect, useRef, useState } from 'react'
import Color from '../tools/Color';
import { useContext } from 'react';
import { TaskInterfaceContext } from '../TaskContext';

const Settings = ({canvas}) => {
    const {selectedObject, setSelectedObject, properties, setProperty, clearSettings, 
        onFocus, setOnFocus, questionType, isChoosingDropZone, dropZones, addDropZone, setIsChoosingDropZone} = useContext(TaskInterfaceContext);
    const colorRef = useRef();
    const {width, height, color, diameter} = properties;
    console.log(isChoosingDropZone)

    useEffect(()=>{
        if (canvas){
            canvas.on("selection:created", (event)=>{
                handleObjectSelection(event.selected[0]);
            });

            canvas.on("selection:update", (event)=>{
                handleObjectSelection(event.selected[0]);
            });

            canvas.on("selection:cleared", ()=>{
                setSelectedObject(null);
                clearSettings();
            });

            canvas.on("object:modified", (event)=>{
                handleObjectSelection(event.target);
            });

            canvas.on("object:scaling", (event)=>{
                handleObjectSelection(event.target);
            });

            canvas.on("object:editing:entered", (event) => {
                setOnFocus(true);
            });

            canvas.on("mouse:down", (event) => {
                if (event.target) {
                  handleObjectSelection(event.target);
                }
            });

            // canvas.on("text:changed", (event) => {
            //     const textObj = event.target;
            //     console.log(textObj, onFocus)
            //     if (textObj && (textObj.type === "i-text" || textObj.type === "textbox")) {
            //       setOnFocus(true);
            //     }
            // });

        }
    }, [canvas, isChoosingDropZone]);

    const handleObjectSelection = (object) => {
        if (isChoosingDropZone){
            console.log(object.id, dropZones)
            addDropZone(object);
            setIsChoosingDropZone(false);
            console.log("chose drop zone, 12342134", selectedObject);
        }

        console.log(object, isChoosingDropZone);
        setSelectedObject(object);
        setOnFocus(false);

        if (object.type==="rect"){
            console.log(object.width, object.height)
            setProperty("width", Math.round(object.width * object.scaleX));
            setProperty("height", Math.round(object.height * object.scaleY));
            setProperty("color", object.fill);
            setProperty("diameter", "");
        }else if (object.type==="circle"){
            setProperty("diameter", Math.round(object.radius * 2 * object.scaleX));
            setProperty("color", object.fill);
            setProperty("width", "");
            setProperty("height", "");
        }
    };

    useEffect(()=>{
        if (selectedObject){
            console.log(selectedObject);
            setProperty("color", selectedObject.fill);
        }
    },[selectedObject]);

    const handleWidthChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value, 10);
        setProperty("width", intValue);

        if (selectedObject && selectedObject.type==="rect" && intValue>=0){
            selectedObject.set({width: intValue / selectedObject.scaleX});
            canvas.renderAll();
        }
    };

    const handleHeightChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value, 10);
        setProperty("height", intValue);

        if (selectedObject && selectedObject.type==="rect" && intValue>=0){
            selectedObject.set({height: intValue / selectedObject.scaleY});
            canvas.renderAll();
        }
    };

    const handleDiameterChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value, 10) || 0;
        setProperty("diameter", intValue);

        if (selectedObject && selectedObject.type==="circle" && intValue>=0){
            selectedObject.set({radius: intValue / 2 / selectedObject.scaleX});
            canvas.renderAll();
        }
    }

    const handleColorChange = (value) => {
        console.log(value);
        setProperty("color", value);

        if (selectedObject) {
            console.log(12341234, selectedObject)
            selectedObject.set({ fill: value });
            canvas.renderAll();
        }
    }

    return (
        <div className='taskCanvasSettings'>
            <Color placeholder="color" attribute={color} inputRef={colorRef} handleInputChange={handleColorChange}/>
            {/* {selectedObject && selectedObject.type === "rect" && (
                <>
                    <input placeholder='Width' value={width || ""} onChange={handleWidthChange} onFocus={()=>setOnFocus(true)} onBlur={()=>setOnFocus(false)}/>
                    <input placeholder='Height' value={height || ""} onChange={handleHeightChange} onFocus={()=>setOnFocus(true)} onBlur={()=>setOnFocus(false)}/>
                </>
            )}
            {selectedObject && selectedObject.type === "circle" && (
                <>
                    <input placeholder='Diameter' value={diameter || ""} onChange={handleDiameterChange} onFocus={()=>setOnFocus(true)} onBlur={()=>setOnFocus(false)} />
                </>
            )} */}
        </div>
    )
}

export default Settings