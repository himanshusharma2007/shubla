import React, { useState } from 'react'
import './InstaPost.css'
import { MdContentCopy } from "react-icons/md";
import Insta1 from '../../assets/insta1.jpg'
import Insta2 from '../../assets/insta2.png'
import Insta3 from '../../assets/insta3.png'
import Insta4 from '../../assets/insta4.png'
import Insta5 from '../../assets/insta5.png'
import Insta6 from '../../assets/insta6.png'
import Insta7 from '../../assets/insta7.png'
import Insta8 from '../../assets/insta8.png'


function InstaPost() {
    const [img,setImg] = useState([
        {url: Insta1,
          link: 'https://www.instagram.com/p/DCxGKy6zwPY/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {url: Insta2,
          link: 'https://www.instagram.com/p/C14cTeyx2MS/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {url: Insta3,
          link: 'https://www.instagram.com/p/DCxE-qTzL72/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {url: Insta4,
          link: 'https://www.instagram.com/p/DCza1aPBxws/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {url: Insta5,
          link: 'https://www.instagram.com/p/DCxG7IWTrZd/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {url: Insta6,
          link: 'https://www.instagram.com/p/C5nb5EPRljk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {url: Insta7,
          link: 'https://www.instagram.com/p/C14cherxLNy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {url: Insta8,
          link: 'https://www.instagram.com/p/DCxGRLjTKNO/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        
    ])
  return (
    <>
    
      <div className='insta-post'>
        <div className='insta'>
            <h1>Instagram Post's</h1>
            <a href="https://www.instagram.com/subla.camp/">
            <button >FOLLOW US</button>
            </a>
        </div>
        <div className='post '>
            {img.map((item)=>(
                <div className='p-img'>
                  <a href={item.link}>
                  <img src={item.url} alt=""  className='rounded-md'/>
                  </a>
                    <MdContentCopy className='icon' />
                </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default InstaPost
