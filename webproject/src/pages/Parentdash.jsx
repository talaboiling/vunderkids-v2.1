
import {Link} from "react-router-dom";
import logoImg from '../assets/logo_blue.png';
import '/src/dashboard.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import plusicon from '../assets/plus_icon.png'
import CloseIcon from '@mui/icons-material/Close';
import pfplaceholder from '../assets/placehoder_pfp.png'
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];

const Parentdash = () => {
    const [user, setUser] = useState({ first_name: 'Родитель', last_name: '' }); // Default values

    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        setFile(file);
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                try {
                    const response = await axios.get('http://localhost:8000/api/current-user', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Error fetching current user:', error);
                }
            }
        };

        fetchCurrentUser();
    }, []);

/*    const openButton = document.querySelector("[data-open-modal")
    const closeButton = document.querySelector("[data-close-modal]")
    const modal = document.querySelector("[data-modal]")

    openButton.addEventListener("click", () => {
        modal.showModal()
    })

    closeButton.addEventListener("click", () => {
        modal.close()
    }) */

    return (
    <div className='parentdash'>

        <div className="navBar" style={{margin:"0"}}>
                <Link to="/" style={{textDecoration:"none"}}>
                    <img className="navLogo" src={logoImg} alt="logo"/>
                </Link>
                <div className="excLogo">
                    <div className="mailname">
                        {user.email}
                    </div>
                    <div className="navButton">
                        <Link to={"/login"}>
                            <button>ВЫЙТИ</button>
                        </Link>
                        
                    </div>
                </div>
        </div>

        <div className="addchildren">
            <button data-open-modal className="addchildbtn">
                <img src={plusicon} alt="" />
                <p style={{fontSize:"x-large", fontWeight:"500"}}>Добавить ребенка</p>
            </button>
            <button data-open-modal className="addchildbtn">
                <img src={plusicon} alt="" />
                <p style={{fontSize:"x-large", fontWeight:"500"}}>Добавить ребенка</p>
            </button>
            <button data-open-modal className="addchildbtn">
                <img src={plusicon} alt="" />
                <p style={{fontSize:"x-large", fontWeight:"500"}}>Добавить ребенка</p>
            </button>

            <dialog data-modal>
                <div className="modal-content">
                    <button data-close-modal style={{border:"none", backgroundColor:"transparent", boxShadow:"none", float:"right", padding:"0", margin:"0"}}><CloseIcon sx={{color:"grey"}}/></button>
                    
                    <form className='inputField'>
                        <div className="childavatar">
                            <img src={pfplaceholder} alt="pfp" />
                            <FileUploader handleChange={handleChange} name="file" types={fileTypes}/>
                        </div>
                        <label htmlFor="name">Имя Фамилия Ребенка</label>
                        <input type="text" id="name" name="name" placeholder="Мақсат Бектұрғын" required/>
                        <br />
                        <label htmlFor="date">Дата Рождения</label>
                        <input type="date" id="date" name="date" required/>
                        <br />
                        <div className="gendgrade" style={{}}>
                            <span>
                                <label htmlFor="gender">Пол</label><br />
                                <input list="genders" id="gender" name="gender" placeholder="Мальчик" style={{maxWidth:"fit-content"}} required/>
                            </span>
                            <datalist id="genders">
                                <option value="Мальчик"/>
                                <option value="Девочка"/>
                            </datalist>
                            <span>
                                <label htmlFor="grade">Класс</label><br />
                                <input list="grades" id="grade" name="grade" placeholder="Дошкольный" style={{maxWidth:"fit-content"}} required/>
                            </span>
                            
                            <datalist id="grades">
                                <option value="Дошкольный"/>
                                <option value="1"/>
                                <option value="2"/>
                                <option value="3"/>
                            </datalist>
                        </div>
                        <div style={{display:'flex', justifyContent:"center", marginTop:"20px"}}>
                            <button type="submit">Добавить Ребенка</button>
                        </div>
                        
                    </form>
                </div>
            </dialog>
        </div>
    </div>
    )
}

export default Parentdash