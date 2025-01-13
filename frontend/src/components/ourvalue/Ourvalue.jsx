import React from 'react'
import './Ourvalue.css'
import { FaRegLightbulb } from "react-icons/fa6";
import { IoRocketOutline } from "react-icons/io5";

function Ourvalue() {
  return (
    <div className='value'>
      <div className="l-val">
            <h3>Our Value<div className='headingline'></div></h3>
            <p>A Glimpse of the Past – Built by Nature, Bound by History</p>
      </div>
      <div className="r-val">
        <div>
           <span><FaRegLightbulb /></span>
           <div>
                <h4>A New Perspective for Visitors </h4>
                <p>Subla Camp invites guests from all backgrounds to immerse themselves in a world of tradition. The goal is to offer visitors, particularly those from different cultures, the opportunity to experience a new perspective by enjoying coffee with a mountain and valley backdrop. It provides a restful setting where guests can experience life as it was 100 years ago. If you long for quiet moments and soulful connections, for barefoot walks on earth that remembers, and for nights under skies unspoiled by city lights—Subla Camp is waiting for you. </p>
           </div> 
        </div>
        <div>
                <span><IoRocketOutline /></span>
                <div>
                    <h4>An Authentic Mountain Experience</h4>
                    <p>Envision yourself camping under a canopy of stars, embraced by the mountains and valleys with a breathtaking backdrop. Subla Camp blends the charm of history with modern comfort. Enjoy a BBQ with your loved ones, unwind in a traditional Bedouin tent, and let your kids enjoy their own play zone. The vast grounds offer ample space to pitch your tent and enjoy nature’s freedom. </p>
                </div>
        </div>
      </div>
    </div>
  )
}

export default Ourvalue
