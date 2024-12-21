import React, { useEffect } from 'react'
import '../CampingTents/Camp.css'
import Nav from '../Nav/Nav'
import Footer from '../footer/Footer'
import Book from '../Booking/Book'
import Plx from "react-plx";
import { PiTentFill } from "react-icons/pi";
import { MdFastfood } from "react-icons/md";
import { IoIosBonfire } from "react-icons/io";
import { GiDesert } from "react-icons/gi";
import Contact from '../Contact/Contact'
import { useLocation } from 'react-router-dom'



function Room() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    const camphero = [
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
    <div className='Camps'>
      <div className="camphero">
            <div className="camphero-filter">
                <h2>Deluxe Room</h2>
                <p>We Love Camping Too!</p>
            </div>
            <Plx className='camphero-img'  parallaxData={camphero}>
                <img src="./room2.jpg" alt="" />
            </Plx>
      </div>
      <div className="abt-camp">
        <div>
            <h2>Deluxe Room</h2>
            <p>Elevate your desert camping experience by booking our <b>Deluxe Room</b>, where luxury meets adventure. Perfect for couples, families, or small groups, our Deluxe Rooms are designed to offer you a cozy and stylish retreat amidst the golden dunes of Dubai.</p>
            <ul>
                <li><PiTentFill /> Advanture Experience</li>
                <li><MdFastfood /> Testi Food</li>
                <li><IoIosBonfire /> Bonfire</li>
                <li><GiDesert /> Desert View</li>
            </ul>
            <a href=''>Contact us</a>
    
        </div>
        <img src="./room.jpg" alt="" />
      </div>
    </div>
    <Book/>
    <Contact/>
    <Footer/>
    
    </>
  )
}

export default Room
