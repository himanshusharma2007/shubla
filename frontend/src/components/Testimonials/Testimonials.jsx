import React, { useEffect, useState } from "react";
import "./Testimonials.css";

function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      text: "Subla Camp proved to be a delightful retreat for our family! The kids' play area was a blast, offering endless fun and activities. The BBQ spot, coupled with the projector, added a special touch to our evenings, making for memorable and cozy gatherings. The beautiful surroundings and the array of enjoyable amenities made our stay truly enjoyable for all ages. A perfect blend of relaxation and entertainment – definitely a place worth revisiting!",
      name: "Farhan Mohammad",
      location: "Dubai"
    },
    {
      text: "Excellent family and friends gathering and relaxing camp with all required facilities. Children can have lots of fun ispicily it is located walking distance from kids play area. Very clean 👌The camp is very quiet for relaxation with clean inviroment.",
      name: "Saeed al Suwaidi",
      location: "Dubai"
    },
    {
      text: "Exceptional mountain camping experience with a clean environment. Perfect for families – kids loved the spacious grounds for playing, making it an ideal retreat for nature-loving adventurers.",
      name: "Rana Umair",
      location: "Dubai"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="Testimonials">
      <div>
        <h2>
          <div className="headingline2"></div> 
            Testimonials
          <div className="headingline2"></div>
        </h2>
        <h3>What They Say</h3>



        <div className="relative w-full max-w-3xl mx-auto overflow-hidden">
      <div 
        className="transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 px-6 py-8 text-center"
            >
              <p className="text-white text-lg mb-6 italic">
                "{testimonial.text}"
              </p>
              <h5 className="text-xl font-semibold text-white mb-2">
                {testimonial.name}
              </h5>
              <h6 className="text-sm text-gray-300">
                {testimonial.location}
              </h6>
            </div>
          ))}
        </div>
      </div>
      
     
    </div>
      



      </div>
    </div>
  );
}

export default Testimonials;







  

  
    



