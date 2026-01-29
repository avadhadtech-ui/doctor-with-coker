import React from 'react'
import {useContext,useEffect} from 'react'
import {AdminContext} from '../../context/AdminContext'
import {AppContext} from '../../context/AppContext'
import {assets} from '../../assets/assets'
const AllAppoinments = () => {
  const {aToken,appoinment, getAllAppoinment,cancelAppoinment} = useContext(AdminContext)
  const {calculateAge,slotDateFormate} = useContext(AppContext)
  useEffect(() => {
    if (aToken) {
      getAllAppoinment();
    }
  }, [aToken]);
  return (
    <div className='w-full max-w-6xl m-5'>
          <p className='mb-3 text-lg font-medium'>All Appoinments</p>
          <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
            <div className='hideen sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
                <p>#</p>
                <p>Patient</p>
                <p>Age</p>
                <p>Date & Time</p>
                <p>Doctor</p>
                <p>Fees</p>
                <p>Action</p>
            </div>
               {appoinment.map((data, index) => (
                <div 
                  key={index} 
                  className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
                >
                  <p className='max-sm:hidden'>{index + 1}</p>
                  <div className='flex items-center gap-2'>
                    <img src={data.userData.image} alt="Patient" className='w-8  rounded-full object-cover' />
                    <p>{data.userData.name}</p>
                  </div>
                  <p className='max-sm:hidden'>{calculateAge(data.userData.dob)}</p>
                  <p>{slotDateFormate(data.slotDate)},{data.slotTime}</p>
                  <div className='flex items-center gap-2'>
                    <img src={data.doctorData.image} alt="Patient" className='w-8 bg-gray-200  rounded-full object-cover' />
                    <p>{data.doctorData.namef}</p>
                  </div>
                  <p>${data.amount}</p>
                  {
                     data.cancelled  ? <p className='text-red-400 text-xs font-medium '>Cancelled</p> : data.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p>  :<img onClick={()=>cancelAppoinment(data._id)} className='w-8 cursor-pointer' src={assets.cancel_icon} alt="" />
                  }
                
                </div>
              ))}

          </div>
    </div>
  )
}

export default AllAppoinments
