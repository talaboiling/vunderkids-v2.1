import React, { useEffect, useState } from 'react'
import Dimensions from './tools/Dimensions'
import Text from './tools/Text'
import Color from './tools/Color'
import Export from './tools/Export'
import {Square, MousePointer2} from "lucide-react"
import { Circle } from 'lucide-react'
import { CaseSensitive } from 'lucide-react'
import Settings from './canvas/Settings'
import LayerList from './canvas/LayersList'
import { IText } from 'fabric'
import { useContext } from 'react'
import { TaskInterfaceContext } from './TaskContext'
import DropZones from './DropZones'

const ToolsBar = ({functions, canvas}) => {
  const {addRectangle, addCircle} = functions;
  const {onFocus, setOnFocus, questionType, setIsChoosingDropZone, isChoosingDropZone, handleSaveClick} = useContext(TaskInterfaceContext);
  console.log(questionType)

  const addText = () => {
    if (canvas){
        const iText = new IText("Double-click to edit", {
            left: 100,
            top: 100,
            fontSize: 24,
            fill: "#000000",
            fontFamily: "Arial",
        });

        iText.on("editing:entered", (event) => {
          setOnFocus(true);
        })

        iText.on("editing:exited", (event) => {
          setOnFocus(false);
        })

        console.log(iText)
        canvas.add(iText);
        canvas.renderAll();
    }
  }

  const handleDnDlogicClick = () => {
    setIsChoosingDropZone(true);
  }
  return (
    <section className="taskToolsBar">
      <div className='taskToolsBar_header'>
        <Square size={40} onClick={addRectangle}/>
        <Circle size={40} onClick={addCircle}/>
        <CaseSensitive size={40} onClick={addText}/>
        {/* <Text/>
        <Color/>
        <Color/>
        <Export/> */}
      </div>
      {/* <DropZones/> */}
      {questionType==="drag_and_drop_text" && 
        <div className='taskToolsBar_dropzone_options' style={{color: isChoosingDropZone ? "blue" : "inherit"}} onClick={handleDnDlogicClick}>
          <MousePointer2/>
          <p>Выбрать зону дропа</p>
        </div>
      }
      <Settings canvas={canvas}/>
      <LayerList canvas={canvas}/>
      <button onClick={handleSaveClick}>
        Save
      </button>
    </section>
  )
}

export default ToolsBar