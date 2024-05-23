import mascotImg from './assets/mascotImg.png';
import logoImg from './assets/logo_blue.png';
import {Link} from "react-router-dom";

function Header() {

    return (
        <div className="headerImg">
            
            <div className="navBar">
                <Link to="/" style={{textDecoration:"none"}}>
                    <img className="navLogo" src={logoImg} alt="logo"/>
                </Link>
                <div className="excLogo">
                    <div className="navList">
                        <a href="#" className='navLink'>О ПЛАТФОРМЕ</a>
                        <a href="#" className='navLink'>ОБУЧЕНИЕ</a>
                        <a href="#" className='navLink'>ОТЗЫВЫ</a>
                        <a href="#" className='navLink'>КОНТАКТЫ</a>
                    </div>
                    <div className="navButton">
                        <Link to={"/login"}>
                            <button>ВХОД</button>
                        </Link>
                        
                        <Link to={"/registration"}>
                            <button className="orangeButton">РЕГИСТРАЦИЯ</button>
                        </Link>
                        
                    </div>
                </div>
                
                
            </div>
            <div className="hooks">
                <div className="hook1">
                    <div className="hook1Desc">
                        <p style={{fontWeight:600, margin:0}}>ДОШКОЛЬНОЕ И НАЧАЛЬНОЕ ОБРАЗОВАНИЕ ОТ 5 ДО 12 ЛЕТ</p>
                        <div className="hook1Title">
                            <span className='spanAnim'><h1>ОНЛАЙН ШКОЛА ПО</h1></span>
                            <span className='spanAnim'><h1>МАТЕМАТИКЕ И</h1></span>
                            <span className='spanAnim'><h1>АНГЛИЙСКОМУ ЯЗЫКУ</h1></span>
                        </div>
                        
                        <button style={{padding:"10px 17px", width:"60%", marginTop:"2rem", borderColor:'white'}}>ПОПРОБУЙТЕ БЕСПЛАТНО</button>
                    </div>

                    <img src={mascotImg} alt="lionimg" style={{scale:"0.8"}} />
                    
                </div>
                
                
                
                
            </div>
            
        </div>
        
    );
}

export default Header;