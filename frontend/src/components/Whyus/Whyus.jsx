import React from 'react'
import './Whyus.css'
import { Link } from 'react-router-dom'

function Whyus() {
  return (
    <div className='Whyus'>
        <div className="whyusfilter">

        <div className="why-1">
            <h3>Why Choose Us <div className='headingline'></div></h3>
            <h4>A Cozy Escape – Where the Soul Feels at Haven</h4>
            <p>Subla Camp welcome those who crave for authenticity over luxury. It’s where mornings begin with golden sunrises over the peaks and nights end with stories shared around a glowing fire. Here, the modern world fades away, leaving room for connection—with nature, with others, and with yourself.</p>
            <div>
                <h5>Competitive Prices</h5>
                <p>We believe that everyone should have access to quality camping gear without breaking the bank. Our products are competitively priced, allowing you to embark on your desert escapades without overspending.</p>
            </div>
            <a href="#Contact">Contact Us</a>
        </div>
        <div className="why-2">
            <img src="/why-3.jpg" alt="" />
        </div>
        <div className="why-3">
            <img src="/why-2.jpg" alt="" />
            <br />
            <div>
                <p>"</p>
                <p>Let the mountains be your walls and the stars your ceiling. Let the earth welcome you home. </p>
            </div>
        </div>
        </div>
    </div>

  )
}

export default Whyus
