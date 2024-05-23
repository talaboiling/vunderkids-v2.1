import '/src/dashboard.css'
import Sidebar from '../Sidebar'
import Navdash from '../Navdash'
import Profile from '../Profile'
import tempprogres from '../../assets/temp_progres.png'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const Pprogress = () => {
  return (
    <div className='rtdash'>
      <Sidebar />
      <div className="centralDash">
        <Navdash starCount={212} cupCount={515} notif={3}/>
        <div className="centralProg">
          <img src={tempprogres} alt="" />

          <div className="progcalendar">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>

        </div>
      </div>
      <Profile />
      
    </div>
  )
}

export default Pprogress