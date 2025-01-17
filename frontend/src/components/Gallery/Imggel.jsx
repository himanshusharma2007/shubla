import React, { useState } from 'react'
import img1 from "./img/img1.jpg"
import img2 from "./img/img2.jpg"
import img3 from "./img/img3.jpg"
import img4 from "./img/img4.jpg"
import img5 from "./img/img5.jpg"
import img6 from "./img/img6.jpg"

function Imggel() {
    const gellary = [
       img1,
       img2,
       img3,
       img4,
       img5,
       img6
    ]

    const [img , setImg] = useState(0);
    
  return (
   
            <div className="gel">
                <div className="gelshow">
                    <img src={gellary[img]} alt="" />
                </div>
                <div className="gelselector">
                    {
                    gellary.map((e , index)=>{
                        return(
                            <img src={e} alt="" key={index} onClick={()=>{setImg(index)}}/>
                        );
                    })
                    }
                </div>
            </div>
  );
}

export default Imggel
