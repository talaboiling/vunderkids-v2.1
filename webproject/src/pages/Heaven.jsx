import {Link} from "react-router-dom";

const Heaven = () => {
  return (
    <div className="heavenButton">
        <h1>Heaven</h1>
        <Link to="/">
          <button className="button1" style={{color:"#4f9e52"}}>Go to Earth</button>
        </Link>
        
        <Link to="/hell">
          <button className="button1" style={{color:"red"}}>Go to Hell</button>
        </Link>
    </div>
  )
}

export default Heaven