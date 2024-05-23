import React from 'react'
import ReactDOM from 'react-dom/client'
import {Link} from "react-router-dom";
import logoImg from "/src/assets/logo_blue.png"
function Registration(){
    return(
        <>
        <div className="regacss">
            <div className="navBar" style={{justifyContent:"space-around"}}>
                    <Link to="/" style={{textDecoration:"none"}}>
                        <img className="navLogo" src={logoImg} alt="logo" style={{marginRight:"100px"}}/>
                    </Link>
                    <div className="excLogo">
                        <div className="navList">
                            <a href="#" className='navLink'>О ПЛАТФОРМЕ</a>
                            <a href="#" className='navLink'>ОБУЧЕНИЕ</a>
                            <a href="#" className='navLink'>ОТЗЫВЫ</a>
                            <a href="#" className='navLink'>КОНТАКТЫ</a>
                        </div>
                        <div className="navButton" style={{marginLeft:"80px"}}>
                            <button>ВХОД</button>
                        </div>
                    </div>
            </div>
            <div className="regPage">
                <div className="regform">
                    <div className="formTitle">
                        <h3 className='form-h3'>Создать Аккаунт</h3>
                        <Link to={"/login"} className='formLink'>У меня уже есть аккаунт</Link>
                    </div>
                    
                    <form className='inputField' action='' method='get'>
                        <label for="fname">Имя Фамилия Ребенка</label><br/>
                        <input type="text" id="fname" name="fname" placeholder='Мақсат Бектұрғын' required/><br/>
                        <label for="birth">Дата рождения</label><br/>
                        <input type="date" id="birth" name="birth" required/><br/>
                        <span className="gendemail">
                            <span>
                                <label for="gender">Пол</label><br/>
                                <input list="genders" name="gender" placeholder='Выбрать' required style={{maxWidth:"100px"}}/>
                                    <datalist id='genders'>
                                        <option value="Мальчик"/>
                                        <option value="Девочка"/>
                                    </datalist> <br />
                            </span>
                            <span>
                                <label for="email">E-mail:</label><br/>
                                <input type="email" id="email" name="email" placeholder='maksat01@example.com' required style={{width:'350px'}}/>
                            </span>
                            
                            
                        </span>
                        
                        <label for="password">Придумайте пароль:</label><br/>
                        <input type="password" id="password" name="password" required placeholder='********'/><br/>
                        
                        <input type="submit" value="Регистрация" className='orangeButton' style={{position:"relative", left: "325px", maxWidth:"200px", marginTop:"25px", marginBottom:"0"}}/>
                    </form>
                </div> 
            </div>
            
        </div>
            
        </>
    )
}

export default Registration;