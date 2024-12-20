import React, { useState } from 'react'

function Imggel() {
    const gellary = [
        "./img1.jpg",
        "./img2.jpg",
        "./img3.jpg",
        "./img4.jpg",
        "./park.jpg",
        "./room.jpg",
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
                            <img src={e} alt="" onClick={()=>{setImg(index)}}/>
                        );
                    })
                    }
                </div>
            </div>
  );
}

export default Imggel
