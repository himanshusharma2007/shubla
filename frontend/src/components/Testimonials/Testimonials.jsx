import React from "react";
import "./Testimonials.css";

function Testimonials() {
  return (
    <div className="Testimonials">
      <div>
        <h2>
          <div className="headingline2"></div> 
            Testimonials
          <div className="headingline2"></div>
        </h2>
        <h3>What They Say</h3>

        <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner test-slider">
            <div className="carousel-item active">
              <p className="d-block w-10">"Subla Camp proved to be a delightful retreat for our family! The kids' play area was a blast, offering endless fun and activities. The BBQ spot, coupled with the projector, added a special touch to our evenings, making for memorable and cozy gatherings. The beautiful surroundings and the array of enjoyable amenities made our stay truly enjoyable for all ages. A perfect blend of relaxation and entertainment – definitely a place worth revisiting!"</p>
              <h5>Farhan Mohammad</h5>
              <h6>Dubai</h6>
            </div>
            <div className="carousel-item">
              <p className="d-block w-10">Excellent family and friends gathering and relaxing camp with all required facilities.  Children can have lots of fun ispicily it is located walking distance from kids play area.Very clean 👌The camp is very quiet for relaxation with clean inviroment.</p>
              <h5>Saeed al Suwaidi</h5>
              <h6>Dubai</h6>
            </div>
            <div className="carousel-item">
              <p className="d-block w-10">Exceptional mountain camping experience with a clean environment. Perfect for families – kids loved the spacious grounds for playing, making it an ideal retreat for nature-loving adventurers.</p>
              <h5>Rana Umair</h5>
              <h6>Dubai</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
