import React from 'react'
import {specialityData} from '../assets/assets_frontend/assets'
import {Link} from 'react-router-dom'
import '../root.css'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-grey-800' id='speciality'>
            <h1 className='text-3xl font-medium text-grey-800'>Find by Speciality</h1>
            <div className='flex justify-around lg:justify-center gap-4 pt-5 w-[80vw] overflow-scroll'>
                    {
                        specialityData.map((detail, index)=>(
                          <Link onClick={()=>scrollTo(0,0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/doctors/${detail.speciality}`}speciality>
                                <img className='w-20 sm:w-24 mb-2' src={detail.image} />
                                <p>{detail.speciality}</p>
                          </Link>
                        ))
                    }
            </div>
    </div>
  )
}

export default SpecialityMenu
