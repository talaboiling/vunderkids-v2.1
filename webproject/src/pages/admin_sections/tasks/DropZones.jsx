import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { TaskInterfaceContext } from './TaskContext'
const DropZones = () => {
    const {dropZones} = useContext(TaskInterfaceContext);
    const [zonesList, setZonesList] = useState([]);

    useEffect(()=>{
        if (dropZones){
            setZonesList(Array.from(dropZones.keys()));
        }
    }, [dropZones])
    console.log(zonesList);
    return (
        <ul>
            {zonesList.length>0 && zonesList.map(zone=>(
                <li key={zone}>
                    {zone}
                </li>
            ))}
        </ul>
    )
}

export default DropZones