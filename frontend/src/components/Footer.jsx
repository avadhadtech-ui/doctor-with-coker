import React from 'react'
import {useState} from 'react'
import {assets} from '../assets/assets_frontend/assets'
const Footer = () => {
  return (
    <div className=' lg:mx-10 sm:w-[100%]'>
        <div className='flex flex-wrap flex-row gap-14 my-10 mt-40 text-sm justify-between'>
            <div className='lg:w-[40%] w-[100%] '>
              <img className='mb-5 w-40' src={assets.logo} alt="" />
              <p className='w-full text-[var(--grey)] leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>
            <div className='lg:w-[20%] w-full'>
              <p className='uppercase text-xl font-medium mb-5'>company</p>
              <ul className='flex flex-col gap-2 text-[var(--grey)]'>
                <li>Home</li>
                <li>About us</li>
                <li>Contact us</li>
                <li>Privacy policy</li> 
              </ul>
            </div>
            <div className='lg:w-[20%] w-full'>
            <p className='uppercase text-xl font-medium mb-5'>get in touch</p>
                      <ul className='flex flex-col gap-2 text-[var(--grey)]'>
                        <li>+1 443-546-2524</li>
                        <li>avadhgolakiya88@gmail.com</li>
                      </ul>
            </div>
        </div>

        <div>
              <hr />
              <p className='py-5 text-sm text-center'>Copyright ©  {new Date().getFullYear()}  Avadh Golakiya - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
