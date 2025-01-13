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
import campheroimg from './img/camphero.jpg'
import campimg from './img/camp.jpg'
import { useLocation, useNavigate } from 'react-router-dom'


function Camp() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const camphero = [
        {
          start: 'self',
          end: 400,
          properties: [
            {
              startValue: 0,
              endValue: -200,
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
                <img src={campheroimg} alt="" />
            </Plx>
      </div>
      <div className="abt-camp">
        <div>
            <h2>Camping Tent</h2>
            <p>Experience the magic of the Arabian desert with our premium <b>camping tents</b>, designed for comfort and adventure. Whether you're looking for a romantic getaway, a family outing, or an adventure with friends, our desert campsite offers the perfect retreat under the starlit skies.</p>
            <ul>
                <li><PiTentFill /> Advanture Experience</li>
                <li><MdFastfood /> Tasty Food</li>
                <li><IoIosBonfire /> Bonfire</li>
                <li><GiDesert /> Mountain View</li>
            </ul>
            <button
            className="bg-zinc-900 text-white px-4 py-2 hover:scale-105 transition duration-300"
            type="submit"
            onClick={() => navigate("/booking/camp")}
          >
            Book Now
          </button>
    
        </div>
        <img src={campimg} alt="" />
      </div>
    </div>
    <Contact/>
    <Footer/>
    
    </>
  )
}

export default Camp
