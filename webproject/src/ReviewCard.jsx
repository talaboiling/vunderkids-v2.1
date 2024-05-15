import PropTypes from 'prop-types';
const ReviewCard = (props) => {
  return (
    <div className="reviewCard">
        <span className='reviewTop'>
            <img src={props.pfp} alt="pfp" className='revPfp'/>
            <p className="rev revName">{props.name}</p>
            <p className="rev revSub">{props.subject}</p>
        </span>
        
        <p className="rev revText">{props.text}</p>

        <span className="rateDate">
            <p className="rev revStar">{props.stars}/5</p>
            <p className="rev revDate">{props.date}</p>
        </span>
        
    </div>
  )
}

ReviewCard.propTypes = {
    pfp: PropTypes.shape,
    name: PropTypes.string,
    subject: PropTypes.string,
    text: PropTypes.string,
    stars: PropTypes.number,
    date: PropTypes.string,
}

ReviewCard.defaultProps = {
    pfp: "https://placehold.co/75x75",
    name: "Естай",
    subject: "Математика",
    text: "lorem ipsum",
    stars: 0.0,
    date: "1.1.1999",
}

export default ReviewCard