import React from 'react'
import { assets } from '../assets/assets_frontend/assets';
import '../root.css'
const Header = () => {
  return (
    <div className='flex sm:text-center md:text-start flex-col md:flex-row flex-wrap bg-[var(--primary)] rounded-lg px-6 md:px-10'>
        <div className='lg:w-1/2 sm:w-100 place-items-center lg:place-items-start  flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[5vw] md:mb-[0px] text-center lg:text-start'>
            <h1 className='text-2xl md:text-4xl lg:text-4xl text-white font-semibold text-center lg:text-start m-auto lg:m-0'>BooK Appoinment<br /> With Trusted Doctors</h1>
            <div className='flex flex-col lg:flex-row items-center gap-3 text-white text-sm font-light'>
                 <img src={assets.group_profiles} alt="group_images" className='w-28'/>
                 <p className='text-white'>Simply browse through our extensive list of trusted doctors,  <br className='hidden sm:block'/>
                 schedule your appointment hassle-free</p>
            </div>
            <a href="#speciality" className='self-center lg:self-start flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[var(--grey)] text-sm  hover:scale-105 transition-all duration-300'>
                Book appoinment <img className='w-3' src={assets.arrow_icon} />
            </a>
        </div>
        <div className='lg:w-1/2 content-end'>
            <img className='w-full  bottom-0 h-auto rounded-lg' src={assets.header_img} />
        </div>
    </div>
  )
}

export default Header
