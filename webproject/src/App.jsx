import {Link} from "react-router-dom";
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Contents from './Contents.jsx'
import Reviews from "./Reviews.jsx";
import Socials from "./components/Socials.jsx"
import React, {FC, Suspense} from 'react';
import './i18n.js';
function App() {

  return (
    <>
      <div className="contain">
        <Suspense fallback={null}>
          <Header />
          <Contents />
          <Reviews />
          <Footer />
          <Socials />
        </Suspense>
      </div>
      
    </>
    
  )
}

export default App;
