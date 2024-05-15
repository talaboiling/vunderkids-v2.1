import icon_games from './assets/icon_games.png';
import icon_books from './assets/icon_books.png';
import icon_cert from './assets/icon_cert.png';
import icon_tablet from './assets/icon_tablet.png';
import img_laptop from './assets/img_laptop.png';
import icon_stars from './assets/stars_decor.png';
import laptops from './assets/laptops_img.png';
import tablet from './assets/tablet_img.png';
import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import Offers from './Offers.jsx'
import OffersBot from './OffersBot.jsx'
import background from './assets/pngwing.png';
import logo_bottom from './assets/logo_bottom.png';
import icon_grad from './assets/icon_grad.png';
import icon_school from './assets/icon_school.png';
import offer_books from './assets/offer_books.png';
import offer_certificate from './assets/offer_certificate.png';
import offer_gaming from './assets/offer_gaming.png';
import offer_tablet from './assets/offer_tablet.png';
import offer_progress from './assets/offer_progress.png';
import offer_time from './assets/offer_time.png';
import logoImg from './assets/logo_blue.png';
import bottomBack from './assets/bottomcontimg.png'
function Contents() {
    useEffect(() => {
        
    }, []);
    return (
        <>
        <div className="contents">
            <div className="beforeCont"></div>
            <div className="contLeft">
                <ul style={{listStyleType: 'none', padding: 5, margin: 0, lineHeight: 1.5 }}>
                    <li style={{display:"flex", gap:"1rem", alignItems:"center"}}>
                        <img src={icon_games} alt="icon_games" />
                        <div style={{display:"flex", flexDirection:"column", margin:"0", padding:"0", maxWidth:"150px"}}>
                            <h3 style={{margin:"0"}}>Видео игры</h3><p style={{fontWeight:"400", fontSize:"small"}}>Получайте монеты за правильный ответ и меняйте их на питомцев</p>
                            
                        </div>
                    </li>
                    <li style={{display:"flex", gap:"0.7rem", alignItems:"center"}}>
                        <img src={icon_books} alt="icon_books" />
                        <div style={{display:"flex", flexDirection:"column", margin:"0", padding:"0", maxWidth:"150px"}}>
                            <h3 style={{margin:"0"}}>Мотивирующие задачи</h3><p style={{fontWeight:"400", fontSize:"small"}}>Повышайте свой уровень и получайте больше монет</p>
                        </div>
                    </li>
                    <li style={{display:"flex", gap:"1rem", alignItems:"center"}}>
                        <img src={icon_cert} alt="icon_certificate" />
                        <div style={{display:"flex", flexDirection:"column", margin:"0", padding:"0", maxWidth:"150px"}}>
                            <h3 style={{margin:"0"}}>Сертификаты</h3><p style={{fontWeight:"400", fontSize:"small"}}>Получите валидные сертификаты о завершении курса</p>
                        </div>
                    </li>
                    <li style={{display:"flex", gap:"0.7rem", alignItems:"center"}}>
                        <img src={icon_tablet} alt="icon_tablet" />
                        <div style={{display:"flex", flexDirection:"column", margin:"0", padding:"0", maxWidth:"150px"}}>
                            <h3 style={{margin:"0"}}>Различные темы</h3><p style={{fontWeight:"400", fontSize:"small"}}>Курс включает в себя большое разнообразие тем</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="contRight">
            <img src={icon_stars} alt="" style={{position:"absolute", marginLeft:"370px", width:"8%"}}/>
                <motion.div className="titleAnim" initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:0.6}}>
                    <span><h2>Качественное</h2></span>
                    <span><h2>образование зависит</h2></span>
                    <span><h2>от родителей</h2></span>
                </motion.div>
                
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <img src={icon_stars} alt="" style={{position:"absolute", width:"6%", marginLeft:"-50px", marginTop:"-120px"}}/>
                    <div style={{marginTop:"50px"}}>
                        <div className="contDisplay">
                            <h4>Мотивирующие задачи</h4>
                        </div>
                        <div className="contDisplay">
                            <h4>Видеоигры</h4>
                        </div>
                    </div>
                    <div style={{position:"absolute", marginLeft:"45%", marginTop:"22%", zIndex:"-1"}}>
                        <img src={img_laptop} alt="img_laptop" style={{width:"120%", height:"100%"}}/>
                    </div>
                </div>
                <button className="orangeButton" style={{marginTop:"50px"}}>ПОПРОБОВАТЬ</button>
                <img src={icon_stars} alt="" style={{position:"absolute", marginLeft:"10px", marginTop:"70px", width:"4%"}}/>
            </div>           
        </div>
        <div className="hookUnder">
                <div className="hookInfo">
                    
                    <p style={{fontWeight:"700"}}>ПО СТАНДАРТУ МИНИСТРЕСТВА ОБРАЗОВАНИЯ</p>
                    <div className="hookInfoRight">
                        <img src={icon_grad} alt="icon_graduation" className='glowImg'/>
                        <p style={{marginLeft:"20px"}}>100 000 студентов</p>
                        <img src={icon_school} alt="icon_school" className='glowImg'/>
                        <p style={{marginLeft:"20px"}}>5 000 школ</p>
                    </div>
                </div>
            </div>
        <div className="offers">
            <div className="offersTop">
                <Offers num={1} text="Персональная учебная программа" img={offer_books}/>
                <Offers num={2} text="Более 5000+ практических занятий" img={offer_tablet}/>
                <Offers num={3} text="Мониторинг прогресса" img={offer_progress}/>
            </div>
            <div className="offersBottom">
                <OffersBot num={4} text="Интересные видеоигры" img={offer_gaming}/>
                <OffersBot num={5} text="В любое время - в любом месте" img={offer_time}/>
                <OffersBot num={6} text="Сертификат по окончанию курса" img={offer_certificate}/>
            </div>
        </div>
        <div className="learnPlan">
            <div className="planLaptop">
                <img src={laptops} alt="" className="planImg"/>
            </div>
            <div className="planTop">
                <h1 style={{lineHeight:"50px", width:"557px"}}>УЧЕБНЫЙ ПЛАН ПО МАТЕМАТИКЕ</h1>
                <ul className="planCardBot">
                    <li className='planCardList'>Нумерация</li>
                    <li className='planCardList'>Сравнение чисел</li>
                    <li className='planCardList'>Арифметические задачи</li>
                    <li className='planCardList'>Сложение и вычитание</li>
                    <li className='planCardList'>Умножение и деление</li>
                    <li className='planCardList'>Логические задачи</li>
                    <li className='planCardList'>Геометрические фигуры</li>
                </ul>
            </div>
            <div className="planTop">
                <h1 style={{lineHeight:"50px", width:"577px"}}>УЧЕБНЫЙ ПЛАН ПО АНГЛИЙСКОМУ ЯЗЫКУ</h1>
                <ul className="planCardBot">
                    <li className='planCardList'>Phonics</li>
                    <li className='planCardList'>Grammar</li>
                    <li className='planCardList'>Nouns</li>
                    <li className='planCardList'>Verbs</li>
                    <li className='planCardList'>Adjectives</li>
                    <li className='planCardList'>Adverbs</li>
                    <li className='planCardList'>Building sentences</li>
                </ul>
            </div>
            <div className="planLaptop">
                <img src={tablet} alt="" className="planImg" style={{top:"0px"}}/>
            </div>
            <div className="planBack">
                <img src={background} alt="" style={{width:"100%", marginTop:"100px", scale:"115%"}}/>
            </div>
            
        </div>
        <div className="bottomCont">
            <div className="bottomCard">
                <img src={logoImg} alt="logo" style={{width:"136px", height:"34px"}}/>
                <h1>ОБРАЗОВАНИЕ - САМАЯ</h1>
                <h1>ПРАВИЛЬНАЯ ИНВЕСТИЦИЯ</h1>
                <ol style={{marginTop:"50px"}}>
                    <li>
                        <div className="contDisplay">
                            <h4>Проходите уроки</h4>
                        </div>
                    </li>
                    <li>
                        <div className="contDisplay">
                            <h4>Зарабатывайте золотые монеты</h4>
                        </div>
                    </li>
                    <li>
                        <div className="contDisplay">
                            <h4>Играйте в видеоигры</h4>
                        </div>
                    </li>
                </ol>
                <button className="orangeButton" style={{marginTop:"50px"}}>ПОПРОБОВАТЬ</button>
            </div>
        </div>
        </>
    );
}

export default Contents;