import React, { useState } from 'react';
import './Gallery2.css';
import { RxCross2 } from "react-icons/rx";
import Insta1 from '../../assets/insta1.jpg'
import Insta2 from '../../assets/insta2.png'
import Insta3 from '../../assets/insta3.png'
import Insta4 from '../../assets/insta4.png'
import Insta5 from '../../assets/insta5.png'
import Insta6 from '../../assets/insta6.png'
import Insta7 from '../../assets/insta7.png'



const GalleryComponent = () => {
  const [images, setImages] = useState([
    Insta1,
    Insta2,
    Insta3,
    Insta3,
    Insta3,
    Insta3,
    Insta4,
    Insta5,
    Insta6,
    Insta7,
    Insta1,
    Insta1,
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
      {images.map((image, index) => (
        <div key={index} className="gallery-item" onClick={() => openPopup(image)}>
          <img src={image} alt={`Gallery ${index + 1}`} />
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
