import React, { useEffect } from "react";
import Nav from "../Nav/Nav";
import { useLocation, useNavigate } from "react-router-dom";
import Plx from "react-plx";
import Book from "../Booking/Book";
import Contact from "../Contact/Contact";
import Footer from "../footer/Footer";
import { PiTentFill } from "react-icons/pi";
import { MdFastfood } from "react-icons/md";
import { IoIosBonfire } from "react-icons/io";
import { GiDesert } from "react-icons/gi";
import parking1 from "./img/parking1.jpg"
import parking2 from "./img/parking2.jpg"

function Parking() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const acthero = [
    {
      start: "self",
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
      <Nav />

      <div className="camphero">
        <div className="camphero-filter">
          <h2>Caravan Parking</h2>
          <p>Enjoy in your own Caravan</p>
        </div>
        <Plx className="camphero-img" parallaxData={acthero}>
          <img src={parking1} alt="" />
        </Plx>
      </div>

      <div className="abt-camp">
        <div>
          <h2>Caravan Parking</h2>
          <p>
            At Subla Camp, we offer a convenient and spacious parking area for
            caravans, ensuring a safe and comfortable stop in the heart of the
            desert. Whether you're passing through or planning an extended stay,
            our caravan parking facilities provide the perfect place to rest and
            recharge. Book your spot now and experience the tranquility of the
            desert at Subla Camp!
          </p>
          <ul>
            <li>
              <PiTentFill /> Spacious and Secure
            </li>
            <li>
              <MdFastfood /> Tasty Food
            </li>
            <li>
              <IoIosBonfire /> Bonfire
            </li>
            <li>
              <GiDesert /> Breathtaking Views
            </li>
          </ul>
          <button
            className="bg-zinc-900 text-white px-4 py-2 hover:scale-105 transition duration-300"
            type="submit"
            onClick={() => navigate("/booking/parking")}
          >
            Book Now
          </button>
        </div>
        <img src={parking2} alt="" />
      </div>

      <Contact />
      <Footer />
    </>
  );
}

export default Parking;
