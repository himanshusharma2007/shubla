import React, { useEffect } from 'react'
import Nav from '../Nav/Nav'
import './Gallery.css'
import Footer from '../footer/Footer'
import Contact from '../Contact/Contact'
import Plx from "react-plx";
import { useLocation } from 'react-router-dom'
import Imggel from './Imggel'
import GalleryComponent from './Gallery2'
import galheroimg from "./img/galleryhero.jpg"



function Gallery() {
  const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

  const galhero = [
    {
      start: 'self',
      end: 500,
      properties: [
        {
          startValue: 0,
          endValue: -150,
          property: "translateY",
        },
      ],
    },
  ];
  return (
    <>
        <Nav/>
        <div className="gel-hero">
            <div className="gelhero-filter">
                <h2>Photo Gallery</h2>
                <p>We Create Good Memories!</p>
            </div>
            <Plx className='gelhero-img'  parallaxData={galhero}>
                <img src={galheroimg} alt="" />
            </Plx>
        </div>
        <Imggel/>
        <GalleryComponent/>
        <Contact/>
        <Footer/>
    </>
  )
}

export default Gallery
