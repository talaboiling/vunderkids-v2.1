import '/src/dashboard.css'
import Sidebar from '../Sidebar'
import Navdash from '../Navdash'

const Games = () => {
  return (
    <div className='rtdash'>
        <Sidebar />
        <div className="centralDash">
            <Navdash starCount={212} cupCount={515} notif={3}/>
        </div>
        
    </div>
  )
}

export default Games