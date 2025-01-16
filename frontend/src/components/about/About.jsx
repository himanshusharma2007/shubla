import React from 'react'
import './About.css'
import Plx from "react-plx";
import Intro from '../../assets/intro.mp4'
// import Insta1 from '../../assets/insta1.jpg'



const headingdata = [
    {
      start: "self",
      duration: "80vh",
      properties: [
        {
          startValue: 0,
          endValue: -400,
          property: "translateY",
        },
      ],
    },
  ];  

  const parlexdiv = [
    {
      start: "self",
      duration: "100vh",
      properties: [
        {
            startValue: 0,
            endValue: 1000,
            property: "translateY",
        },
      ],
    },
  ];

function About() {
  return (
    <>
    <div className='about'>
      <div className="left-abt">
            <Plx className='h-2' parallaxData={headingdata}>
                {/* <h2>Desert</h2> */}
                <h2>استراحةالشبة</h2>
            </Plx>   
            {/* <img src='./img1.jpg' alt="" /> */}
            <video src={Intro}  muted autoPlay loop>
             Your browser does not support the video tag.
           </video>
      </div>
      <div className="right-abt">  
            <p className='p-1'>
            While remaining dedicated to sustainability, Subla Camps combine the allure of the Bedouin way of life with the coziness of opulent lodging. Our camps, which are tucked away in the Dubai desert, offer tastefully decorated tents and accommodations as well as easy caravan parking, guaranteeing our visitors a special and unforgettable stay.
            </p>
            <h4>Imagine what would be the perfect stay for you: </h4>
            <p className='p-2'>
            Enjoy days that will never be forgotten in your private camp in the desert of Dubai, anywhere you choose. Spend a night or two at our environmentally friendly permanent camp and take in the tranquil beauty of the surroundings. Or have a lovely dinner outside to commemorate a special occasion. Subla Camps will turn any of your fantasies into a reality!
            </p>
      </div>
    </div>
    




    
    </>
  )
}

export default About
