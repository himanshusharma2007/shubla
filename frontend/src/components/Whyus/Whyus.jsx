import React from 'react'
import './Whyus.css'
import { Link } from 'react-router-dom'

function Whyus() {
  return (
    <div className='Whyus'>
        <div className="whyusfilter">

        <div className="why-1">
            <h3>Why Choose Us <div className='headingline'></div></h3>
            <h4>More than an adventure, its a way of life</h4>
            <p>Welcome to Desert Camping UAE, your one-stop online shop for all your camping gear and accessories needs. Here’s why you should choose us for your next outdoor adventure:</p>
            <div>
                <h5>Competitive Prices</h5>
                <p>We believe that everyone should have access to quality camping gear without breaking the bank. Our products are competitively priced, allowing you to embark on your desert escapades without overspending.</p>
            </div>
            <a href="#Contact">Contact Us</a>
        </div>
        <div className="why-2">
            <img src="/camp4.jpg" alt="" />
        </div>
        <div className="why-3">
            <img src="/insta2.png" alt="" />
            <div>
                <p>"</p>
                <p>Fill your life with adventures, not things. Have stories to tell not stuff to show. </p>
                <p>Heidi B. Smith</p>
            </div>
        </div>
        </div>
    </div>

  )
}

export default Whyus
