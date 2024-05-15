import PropTypes from 'prop-types';
const OffersBot = (props) => {
    return (
        <div className="offerCard">
            
            <img src={props.img} alt="img" style={{width:'100px', height:'100px'}}/>
            <p className="cardNum2">{props.num}</p>
            <>{props.text}</>
            
            
        </div>
    );
}
OffersBot.propTypes = {
    num: PropTypes.number,
    text: PropTypes.string,
    img: PropTypes.shape,
}
OffersBot.defaultProps = {
    num: 1,
    text: "Текст",
    img: {},
}
export default OffersBot;