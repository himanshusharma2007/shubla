import React, { useEffect } from 'react'
import Plx from "react-plx";
import './Event.css'
import Nav from '../Nav/Nav';
import Contact from '../Contact/Contact';
import Footer from '../footer/Footer';
import { useLocation } from 'react-router-dom';
function Event1() {
  const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    const eventhero = [
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
    <div className="eventhero">
    <div className="eventhero-filter">
                <h2>Corporate Events</h2>
                <p>We will orgnize for You!</p>
            </div>
            <Plx className='eventhero-img'  parallaxData={eventhero}>
                <img src="./event2.jpg" alt="" />
            </Plx>
    </div>
    <div className="abt-event">
        <h2>Our Events</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, reprehenderit quas perferendis ut cumque, aliquid, ipsum placeat ducimus a numquam quo pariatur itaque magni consequuntur quisquam nam et? Mollitia voluptatem nobis odit quae fuga unde non nesciunt dolores, earum distinctio incidunt neque maiores aspernatur aut cum ratione a voluptas, repudiandae laborum perferendis deserunt quo eaque! Tempore debitis pariatur molestias voluptatum ad! Sint harum minus dignissimos modi explicabo, ratione nulla? Quia aspernatur cupiditate quisquam sequi a reiciendis nostrum! Unde quae odio quis ipsam voluptate at! Dolores obcaecati inventore sit, velit eveniet eius? Eum iure cum aut eveniet praesentium numquam neque expedita.</p>

        <div className="event-gallery">
        <div className="leftgallery">
          <img src='https://totaleventsdfw.com/wp-content/uploads/2021/04/planning-a-corporate-event.jpeg' alt="" />
        </div>
        <div className="rightgallery">
            <img src='https://cdn.prod.website-files.com/605baba32d94435376625d33/6514271954eafa296995dfe3_60f86ba643236ab8883fd03b_evbox_gowild18-9.jpeg' alt="" />
            <img src='https://matthewshousecary.com/wp-content/uploads/2022/08/IMG_6171-scaled.jpg' alt="" />
            <img src='https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,q_auto,w_750/f_auto/corporate-event-entertainment-phpdayVcS' alt="" />
            <img src='https://www.businessmagnet.co.uk/manage-account/uploadedImages/292952/shutterstock_1096227437-min-3.jpg' alt="" />
        </div>
       </div>
    </div>
    <Contact/>
    <Footer/>
    </>
  )
}

export default Event1
