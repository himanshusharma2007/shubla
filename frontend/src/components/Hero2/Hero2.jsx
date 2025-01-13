import React from 'react'
import './Hero2.css'
import Plx from "react-plx";
import heroimg2 from "./img/heroimg2.png"
import heroimg1 from "./img/heroimg1.png"
import heroimg3 from "./img/heroimg3.png"

function Hero2() {


  const herolayer0 = [
    {
      start: 0,
      end: 500,
      properties: [
        {
          startValue: 1,
          endValue: 2,
          property: "scale",
        },
        {
          startValue: 0,
          endValue: 500,
          property: "translateX",
        },
        {
          startValue: 0,
          endValue: -100,
          property: "translateY",
        },
      ],
    },
  ];
  const herolayer1 = [
    {
      start: 0,
      end: 500,
      properties: [
        {
          startValue: 1,
          endValue: 1.1,
          property: "scale",
        },
        {
          startValue: 0,
          endValue: 300,
          property: "translateY",
        },
      ],
    },
  ];
    const herolayer2 = [
        {
          start: 0,
          end: 500,
          properties: [
            {
              startValue: 1,
              endValue: 2,
              property: "scale",
            },
            {
              startValue: 0,
              endValue: -500,
              property: "translateX",
            },
            {
              startValue: 0,
              endValue: -100,
              property: "translateY",
            },
          ],
        },
      ];

      const herolayer3 = [
        {
          start: 0,
          end: 500,
          properties: [
            {
              startValue: 1,
              endValue: 1.5,
              property: "scale",
            },
            {
              startValue: 0,
              endValue: 300,
              property: "translateX",
            },
            {
              startValue: 0,
              endValue: -100,
              property: "translateY",
            },
          ],
        },
      ];


     
  return (
    <div className='Hero2section'>

        <div className="filterhero"></div>
        <Plx className="herolayer0" parallaxData={herolayer0}>
                    <img src={heroimg1} alt="" />
        </Plx>
        <Plx className="herolayer1" parallaxData={herolayer1}>
                    <h1>Subla <br /> Camps</h1>
        </Plx>
        <Plx className="herolayer2" parallaxData={herolayer2}>
                    <img src={heroimg2} alt="" />
        </Plx>
        <Plx className="mountain2" parallaxData={herolayer3}>
                    <img src={heroimg3} alt="" />
        </Plx>

        
    </div>
  )
}

export default Hero2
