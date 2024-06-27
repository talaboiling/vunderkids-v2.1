import React from 'react';
import PropTypes from 'prop-types';
import placeholderPfp from '../../assets/placehoder_pfp.png'; // Import the placeholder image

const Ratinglist = ({ ratings }) => {
  return (
    <div className='ratingList'>
      <p style={{fontSize:"x-large", fontWeight:"650", color:"#222222", margin:"0", padding:'0', marginBottom:"15px"}}>Рейтинг учеников</p>
      <div className="studentsList">
        {ratings.map((student, index) => (
          <div 
            className="ratingItem" 
            key={student.id}
            style={{ backgroundColor: index === 0 ? "#FFD700" : index === 1 ? "#97D4E7" : index === 2 ? "#D9AB7D" : '#F0F7FF' }}
          >
            <img 
              src={student.avatar || placeholderPfp} 
              alt="pfp" 
              className="pfprating" 
              style={{borderRadius:"50%",width: "50px", height: "50px"}} 
            />
            <div className="namePoints">
              <p style={{ fontSize: "large", color: index > 2 ? "#222222" : "#fff", margin: "0", padding: '0', fontWeight: "600" }}>
                {student.first_name} {student.last_name}
              </p>
              <p style={{ fontSize: "large", color: index > 2 ? "#222222" : "#fff", margin: "0", padding: '0', fontWeight: "700" }}>
                <strong style={{fontSize:"x-large"}}>{student.cups}</strong> очков
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Ratinglist.propTypes = {
  ratings: PropTypes.array
};

Ratinglist.defaultProps = {
  ratings: []
};

export default Ratinglist;
