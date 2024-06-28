import PropTypes from 'prop-types';
const Offers = (props) => {
    return (
        <div className="offerCard">
            
            <p className="cardNum">{props.num}</p>
            <>{props.text}</>
            <img src={props.img} alt="img" style={{width:'100px', height:'100px'}}/>
            
        </div>
    );
}
Offers.propTypes = {
    num: PropTypes.number,
    text: PropTypes.string,
    img: PropTypes.string,
}
Offers.defaultProps = {
    num: 1,
    text: "Текст",
    img: "https://placehold.co/75x75",
}
export default Offers;