import React from 'react'
import './Contact.css'


function Contact() {
  return (
    <>
    
    <div className='Contact' id='Contact'>
      <div className="map">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.681428086985!2d56.0626356!3d24.840565899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef51bb95fef5719%3A0x1fab8748e54e6092!2z2KXYs9iq2LHYp9it2Kkg2YjZhdiu2YrZhSDYp9mE2LPYqNmE2KkgfCBTdWJsYSBDYW1w!5e0!3m2!1sen!2sin!4v1734516937467!5m2!1sen!2sin" width={400} height={300} style={{border:0}} allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div className="contact-right">
        <h2>Contact Us <div className='headingline'></div></h2>
        <p>Have questions about our desert camping packages? Want to book a private experience for your family or friends? We’re here to help you create unforgettable memories under the starry desert skies.</p>
        <form action="">
            <input  className="form-control" type="text" placeholder='Name' />
            <input  className="form-control" type="mail" placeholder='Email' />
            <textarea  className="form-control" name="msg" id="msg" placeholder='Write a message'></textarea>
            <button>Submit</button>
        </form>
      </div>
    </div>
   
    </>
  )
}

export default Contact
