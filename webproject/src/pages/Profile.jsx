import React from 'react'
import League from './dashboard_sections/League'
import Ratinglist from './dashboard_sections/Ratinglist'

const Profile = () => {
  return (
    <div className='dashProfile'>
        <div className="prowfirst">
            <p style={{fontSize:"x-large", fontWeight:"650", color:"#222222", margin:"0", padding:'0'}}>Мой профиль</p>
            <input list='settings' className='settings'/>
            <datalist id='settings'>
                <option value='Настройки'/>
                <option value='Выйти'/>
            </datalist>
        </div>
        <div className="sidepfp">
            <img src="https://placehold.co/100" alt="pfp" className="pfp" style={{borderRadius:"50%", marginBottom:"15px"}}/>
            <p style={{fontSize:"x-large", fontWeight:"650", color:"#222222", margin:"0", padding:'0'}}>Имя Фамилия</p>
            <p style={{fontSize:"large", fontWeight:"450", color:"#222222", margin:"0", padding:'0'}}>Ученик</p>
        </div>
        <League></League>
        <Ratinglist/>
    </div>
  )
}

export default Profile