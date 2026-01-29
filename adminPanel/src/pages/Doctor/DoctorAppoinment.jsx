import React, { useEffect,useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext.jsx'
import {AppContext} from '../../context/AppContext.jsx'
import {assets} from '../../assets/assets.js'
const DoctorAppoinment = () => {
  const { dToken, appointments, getAppointments, completeAppointment,cancelAppointment} = useContext(DoctorContext)
  

  useEffect(() => {
  
    if (dToken) {
      getAppointments()
    }
  }, [dToken])
  
  const {calculateAge,slotDateFormate} = useContext(AppContext)

  return (
<div className="w-full max-w-6xl m-5">
  <p className="mb-3 text-lg font-medium">ALL PATIENTS</p>

  <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">


    <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b items-center text-gray-500 font-medium">
      <p>#</p>
      <p>Patient</p>
      <p>Payment</p>
      <p>Age</p>
      <p>Date & Time</p>
      <p>Fees</p>
      <p>Actions</p>
    </div>


    {appointments.reverse().map((item, index) => (
      <div
        key={index}
        className="max-sm:flex max-sm:flex-wrap max-sm:justify-between max-sm:gap-5 max-sm:text-base 
                   sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center 
                   text-gray-500 py-3 px-6 border-b hover:bg-gray-100 transition-colors"
      >

        <p className="max-sm:hidden">{index + 1}</p>


        <div className="flex items-center gap-2">
          <img className="w-8 h-8 rounded-full object-cover" src={item.userData.image} alt={item.userData.name} />
          <p>{item.userData.name}</p>
        </div>

        <div className="text-xs inline-border px-2 rounded-full">
          <p>{item.payment ? "ONLINE" : "CASH"}</p>
        </div>


        <p>{calculateAge(item.userData.dob)}</p>

   
        <p>
          {slotDateFormate(item.slotDate)}, {item.slotTime}
        </p>


        <p>${item.amount}</p>
        {
          item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>  : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> :  <div className="flex gap-2">
          <img onClick={()=>cancelAppointment(item._id)} src={assets.cancel_icon} alt="Cancel" className="w-10 cursor-pointer" />
          <img onClick={()=>completeAppointment(item._id)} src={assets.tick_icon} alt="Approve" className="w-10 cursor-pointer" />
        </div>
        }



      </div>
    ))}
  </div>
</div>

  )
}

export default DoctorAppoinment
