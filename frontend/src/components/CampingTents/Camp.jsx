import React, { useEffect } from 'react'
import './Camp.css'
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


function Camp() {
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
                <h2>Camping Tents</h2>
                <p>We Love Camping Too!</p>
            </div>
            <Plx className='camphero-img'  parallaxData={camphero}>
                <img src="./camp.jpg" alt="" />
            </Plx>
      </div>
      <div className="abt-camp">
        <div>
            <h2>Camping Tent</h2>
            <p>Experience the magic of the Arabian desert with our premium <b>camping tents</b>, designed for comfort and adventure. Whether you're looking for a romantic getaway, a family outing, or an adventure with friends, our desert campsite offers the perfect retreat under the starlit skies.</p>
            <ul>
                <li><PiTentFill /> Advanture Experience</li>
                <li><MdFastfood /> Testi Food</li>
                <li><IoIosBonfire /> Bonfire</li>
                <li><GiDesert /> Desert View</li>
            </ul>
            <a href=''>Contact us</a>
    
        </div>
        <img src="./camp5.jpg" alt="" />
      </div>
    </div>
    <Book/>
    <Contact/>
    <Footer/>
    
    </>
  )
}

export default Camp
