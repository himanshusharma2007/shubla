import React from 'react'
import './Ourvalue.css'
import { FaRegLightbulb } from "react-icons/fa6";
import { IoRocketOutline } from "react-icons/io5";

function Ourvalue() {
  return (
    <div className='value'>
      <div className="l-val">
            <h3>Our Value<div className='headingline'></div></h3>
            <p>Elevate your desert camping…….under the stars.” — DesertCAmping.ae” is OUR VALUE.</p>
      </div>
      <div className="r-val">
        <div>
           <span><FaRegLightbulb /></span>
           <div>
                <h4>Vision </h4>
                <p>We envision DesertCamping.ae as the ultimate destination for desert camping enthusiasts in the UAE. Through our exceptional products and desert-themed approach, we aspire to become the go-to platform that inspires and equips campers, ensuring their desert camping journeys are enriched with comfort, style, and a profound connection with nature. When people think of camping in the UAE, they will think of DesertCamping.ae, the gateway to extraordinary desert adventures. </p>
           </div> 
        </div>
        <div>
                <span><IoRocketOutline /></span>
                <div>
                    <h4> Mission  </h4>
                    <p>Our mission is to provide a unique and unforgettable camping experience in the desert, offering a curated selection of stylish and practical camping gears and accessories. We aim to cater to both experienced campers and first-timers, empowering them to embrace the beauty of UAE's nature and create cherished memories while camping in the desert.  </p>
                </div>
        </div>
      </div>
    </div>
  )
}

export default Ourvalue
