import React from 'react'
import './Facilities.css'
import Plx from "react-plx";

function Facilities() {
    const facilities = [
        {
          start: "self",
          duration: "150vh",
          properties: [
            {
              startValue: 500, 
              endValue: -500,
              property: "translateX",
            },
          ],
        },
      ];
  return (
    <>
    <div className='Facilities'>
        <h2>Our Facilities </h2>
      <div className="f-slider">
        <Plx className="f-inner" parallaxData={facilities}>
                    <h4>Rooms</h4>
                    <img src="./camp1.jpg" alt="Rooms" />
                    
        </Plx>
        <Plx className="f-inner" parallaxData={facilities}>
                    <h4>Camps</h4>
                    <img src="./camp2.jpg" alt="Camps" />
                    
        </Plx>
        <Plx className="f-inner" parallaxData={facilities}>
                    <h4>Parking</h4>
                    <img src="./camp4.jpg" alt="Parking" />
                    
        </Plx>
        <Plx className="f-inner" parallaxData={facilities}>
                    <h4>Bonfire</h4>
                    <img src="./Bonfire.jpg" alt="Bonfire" />
                    
        </Plx>
      </div>
    </div>


    </>

  )
}

export default Facilities
