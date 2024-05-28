import React from 'react'
import '/src/superdash.css';
import Superside from '../admin_components/Superside'
import {useState} from 'react'
import Studenttable from '../admin_components/Studentstable'
import { Link, useNavigate } from "react-router-dom";

const students = [
    {
        student_id: 1,
        name: "Yestay Anuarbekov",
        school: "Школа №1",
        gender: "Male",
        grade: 3,
        email: "lordyestay@gmail.com"
    },
    {
        student_id: 1,
        name: "Yestay Anuarbekov",
        school: "Школа №1",
        gender: "Male",
        grade: 3,
        email: "lordyestay@gmail.com"
    },
    
    
]


const Students = () => {
    const [searchItem, setSearchItem] = useState('')

    const handleInputChange = (e) => {
        const searchTerm = e.target.value;
        setSearchItem(searchTerm)
    }

  return (
    <div className='spdash'>
        <Superside/>
        <div className="superMain">
            <Link to={"/login"}>
                <button style={{border:"none", borderRadius:"4px", backgroundColor:"transparent", color:"#444", fontSize:"large", float:"right"}}>Выйти</button>
            </Link>

            <p style={{fontSize:"x-large", fontWeight:"500", color:"#666"}}>Ученики</p>
            <div className="superCont">
                <div className="superSearch">
                    <input 
                        type="text"
                        value={searchItem}
                        onChange={handleInputChange}
                        placeholder='Поиск ученика по имени или почте'
                        style={{border:"none", width:"50%"}}
                    />
                </div>
                <div className="superTable">
                    <Studenttable students={students} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Students