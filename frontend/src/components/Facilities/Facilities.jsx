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
                    <img src="./room11.jpg" alt="Rooms" />
                    
        </Plx>
        <Plx className="f-inner" parallaxData={facilities}>
                    <h4>Tents</h4>
                    <img src="./tent.jpg" alt="Camps" />
                    
        </Plx>
        <Plx className="f-inner" parallaxData={facilities}>
                    <h4>Caravan Parking</h4>
                    <img src="./parking.jpg" alt="Parking" />
                    
        </Plx>
        <Plx className="f-inner" parallaxData={facilities}>
                    <h4>Kids Play Area</h4>
                    <img src="./Bonfire.jpg" alt="Bonfire" />
                    
        </Plx>
      </div>
    </div>


    </>

  )
}

export default Facilities
