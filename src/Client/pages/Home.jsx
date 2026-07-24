import React from 'react'
import { Carousel } from '../Components/Carasoul'
import FitnessGallery from './Gallery'
import ClearanceBanner from '../Components/Banner'

 const Home = () => {
  return (
    <>
    <Carousel/>
    <FitnessGallery />
    <ClearanceBanner />
    </>
  )
}

export default Home