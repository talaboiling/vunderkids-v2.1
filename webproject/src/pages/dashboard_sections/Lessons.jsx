import '/src/dashboard.css'
import Sidebar from '../Sidebar'
import Navdash from '../Navdash'
import mathIcon from '../../assets/calculator.png'
import englishIcon from '../../assets/english.png'

const Lessons = () => {
  return (
    <div className='rtdash'>
      <Sidebar />
      <div className="centralLessons">
        <Navdash starCount={212} cupCount={515} notif={3}/>
        <div className="mainContent">
          <div className="coursesCards">
            <div className="courseItem" style={{width:"80%"}}>
              <div className="courseItemLeft">
                <p style={{margin:"0"}}>Математика</p>
                <progress value={0.18}/>
                <button style={{backgroundColor:"#F8753D", fontWeight:"550", fontSize:"large", borderColor:"#FFB99C", boxShadow:"none"}}>Начать</button>
              </div>
              <img src={mathIcon} alt="Maths" style={{backgroundColor:"#F8753D", border:"1px solid black", borderRadius:"21px"}}/>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Lessons