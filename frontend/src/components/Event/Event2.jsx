import React, { useEffect } from "react";
import Plx from "react-plx";
import "./Event.css";
import Nav from "../Nav/Nav";
import Contact from "../Contact/Contact";
import Footer from "../footer/Footer";
import { useLocation } from "react-router-dom";

function Event2() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const eventhero = [
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
      <div className="eventhero">
        <div className="eventhero-filter">
          <h2>Private Events</h2>
          <p>We will orgnize for You!</p>
        </div>
        <Plx className="eventhero-img" parallaxData={eventhero}>
          <img src="./event3.jpg" alt="" />
        </Plx>
      </div>
      <div className="abt-event">
        <h2>Our Events</h2>
        <p>
          <b style={{ fontWeight: "800" }}>
            Host Your Private Event in the Heart of Dubai’s Desert
          </b>
          <br />
          <b>
          Celebrate Life’s Special Moments in Style!
          </b>
          <br />
          Looking for a unique and unforgettable venue for your private event?
          Our desert campsite in Dubai offers the perfect blend of elegance,
          adventure, and exclusivity for any occasion. Whether it’s a birthday,
          anniversary, engagement, or family gathering, we ensure your event is
          truly magical.
        </p>

        <div className="event-gallery">
          <div className="leftgallery">
            <img
              src="https://www.bettaeventhire.com.au/wp-content/uploads/2019/10/shutterstock_139152893.jpg"
              alt=""
            />
          </div>
          <div className="rightgallery">
            <img
              src="https://imageio.forbes.com/specials-images/imageserve/6395cd9ab09c464cbe574742/People-taking-goofy-picture-showing-importance-of-office-parties-/960x0.jpg?height=447&width=711&fit=bounds"
              alt=""
            />
            <img
              src="https://cdn.media.amplience.net/i/partycity/what-is-a-color-party-article-hero-image?fmt=auto&qlt=default&fmt.jp2.qlt=85&w=820&sm=aspect&aspect=16:9"
              alt=""
            />
            <img
              src="https://www.marthastewart.com/thmb/iZgtkA45VDwwqjClgIAfDLuff20=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/how-to-plan-a-successful-party-in-eleven-easy-steps-1122-2000-b3bff1db414d466ab55fd140477b9d1a.jpg"
              alt=""
            />
            <img
              src="https://cdn8.dissolve.com/p/D430_44_986/D430_44_986_1200.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
      <Contact />
      <Footer />
    </>
  );
}

export default Event2;
