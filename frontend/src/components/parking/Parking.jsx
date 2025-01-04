import React, { useEffect } from 'react'
import Nav from '../Nav/Nav'
import './Parking.css'
import { useLocation } from 'react-router-dom';
import Plx from 'react-plx';
import Book from '../Booking/Book';
import Contact from '../Contact/Contact';
import Footer from '../footer/Footer';
import { PiTentFill } from "react-icons/pi";
import { MdFastfood } from "react-icons/md";
import { IoIosBonfire } from "react-icons/io";
import { GiDesert } from "react-icons/gi";

function Parking() {
    const { pathname } = useLocation();
        useEffect(() => {
            window.scrollTo(0, 0);
        }, [pathname]);
        const acthero = [
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

        <div className="acthero">
            <div className="acthero-filter">
                <h2>Caravan Parking</h2>
                <p>Enjoy in your own Caravan</p>
            </div>
            <Plx className='acthero-img'  parallaxData={acthero}>
                <img src="./park2.jpg" alt="" />
            </Plx>
        </div>


        <div className="abt-camp">
                <div>
                    <h2>Caravan Parking</h2>
                    <p>At Subla Camp, we offer a convenient and spacious parking area for caravans, ensuring a safe and comfortable stop in the heart of the desert. Whether you're passing through or planning an extended stay, our caravan parking facilities provide the perfect place to rest and recharge. Book your spot now and experience the tranquility of the desert at Subla Camp!</p>
                    <ul>
                        <li><PiTentFill /> Spacious and Secure</li>
                        <li><MdFastfood /> Testi Food</li>
                        <li><IoIosBonfire /> Bonfire</li>
                        <li><GiDesert /> Breathtaking Views</li>
                    </ul>
                    <a href=''>Book Now</a>
            
                </div>
                <img src="./park1.jpg" alt="" />
          </div>


        <Contact/>
        <Footer/>

    </>
  )
}

export default Parking
