import React, { useEffect } from 'react'
import Nav from '../Nav/Nav'
import Hero2 from '../Hero2/Hero2'
import About from '../About/About'
import Book from '../Booking/Book'
import Facilities from '../Facilities/Facilities'
import Footer from '../footer/Footer'
import Faq from '../Faq/Faq'
import Contact from '../Contact/Contact'
import Testimonials from '../Testimonials/Testimonials'
import InstaPost from '../InstaGallary/InstaPost'
import { useLocation } from 'react-router-dom'


function Home() {
  const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
  return (
    <>
     <Nav/>
     <Hero2/>
     <About/>
     <Facilities/>
     <InstaPost/>
     <Faq/>
     <Testimonials/>
     <Contact/>
     <Footer/>
    </>
  )
}

export default Home
