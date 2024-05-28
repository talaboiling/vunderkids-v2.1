import React from 'react'
import '/src/superdash.css';
import Superside from './admin_components/Superside.jsx'
import {useState} from 'react'

const schools = [
    {
        id: 1,
        name: "Школа №1",
        address: "ул. Ленина 1",
        city: "Shymkent",
        studentNum: 122,
        email: "school1@example.com"
    },
    {
        id: 2,
        name: "Школа №2",
        address: "ул. Ленина 2",
        city: "Astana",
        studentNum: 566,
        email: "d@mail.com"
    },
    {
        id: 3,
        name: "Школа №2",
        address: "ул. Ленина 2",
        city: "Astana",
        studentNum: 566,
        email: "d@mail.com"
    },
    {
        id: 4,
        name: "Школа №2",
        address: "ул. Ленина 2",
        city: "Astana",
        studentNum: 566,
        email: "d@mail.com"
    },
    {
        id: 5,
        name: "Школа №2",
        address: "ул. Ленина 2",
        city: "Astana",
        studentNum: 566,
        email: "d@mail.com"
    },
    {
        id: 6,
        name: "Школа №2",
        address: "ул. Ленина 2",
        city: "Astana",
        studentNum: 566,
        email: "d@mail.com"
    },
    {
        id: 7,
        name: "Школа №2",
        address: "ул. Ленина 2",
        city: "Astana",
        studentNum: 566,
        email: "d@mail.com"
    },

]

const Superdash = () => {
    const [searchItem, setSearchItem] = useState('')
    const [filteredSchools, setFilteredSchools] = useState(schools)

    const handleInputChange = (e) => {
        const searchTerm = e.target.value;
        setSearchItem(searchTerm)

        const filteredItems = schools.filter((school) =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredSchools(filteredItems);
    }

  return (
    <div className='spdash'>
        <Superside />
        <div className="superMain">
            <button style={{border:"none", borderRadius:"4px", backgroundColor:"transparent", color:"#444", fontSize:"large", float:"right"}}>Выйти</button>
            <p style={{fontSize:"x-large", fontWeight:"500", color:"#666"}}>Школы</p>
            <div className="addschool">
                <button style={{border:"none", borderRadius:"4px", backgroundColor:'#509CDB', fontSize:"large", fontWeight:"600"}}>Добавть школу</button>
            </div>
            <div className="superCont">
                <div className="superSearch">
                    <input 
                        type="text"
                        value={searchItem}
                        onChange={handleInputChange}
                        placeholder='Поиск школы по названию или ID'
                        style={{border:"none", width:"50%"}}
                    />
                </div>
                <ul className='schoolsList'>
                    {filteredSchools.map(school => <li key={school.id} className='schoolItem'>
                        <p style={{margin:"0", marginBottom:"10px"}}>{school.name}</p>
                        {school.city} <br />
                        <p style={{margin:"0", marginTop:"30px", fontWeight:"500"}}>Количество учеников: {school.studentNum}</p>
                    </li>)}
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Superdash