import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Contents from './Contents.jsx'
import Reviews from "./Reviews.jsx";
import Socials from "./components/Socials.jsx"
import PopOlympiad from "./PopOlympiad.jsx";
import React, { FC, Suspense } from 'react';
import './i18n.js';
function App() {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//code.jivo.ru/widget/lx81Wuqx8B"
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }

  }, []
  )
  return (
    <>
      <div className="contain">
        <Suspense fallback={null}>
          <PopOlympiad />
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
