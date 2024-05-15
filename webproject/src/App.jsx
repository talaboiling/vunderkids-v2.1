import {Link} from "react-router-dom";
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Contents from './Contents.jsx'
import Reviews from "./Reviews.jsx";
function App() {

  return (
    <>
      <div className="contain">
        <Header />
        <Contents />
        <Reviews />
        <Footer />
      </div>
      
    </>
    
  )
}

export default App;
