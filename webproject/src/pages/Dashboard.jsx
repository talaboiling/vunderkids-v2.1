import '/src/dashboard.css'
import Sidebar from './Sidebar'
import Navdash from './Navdash'
import Profile from './Profile'
import lionimg from '../assets/lion_hellocont.png'
import mathIcon from '../assets/calculator.png'
import englishIcon from '../assets/english.png'
import somechart from '../assets/temp_progres.png'
import {Link} from "react-router-dom"; 

const Dashboard = () => {
  return (
    <div className='rtdash'>
      <Sidebar />
      <div className="centralDash">
        <Navdash starCount={212} cupCount={515} notif={3}/>
        <div className="mainContent">
          <h2 style={{color:"#22222244"}}>Главная</h2>
          <div className="helloContent">
            <span className='helloCont'>
              <p style={{fontWeight:"500", fontSize:"xx-large", color:"#222222ef", margin:"0", marginBottom:"15px"}}>Привет, <strong>Eszhan</strong></p>
              <p style={{fontWeight:"500", color:"#2222229f", maxWidth:"70%", margin:"0"}}>Делай сегодня то, что другие не хотят - завтра будешь жить так, как другие не могут</p>
            </span>
            <img src={lionimg} alt="mascot" style={{position:"absolute", top:"-50px", left:"70%", scale:"1.2"}}/>
          </div>

          <h3 style={{color:"black", fontWeight:"700", fontSize:"x-large"}}>Мои курсы</h3>

          
            <div className="coursesCards">
              <div className="courseItem">
                <div className="courseItemLeft">
                  <p style={{margin:"0"}}>Математика</p>
                  <progress value={0.18}/>
                  <Link to={"/dashboard/lessons"}>
                    <button style={{backgroundColor:"#F8753D", fontWeight:"550", fontSize:"large", borderColor:"#FFB99C", boxShadow:"none"}}>Начать</button>
                  </Link>
                  
                </div>
                <img src={mathIcon} alt="Maths" style={{backgroundColor:"#F8753D", border:"1px solid black", borderRadius:"21px"}}/>
              </div>
              <div className="courseItem">
                <div className="courseItemLeft">
                  <p style={{margin:"0"}}>Английский</p>
                  <progress value={0.48}/>
                  <button style={{backgroundColor:"#FFD46A", fontWeight:"550", fontSize:"large", borderColor:"#FFECBD",color:"#855F00", boxShadow:"none"}}>Начать</button>
                </div>
                <img src={englishIcon} alt="English" style={{backgroundColor:"#FFD46A", borderRadius:"21px"}}/>
              </div>
            </div>
            <div className="progressChart">
              <img src={somechart} alt="" />
            </div>
          

        </div>
      </div>
      <Profile/>

      
    </div>
  )
}

export default Dashboard
