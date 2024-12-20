import React from 'react'
import './About.css'
import Plx from "react-plx";
import Intro from '../../assets/intro.mp4'
// import Insta1 from '../../assets/insta1.jpg'



const headingdata = [
    {
      start: "self",
      duration: "100vh",
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
                <h2>Desert</h2>
            </Plx>   
            {/* <img src='./img1.jpg' alt="" /> */}
            <video src={Intro} controls muted autoPlay loop>
             Your browser does not support the video tag.
           </video>
      </div>
      <div className="right-abt">  
            <p className='p-1'>
                Magic Camps combine a flavour of the Bedouin traditional way of life with the comfort of luxury accommodation plus commitment to sustainability. Our desert camps are equipped with exquisite and inviting interiors, including private bathrooms equipped with showers.
            </p>
            <h4>Imagine what would be the perfect stay for you: </h4>
            <p className='p-2'>
            Spend a few days in your private camp in a location of your choice in Dubai, Abu Dhabi or Oman ? Escape for a night or two at our eco-conscious fixed camp in Oman’s Wahiba Sands Desert ? Or celebrate an event with a magical dinner under the stars? Whatever it is, we will make it come true !
            </p>
      </div>
    </div>
    




    
    </>
  )
}

export default About
