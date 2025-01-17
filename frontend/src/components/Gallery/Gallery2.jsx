import React, { useEffect, useState } from 'react';
import './Gallery2.css';
import { RxCross2 } from "react-icons/rx";
import Insta1 from '../../assets/insta1.jpg'
import Insta2 from '../../assets/insta2.png'
import Insta3 from '../../assets/insta3.png'
import Insta4 from '../../assets/insta4.png'
import Insta5 from '../../assets/insta5.png'
import Insta6 from '../../assets/insta6.png'
import Insta7 from '../../assets/insta7.png'
import img1 from "./img/img1.jpg"
import img2 from "./img/img2.jpg"
import img3 from "./img/img3.jpg"
import img4 from "./img/img4.jpg"
import img5 from "./img/img5.jpg"
import imageService from '../../services/imageService'



const GalleryComponent = () => {
  const [apiImg , setApiImg] = useState([]);

  async function fetchApiImg(){
    try {
      const apiImg = await imageService.getAllGalleryImages();
      setApiImg(apiImg.data);
    } catch (error) {
      console.log(error);
      throw error;
    }  
  }

  

  useEffect(()=>{
    fetchApiImg()
  },[])

 
  

  const [images, setImages] = useState([
    Insta1,
    Insta2,
    Insta3,
    Insta4,
    Insta5,
    Insta6,
    Insta7,
    img1,
    img2,
    img3,
    img4,
    img5
  

  ]);

  const [selectedImage, setSelectedImage] = useState(null);

  const openPopup = (image) => {
    setSelectedImage(image);
  };

  const closePopup = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-container">
      {apiImg.map((e, index) => (
        <div key={index} className="gallery-item" onClick={() => openPopup(image)}>
          <img src={e.image.url} alt={e.alt} />
        </div>
      ))}

      {/* Popup Component */}
      {selectedImage && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={closePopup}>
              {/* &times; */}
              <RxCross2 />

            </button>
            <img src={selectedImage} alt="Full Size" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryComponent;
