import PropTypes from 'prop-types';
import GradeIcon from '@mui/icons-material/Grade';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { color } from 'framer-motion';
const ReviewCard = (props) => {
const renderStars = () => {
    const stars = [];
    let unstar = 0;
    let i;
    for (i = 0; i < props.stars; i++) {
        stars.push(<GradeIcon sx={{color:"#fcc308"}}/>);
    }
    unstar = 5 - props.stars;
    for (let j = 0; j < unstar; j++) {
        stars.push(<StarBorderIcon sx={{color:"lightgray"}}/>);
    }
    return stars;
};

return (
    <div className="reviewCard">
        <span className="reviewTop">
            <img src={props.pfp} alt="pfp" className="revPfp" />
            <p className="rev revName">{props.name}</p>
            <p className="rev revSub">{props.subject}</p>
        </span>

        <p className="rev revText">{props.text}</p>

        <span className="rateDate">
            <div>
                {renderStars()}
            </div>
            
            <p className="rev revDate">{props.date}</p>
        </span>
    </div>
);
}

ReviewCard.propTypes = {
    pfp: PropTypes.string,
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