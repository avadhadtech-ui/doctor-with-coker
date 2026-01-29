import React from 'react'
import {assets} from '../assets/assets_frontend/assets'

const Contact = () => {
  return (
    <div>
          <div className='text-center text-2xl pt-10'>
            <p className='text-[var(--black)] uppercase'>contact us</p>
          </div>
          <div className='my-10 flex flex-col justify-center lg:flex-row gap-10 mb-28 text-sm'>
            <img className='w-full lg:max-w-[360px]' src={assets.contact_image} alt="" />

            <div className='flex flex-col justify-center items-start gap-6'>
              <p className='uppercase font-semibold text-lg text-[var(--greyBlack)]'>our office</p>
              <p className='text-[var(--greyBlack)]'>54709 Willms Station <br /> Suite 350, Washington, USA </p>
              <p className='text-[var(--greyBlack)]'>Tel: (415) 555‑0132</p>
              <p className='text-[var(--greyBlack)]'>Email: greatstackdev@gmail.com</p>
              <p className='uppercase font-semibold text-lg text-[var(--greyBlack)]'>Careers at PRESCRIPTO</p>
              <p className='text-[var(--greyBlack)]'>Learn more about our teams and job openings.</p>
              <button className='border border-[var(--black)] px-8 py-4 text-sm hover:bg-[var(--black)] hover:text-[var(--white)] transition-all duration-500'>Explore Jobs</button>
            </div>

          </div>

    </div>
  )
}

export default Contact
