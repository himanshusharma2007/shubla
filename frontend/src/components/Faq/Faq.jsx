import React, { useState } from 'react';
import "./Faq.css";
import { GoArrowDownLeft } from "react-icons/go";
import faqimg from "./img/faq.jpg"

function Faq() {

    const [Faq, setFaq] = useState([
        {
            question:"1.What types of accommodations do you offer?",
            answer: "We offer various accommodations including comfortable rooms, luxurious tents, and adventurous camps to suit all preferences and budgets.",
            state: 'closeans'
        },
        {
            question:"2.What activities are available at the desert camp?",
            answer: "We offer a wide range of activities such as camel rides, desert safaris, stargazing, cultural performances, and bonfire sessions for an unforgettable desert experience.",
            state: 'closeans'
        },
        {
            question:"3.Are the tents and camps equipped with basic amenities?",
            answer: "Yes, our tents and camps are well-equipped with necessary amenities like comfortable bedding, lighting, and fans for your comfort during your stay.",
            state: 'closeans'
        },
        {
            question:"4.Are there any age restrictions for activities?",
            answer: "Most activities are suitable for all ages, but certain activities like camel rides and safaris may have age or health restrictions for safety reasons.",
            state: 'closeans'
        },
        {
            question:"5.How can I book a stay at the Subla camp?",
            answer: "You can easily book your stay by visiting our website and selecting your preferred accommodation type, dates, and any additional activities you wish to include.",
            state: 'closeans'
        },
        {
            question:"6.Can I arrange for special events at the desert camp?",
            answer: "Yes, we can help organize special events such as birthdays, anniversaries, or corporate retreats. Please contact us in advance to discuss your requirements.",
            state: 'closeans'
        },
        {
            question:"7.Do you offer bulk discounts for corporate or group orders?",
            answer: "Yes, we do offer special discounts for bulk orders. If you’re interested in placing a corporate or group order, please get in touch with our team through the contact information provided on our website.",
            state: 'closeans'
        },
        {
            question:"8.What should I do if I need further assistance?",
            answer: "If you have any additional questions or need further assistance, don’t hesitate to reach out to our friendly customer support team. You can contact us via email, phone, or through the contact form on our website. We’ll be more than happy to help you with anything you need.",
            state: 'closeans'
        },
    ]);

 
  return (
    <div className='Faq'>
      <h3>Frequently Asked Questions</h3>
      <div className="Faq-inner">
        <div className="Faq-1">
            <h2>FAQ's <div className='headingline'></div></h2>
            <p>Experience the thrill of camping in the UAE’s stunning deserts with confidence and ease. Happy camping!</p>
            <img src={faqimg} alt="" />
        </div>
        <div className="Faq-2">
            {
                Faq.map((ele , index) => {
                    return(
                        <div key={ele.question}>
                            <h5 className="quest" 
                            onClick={()=>{
                                let newfaq = [...Faq];
                                if(newfaq[index].state == 'openans'){
                                    newfaq[index].state = 'closeans';
                                }
                                else{
                                    newfaq.map((e , i)=>{
                                        if(i == index){
                                            newfaq[i].state = 'openans';
                                        }
                                        else{
                                            newfaq[i].state = 'closeans';
                                        }
                                    }) 
                                }
                                setFaq(newfaq);
                            }
                            }
                            ><span>{ele.question}</span> <span><GoArrowDownLeft /></span></h5>
                            <div className={ele.state}>
                            <p>{ele.answer}</p>
                            </div>
                        </div>
                    );
                })
            }
            
            
        </div>
      </div>
    </div>
  )
}

export default Faq
