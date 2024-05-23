
import React from 'react'
import ReactDOM from 'react-dom/client'
import {Link} from "react-router-dom";
import logoImg from "/src/assets/logo_blue.png"
function Login(){
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
                        
                    </div>
            </div>
            <div className="regPage" style={{display:"flex", justifyContent:"center"}}>
                <div className="regform">
                    <div className="formTitle">
                        <h3 className='form-h3'>Войти в Аккаунт</h3>
                        <Link to={"/registration"} className='formLink'>У меня нет аккаунта</Link>
                    </div>
                    
                    <form className='inputField' action='' method='get'>
                        
                        
                        <span className="gendemail">
                            
                            <span>
                                <label for="email">E-mail:</label><br/>
                                <input type="email" id="email" name="email" placeholder='maksat01@example.com' required style={{minWidth:"350px"}}/>
                            </span>
                            
                            
                        </span>
                        
                        <label for="password">Ваш пароль:</label><br/>
                        <input type="password" id="password" name="password" required placeholder='********' style={{maxWidth:"350px"}}/><br/>
                        <Link to={"/dashboard"}>
                            <input type="submit" value="Войти" className='orangeButton' style={{position:"relative", maxWidth:"200px", marginTop:"25px", marginBottom:"0", }}/>
                        </Link>
                        
                    </form>
                </div> 
            </div>
            
        </div>
            
        </>
    )
}

export default Login;