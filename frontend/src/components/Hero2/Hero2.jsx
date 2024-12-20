import React from 'react'
import './Hero2.css'
import Plx from "react-plx";

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
                    <img src="./bg22.png" alt="" />
        </Plx>
        <Plx className="herolayer1" parallaxData={herolayer1}>
                    <h1>Desert <br /> Camping</h1>
        </Plx>
        <Plx className="herolayer2" parallaxData={herolayer2}>
                    <img src="./bg12.png" alt="" />
        </Plx>
        <Plx className="mountain2" parallaxData={herolayer3}>
                    <img src="./bg11.png" alt="" />
        </Plx>

        
    </div>
  )
}

export default Hero2
