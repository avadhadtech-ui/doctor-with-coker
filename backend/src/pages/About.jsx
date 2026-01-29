import React from 'react'
import {assets} from '../assets/assets_frontend/assets'
import Choose from '../components/Choose.jsx'

const About = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-[var(--grey)]'> 
          <p className='uppercase font-medium text-[var(--black)]'>about us</p>
        </div>
        <div className='my-10 flex flex-col lg:flex-row gap-12'>
          <img className='w-full lg:max-w-[360px]' src={assets.about_image} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-[var(--grey )]'>
            <p>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
            <p>Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.</p>
            <strong className='text-[var(--black)] font-bold'>Our Vision</strong>
            <p>Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it. </p>
          </div>
        </div>
        <div className='text-xl my-4'>
        <p className='uppercase font-medium text-[var(--black)]'>why choose us</p>
        </div>
        <div className='bor-clas grid lg:grid-cols-[3fr_3fr_3fr] md:grid-cols-[6fr_6fr] flex-wrap mb-20 mt-[50px] border-separate '>
                <Choose title="Efficiency:" reason="Streamlined appointment scheduling that fits into your busy lifestyle." className='border-r-1 md:border-r-0  border-b-0 lg:border-b-1'/>
                <Choose title="Convenience:" reason="Access to a network of trusted healthcare professionals in your area."className="border-r-1 border-b-0 md:border-b-1 lg:border-r-0" />
                <Choose title="Personalization:" reason="Tailored recommendations and reminders to help you stay on top of your health."   className="border-r-1" />
        </div>
    </div>
  )
}

export default About
