import React, { useEffect, useState } from 'react'
import './Activity.css'
import Nav from '../Nav/Nav'
import Contact from '../Contact/Contact'
import Footer from '../footer/Footer'
import Plx from "react-plx";
import { RxDoubleArrowRight } from "react-icons/rx";
import { useLocation } from 'react-router-dom'

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
            actName: "Camel Safari", 
            actdetails: `Take a journey back in time and explore Dubai’s enchanting desert landscape with a Camel Safari. Known as the "Ship of the Desert", camels offer a serene and authentic way to traverse the golden dunes while immersing yourself in the beauty and tranquility of the Arabian desert.?`,
            actimg: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/11/74/a3/caption.jpg?w=1200&h=-1&s=1'
        },
        {
            actName: "Car Safari", 
            actdetails: "Looking for an adrenaline-packed adventure through the vast, golden dunes of Dubai? Our Car Safari offers the perfect blend of excitement and exploration as you navigate the desert's rugged terrain in a powerful 4x4 vehicle. Prepare for a thrilling ride that will leave you with unforgettable memories!",
            actimg: 'https://arabiahorizons.com/blog/wp-content/uploads/2020/05/Jeep-safari-Dubai.jpg'
        },
        {
            actName: "Boanfire", 
            actdetails: "End your day in the desert with a cozy and magical bonfire experience. Gather around the warmth of the crackling fire, share stories, enjoy the soothing desert breeze, and gaze up at the starlit sky. Our bonfire setting provides the perfect atmosphere for relaxation, creating unforgettable moments with friends and family.?",
            actimg: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/09/25/05/7b.jpg'
        },
        {
            actName: "Stars Watching", 
            actdetails: "Escape the city's lights and immerse yourself in the breathtaking beauty of the desert sky. Our stargazing experience lets you witness the wonders of the night sky like never before. With the vast, clear desert horizon as your backdrop, marvel at the twinkling stars and constellations above, far away from any light pollution",
            actimg: 'https://img.freepik.com/premium-photo/group-individuals-sitting-atop-barren-desert-landscape-gazing-vast-night-sky-group-friends-star-gazing-desert-ai-generated_585735-9362.jpg'
        },
        {
            actName: "Camping", 
            actdetails: "Step into the heart of the desert and experience the thrill of camping under the vast, open sky. Our desert camping offers a unique opportunity to connect with nature in one of the most serene and stunning environments in Dubai. Sleep under a blanket of stars in our comfortable tents, surrounded by the tranquility of the desert.",
            actimg: 'https://www.tourpackagejaisalmer.com/images/desert-night-camp.png'
        },
        {
            actName: "Games", 
            actdetails: "Get ready for an action-packed day in the desert with a wide variety of games and activities! From adrenaline-pumping dune bashing to thrilling sandboarding, our desert camp offers something for everyone. Challenge your friends and family to a friendly game of volleyball or soccer on the sand, or try your hand at archery for a unique desert challenge.",
            actimg: 'https://c02.purpledshub.com/uploads/sites/62/2022/01/Playing-board-game.-GettyImages-1227346894-b712fd5.jpg?w=1029&webp=1'
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
                <img src="./act1.jpg" alt="" />
            </Plx>
      </div>
      <h2 className='acthead'>Things To do with Us</h2>
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
          <img src='https://cdn-imgix.headout.com/tour/19728/TOUR-IMAGE/498347a2-2851-4cd0-a593-df08144994fc-1890-HummerDesertSafari-14.JPG' alt="" />
        </div>
        <div className="rightgallery">
            <img src='https://assets-global.website-files.com/5f858c8d952706d07e333d4b/65411698e2851cf9352b8433_BUR06006.jpg' alt="" />
            <img src='https://assets-global.website-files.com/5f858c8d952706d07e333d4b/654116c2292264df8283bc56_orhan%20Kardeniz%20(9).jpg' alt="" />
            <img src='https://extranet.transindiaholidays.com/images/package/images/Thumbnail/TransIndia-Desert-Dunes-20191023_041052.jpg' alt="" />
            <img src='https://assets-global.website-files.com/5f858c8d02ebf5f32ed60fc2/60988bd7342b818c3debeca5_bien-etre-2.jpg' alt="" />
        </div>
       </div>
      <Contact/>
      <Footer/>
    </>
  )
}

export default Activity
