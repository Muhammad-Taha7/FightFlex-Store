import React from 'react'
import { Carousel } from '../Components/Carasoul'
import FitnessGallery from './Gallery'
import ClearanceBanner from '../Components/Banner'
import ProductSlider from '../Components/ProductSlider'
import Footer from '../Components/Footer'

 const Home = () => {
  return (
    <>
    <Carousel/>
    <FitnessGallery />
    <ProductSlider />
    <ClearanceBanner />
    <Footer />
    </>
  )
}

export default Home