import '/src/dashboard.css'
import PropTypes from 'prop-types';
import staricon from '../assets/navStars.png'
import cupicon from '../assets/navCups.png'
import bellicon from '../assets/navBell.png'

const Navdash = (props) => {
  return (
    <div className='navdashboard'>
        <div className="lndsh starCount">
            <img src={staricon} alt="stars" className='starIcon'/>
            {props.starCount}
        </div>
        <div className="lndsh cupCount">
            <img src={cupicon} alt="cups" className="cupIcon" />
            {props.cupCount}
        </div>
        <div className="rndsh gradeNum">
            {props.gradeNum}
        </div>
        <div className="rndsh langSelect">
            <div className="button b2" id="button-10">
                <input type="checkbox" className="checkbox" />
                <div className="knobs">
                    <span>ҚАЗ</span>
                </div>
                
            </div>
        </div>
        <div className="rndsh notif">
            <img src={bellicon} alt="" className="bellIcon" />
            {props.notif}
        </div>
    </div>
  );
}

Navdash.PropTypes={
    starCount: PropTypes.number,
    cupCount: PropTypes.number,
    gradeNum: PropTypes.string,
    langSelect: PropTypes.bool,
    notif: PropTypes.number,
}

Navdash.defaultProps={
    starCount: 0,
    cupCount: 0,
    gradeNum: "0-1 класс",
    langSelect: false,
    notif: 0,
}

export default Navdash