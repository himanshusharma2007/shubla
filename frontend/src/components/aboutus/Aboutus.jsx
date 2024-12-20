import React, { useEffect } from 'react'
import Nav from '../Nav/Nav'
import './Aboutus.css'
import Plx from "react-plx";
import Whyus from '../Whyus/Whyus';
import Footer from '../footer/Footer';
import Ourvalue from '../ourvalue/Ourvalue';
import Contact from '../Contact/Contact';
import { useLocation } from 'react-router-dom';


function Aboutus() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const abthero = [
        {
          start: 'self',
          end: 500,
          properties: [
            {
              startValue: 0,
              endValue: -50,
              property: "translateY",
            },
          ],
        },
      ];
  return (
    <>
    <Nav/>
    <div className='abtus'>
        <div className="abthero" >
            <div className="abthero-filter">
                <h2>About Us</h2>
                <p>We Love Camping Too!</p>
            </div>
            <Plx className='abthero-img'  parallaxData={abthero}>
                <img src="./img2.jpg" alt="" />
            </Plx>
        </div>

      <div className="abttxt">
            <h3>Subla Camp</h3>
            <p>Welcome to desertcamping.ae! We’re an online camping store based in the UAE, and we’re passionate about bringing you unique and stylish products that are perfect for your desert camping adventures. <br /> <br /> 
            We’ve curated a collection of high-quality products that are “desert themed” and they are designed to make your experience unique and unforgettable.  <br /> <br /> 
            From cozy camping furniture and durable tents to portable grills and camping chairs, we’ve got everything you need to make your desert camping trip a success.  And because we’re dedicated to providing the best customer service possible, we’re always here to answer questions and help you find the perfect products for your specific needs. <br /> <br /> 
            Whether you’re an experienced camper looking for new gear, or a first-time just getting started, we’ve got you covered.  Shop our selection today and start planning your next unforgettable desert camping adventure!
            </p>
      </div>
    </div>
    <Whyus/>
    <Ourvalue/>
    <Contact/>
    <Footer/>
    </>
  )
}

export default Aboutus
