
import {Link} from "react-router-dom";
function Hell() {
  return (
    <div className="hellButton">
        <h1>Hell</h1>
        <Link to="/">
            <button className="button1" style={{color:"#4f9e52"}}>Go to Earth</button>
        </Link>
        
        <Link to="/heaven">
            <button className="button1">Go to Heaven</button>
        </Link>
    </div>
  )
}

export default Hell