import React, { useEffect, useState } from 'react'
import './Activity.css'
import Nav from '../Nav/Nav'
import Contact from '../Contact/Contact'
import Footer from '../footer/Footer'
import Plx from "react-plx";
import { RxDoubleArrowRight } from "react-icons/rx";
import { useLocation } from 'react-router-dom'
import activityhero from "./img/activityhero.jpg"
import horseriding from "./img/horseriding.jpg"
import carsafari from "./img/carsafari.jpg"
import bonefire from "./img/bonefire.jpg"
import starwatching from "./img/starwatching.jpg"
import camping from "./img/camping.jpg"
import camelsafari from "./img/camelsafari.jpg"
import gel1 from "./img/gel1.jpg"
import gel2 from "./img/gel2.jpg"
import gel3 from "./img/gel3.jpg"
import gel4 from "./img/gel4.jpg"
import gel5 from "./img/gel5.jpg"

function Activity() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    const acthero = [
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

      const activites =[
        {
            actName: "Horse Riding", 
            actdetails: `With the amazing horseback riding experience offered by Subla Camp, discover the desert of Dubai on horseback. Riding over breathtaking dunes under knowledgeable supervision is ideal for riders of all ability levels. Savor the adventure, peace, and stunning vistas that will make your trip through the desert genuinely unforgettable.`,
            actimg: horseriding
        },
        {
            actName: "Car Safari", 
            actdetails: "Discover the excitement of a desert vehicle safari in Dubai's Subla Camp. Drive a 4x4 through stunning dunes under the direction of skilled drivers. This thrilling ride is ideal for those who enjoy adventure since it blends thrills with breathtaking views of the desert to create a voyage that will never be forgotten.",
            actimg: carsafari
        },
        {
            actName: "Bonfire", 
            actdetails: "Enjoy the comforting bonfire experience at Subla Camp while relaxing beneath the beautiful desert sky. In the middle of Dubai's tranquil desert, assemble around the cozy fire, take in the traditional music, and make lifelong memories. Ideal for moments of connection and relaxation.",
            actimg: bonefire
        },
        {
            actName: "Stars Watching", 
            actdetails: "Take advantage of Subla Camp's stargazing experience to fully appreciate the splendor of Dubai's desert. Away from the lights of the city, take in the peace and quiet of the quiet dunes and see a starry sky. An ideal pastime for those who enjoy astronomy and the natural world.",
            actimg: starwatching
        },
        {
            actName: "Camping", 
            actdetails: "Take advantage of Subla Camp's camping adventure in Dubai for the ultimate desert getaway. Under the stars, savor traditional dinners, stay in cozy tents surrounded by tranquil dunes, and establish a connection with nature. Ideal for an unforgettable vacation.",
            actimg: camping
        },
        {
            actName: "Camel Safari", 
            actdetails: "Experience the breathtaking Dubai desert like never before by going on a traditional camel safari at Subla Camp. For an experience that will never be forgotten, ride across golden dunes, take in breath-taking scenery, and become fully immersed in Arabian culture.",
            actimg: camelsafari
        },
      ]
      const [act,setAct] = useState(0);
  return (
    <>
    <Nav/>
     <div className="acthero">
            <div className="acthero-filter">
                <h2>Things to do</h2>
                <p>Enjoy Different Activites!</p>
            </div>
            <Plx className='acthero-img'  parallaxData={acthero}>
                <img src={activityhero} alt="" />
            </Plx>
      </div>
      <div className="activites">
        <div className="actpicker">
            <h2>Things to do <div className='headingline'></div></h2>
            {
                activites.map((e ,index)=>{
                    return(
                        <h4 onClick={()=>{setAct(index)}}>{e.actName} <RxDoubleArrowRight /></h4>
                    );
                })
            }
        </div>
        <div className="actinfo">
            <h3>{activites[act].actName}</h3>
            <div className="actimg">
                <img src={activites[act].actimg} alt="" />
            </div> 
            <p>{activites[act].actdetails}</p>
        </div>
      </div>
      <div className="act-gallery">
        <div className="leftgallery">
          <img src={gel1} alt="" />
        </div>
        <div className="rightgallery">
            <img src={gel2} alt="" />
            <img src={gel3} alt="" />
            <img src={gel4} alt="" />
            <img src={gel5} alt="" />
        </div>
       </div>
      <Contact/>
      <Footer/>
    </>
  )
}

export default Activity
