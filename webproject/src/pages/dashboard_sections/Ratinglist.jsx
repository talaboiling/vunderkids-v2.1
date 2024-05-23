import React from 'react'

const Ratinglist = () => {
  return (
    <div className='ratingList'>
        <p style={{fontSize:"x-large", fontWeight:"650", color:"#222222", margin:"0", padding:'0', marginBottom:"15px"}}>Рейтинг учеников на сегодня</p>
        <div className="studentsList">
            <div className="ratingItem" style={{backgroundColor:"#FFD700"}}>
                <img src="https://placehold.co/50" alt="pfp" className="pfprating" style={{borderRadius:"50%"}}/>
                <div className="namePoints">
                    <p style={{fontSize:"large", fontWeight:"450", color:"#fff", margin:"0", padding:'0', fontWeight:"600"}}>Имя Фамилия</p>
                    <p style={{fontSize:"large", fontWeight:"450", color:"#fff", margin:"0", padding:'0', fontWeight:"600"}}>80 очков</p>
                </div>
            </div>
            <div className="ratingItem" style={{backgroundColor:"#97D4E7"}}>
                <img src="https://placehold.co/50" alt="pfp" className="pfprating" style={{borderRadius:"50%"}}/>
                <div className="namePoints">
                    <p style={{fontSize:"large", fontWeight:"450", color:"#fff", margin:"0", padding:'0', fontWeight:"600"}}>Имя Фамилия</p>
                    <p style={{fontSize:"large", fontWeight:"450", color:"#fff", margin:"0", padding:'0', fontWeight:"600"}}>75 очков</p>
                </div>
                
            </div>
            <div className="ratingItem" style={{backgroundColor:"#D9AB7D"}}>
                <img src="https://placehold.co/50" alt="pfp" className="pfprating" style={{borderRadius:"50%"}}/>
                <div className="namePoints">
                    <p style={{fontSize:"large", fontWeight:"450", color:"#fff", margin:"0", padding:'0', fontWeight:"600"}}>Имя Фамилия</p>
                    <p style={{fontSize:"large", fontWeight:"450", color:"#fff", margin:"0", padding:'0', fontWeight:"600"}}>74 очков</p>
                </div>      
            </div>
            <div className="ratingItem" style={{backgroundColor:'#F0F7FF'}}>
                <img src="https://placehold.co/50" alt="pfp" className="pfprating" style={{borderRadius:"50%"}}/>
                <div className="namePoints">
                    <p style={{fontSize:"large", fontWeight:"450", color:"#222222", margin:"0", padding:'0', fontWeight:"600"}}>Имя Фамилия</p>
                    <p style={{fontSize:"large", fontWeight:"450", color:"#222222", margin:"0", padding:'0', fontWeight:"600"}}>44 очков</p>
                </div>      
            </div>
        </div>
    </div>
  )
}

export default Ratinglist