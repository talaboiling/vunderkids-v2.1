import React from 'react'
import Dimensions from './tools/Dimensions'
import Text from './tools/Text'
import Color from './tools/Color'
import Export from './tools/Export'
import {Square} from "lucide-react"
import { Circle } from 'lucide-react'
import { CaseSensitive } from 'lucide-react'
import Settings from './canvas/Settings'
import LayerList from './canvas/LayersList'

const ToolsBar = ({functions, canvas}) => {
  const {addRectangle, addCircle} = functions;
  return (
    <section className="taskToolsBar">
      <div className='taskToolsBar_header'>
        <Square size={40} onClick={addRectangle}/>
        <Circle size={40} onClick={addCircle}/>
        <CaseSensitive size={40}/>
        {/* <Text/>
        <Color/>
        <Color/>
        <Export/> */}
      </div>
      <Settings canvas={canvas}/>
      <LayerList canvas={canvas}/>
    </section>
  )
}

export default ToolsBar