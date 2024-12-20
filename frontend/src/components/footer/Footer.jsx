import React from 'react'
import './Footer.css'
import { FaLocationDot } from "react-icons/fa6";
import { IoMailSharp } from "react-icons/io5";
import { IoCallSharp } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="social">
      <p>Our Social media :</p>
      <span>
        <a href=""><FaWhatsapp /></a>
        <a href=""><FaInstagram /></a>
        <a href=""><FaXTwitter /></a>
        <a href=""><FaYoutube /></a>
      </span>
    </div>

      <div className="footfilter">
      <div className="upperfoot">
          <img src="./logo.png" alt="" />
          <p>Welcome to desertcamping.ae! We’re an online camping store based in the UAE, and we’re passionate about bringing you unique and stylish products that are perfect for your desert camping adventures. </p>
      </div>
      <div className="donwfoot">
          <ul>
            <h2>Contact</h2>
            <li><FaLocationDot /> <a href="#">United Arab Emirates</a></li>
            <li><IoMailSharp /> <a href="#">example@email.com</a></li>
            <li><IoCallSharp /> <a href="#">+971 123456789</a></li>
            <li><FaWhatsapp /> <a href="#">+971 123456789</a></li>
          </ul>
          <ul>
            <h2>Rooms</h2>
            <li><Link to='/CampingTents'>Camping Tents</Link></li>
            <li><Link to='/DeluxeRoom'>Deluxe Room</Link></li>
          </ul>
          <ul>
            <h2>Events</h2>
            <li><Link to='/Corporate-Events'>Corporate Events</Link></li>
            <li><Link to='/Private-Events'>Private Events</Link></li>
          </ul>
          <ul>
            <h2>Company</h2>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/Aboutus'>About us</Link></li>
            <li><Link to='/Login'>Login</Link></li>
            <li><Link to='/Register'>Register</Link></li>
          </ul>
      </div>
      <div className="copright">
        <p>Copyright © 2024 Desert Camping, All rights reserved</p>
      </div>
      </div>
    </footer>






 
  )
}

export default Footer
