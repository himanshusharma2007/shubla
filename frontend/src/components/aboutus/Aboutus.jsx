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
                <h2>Welcome to Subla Camp </h2>
                <p>A Place Where Time Pauses</p>
            </div>
            <Plx className='abthero-img'  parallaxData={abthero}>
                <img src="./img2.jpg" alt="" />
            </Plx>
        </div>

      <div className="abttxt">
            <p>
              Tucked away in the heart of the mountains, where the whispers of the wind tell fables of the past, Subla Camp is more than just a retreat—it’s a timeless embrace of simplicity, heritage, and place of belonging.
              <br /> <br />
              Drawing inspiration from the 'Majles'—a welcoming space traditionally built at the front of houses to receive and honor visitors from distant lands—this camp celebrates the art of hospitality and old-world charm. With careful attention to detail, every element is thoughtfully crafted to reflect the modest yet rich traditions of mountain life.
            </p>

            <h3 className='mt-10'>Our Story – A Dream Rooted in Tradition</h3>

            <p className='mt-5'>I have always enjoyed the touch of the rocks since I was little. I grew up searching for honeybee nests in the mountains with my father. I dreamed of building something meaningful in the heart of the mountains—something that that would reflect my humble life in a tangible form.
              <br /><br />
              Subla Camp is more than a destination; it’s a reflection of me. Built with my own hands and filled with memories, it’s a sanctuary for the soul—a place to reconnect with life’s essence. This is not just a business venture; it’s a home—a place where I envision raising my child and sharing my heritage with others.  
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
