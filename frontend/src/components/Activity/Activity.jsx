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
            actdetails: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente adipisci unde repellendus non atque perferendis molestiae ducimus asperiores accusantium amet quam illum, velit est maiores error? Perspiciatis, quisquam beatae! Ducimus?",
            actimg: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/11/74/a3/caption.jpg?w=1200&h=-1&s=1'
        },
        {
            actName: "Car Safari", 
            actdetails: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente adipisci unde repellendus non atque perferendis molestiae ducimus asperiores accusantium amet quam illum, velit est maiores error? Perspiciatis, quisquam beatae! Ducimus?",
            actimg: 'https://arabiahorizons.com/blog/wp-content/uploads/2020/05/Jeep-safari-Dubai.jpg'
        },
        {
            actName: "Boanfire", 
            actdetails: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente adipisci unde repellendus non atque perferendis molestiae ducimus asperiores accusantium amet quam illum, velit est maiores error? Perspiciatis, quisquam beatae! Ducimus?",
            actimg: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/09/25/05/7b.jpg'
        },
        {
            actName: "Stars Watching", 
            actdetails: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente adipisci unde repellendus non atque perferendis molestiae ducimus asperiores accusantium amet quam illum, velit est maiores error? Perspiciatis, quisquam beatae! Ducimus?",
            actimg: 'https://img.freepik.com/premium-photo/group-individuals-sitting-atop-barren-desert-landscape-gazing-vast-night-sky-group-friends-star-gazing-desert-ai-generated_585735-9362.jpg'
        },
        {
            actName: "Camping", 
            actdetails: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente adipisci unde repellendus non atque perferendis molestiae ducimus asperiores accusantium amet quam illum, velit est maiores error? Perspiciatis, quisquam beatae! Ducimus?",
            actimg: 'https://www.tourpackagejaisalmer.com/images/desert-night-camp.png'
        },
        {
            actName: "Games", 
            actdetails: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente adipisci unde repellendus non atque perferendis molestiae ducimus asperiores accusantium amet quam illum, velit est maiores error? Perspiciatis, quisquam beatae! Ducimus?",
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
