import React from 'react'
import {useContext,useState,useEffect} from 'react'
import {AppContext} from '../context/AppContext.jsx'
import { useNavigate } from "react-router";
import axios from 'axios'
import {toast} from 'react-toastify'
const MyAppoinments = () => {
  const {backendUrl,token,getDoctorsData} = useContext(AppContext)
  const [appoinment,setAppoinment]= useState([])
  let navigate = useNavigate();
  const months = [' ','Jan',"Feb","Mar","Apr","May","Jun","Jul","Aug",'Sep','Oct',"Nov",'Dec']
  const slotDateFormate = (slotDate) =>{
    const dateArr = slotDate.split('_')
    return dateArr[0]+ " " + months[Number(dateArr[1])] + " " + dateArr[2]
  } 
  const getAppoinment = async () =>{
    try {
      const {data} = await axios.get(backendUrl +'/api/user/appoinments',{headers:{token}})
    if(data.success){
      setAppoinment(data.appoinment.reverse())
    }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  const cancelAppoinment = async (appoinmentId) =>{
      try {
        const { data } = await axios.post(
          backendUrl + '/api/user/cancel-appoinment',
          { appoinmentId }, 
          { headers: { token } } 
        );
        
        if(data.success){
              toast.success(data.message)
              getAppoinment();
              getDoctorsData()
        }else{
          toast.error(data.message)
        }
          
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }
  const initPay = (order) =>{
      const options = {
        key: import.meta.env.VITE_RAZOR_PAY_ID,
        amount:order.amount,
        currecny:order.currecny,
        name:'Appoinment Payment',
        description:'Appoinment Payment',
        order_id:order.id,
        receipt:order.receipt,
        handler: async(response)=>{
          console.log(response)
            try {
                const {data} = await axios.post(backendUrl + '/api/user/verifyRazorpay',response,{headers:{token}})
                console.log("Res",response)
                if(data.success){
                  getAppoinment()
                  navigate('/my-appoinments')
                }
            } catch (error) {
              console.log(error)
              toast.error(error.message)
            }
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
  }
  const appoinmentRazorPay = async (appoinmentId) =>{
        try {
          const {data} = await axios.post(backendUrl + '/api/user/payment-razorpay',{appoinmentId},{headers:{token}})
          if(data.success){
            initPay(data.order)
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
  }
  useEffect(()=>{
    if(token){
      getAppoinment()
    }
  },[token])
  return (
    <div>
        <p className='pb-3 font-medium text-zinc-700 mt-12  border-b border-[#D1D1D1]'>My Appoinments</p>
        <div>
          {
              appoinment.slice(0,3).map((data,index)=>(
                <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-[#D1D1D1]' key={data.index}>
                  <div>
                    <img className='w-32 bg-indigo-50' src={data.doctorData.image} alt="" />
                  </div>
                  <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-neutral-800 font-semibold '>{data.doctorData.name}</p>
                    <p>{data.doctorData.speciality}</p>
                    <p className='text-zinc-700 font-medium mt-1'>Address</p>
                    <p className='text-xs'>{data.doctorData.address.line1}</p>
                    <p className='text-xs'>{data.doctorData.address.line2}</p>
                    <p><span className='text-xs mt-1'>Date & Time :</span> {slotDateFormate(data.slotDate)} | {data.slotTime} </p>
                  </div>
                  <div></div>
                  <div className='flex flex-col gap-2 justify-end'>
                  {!data.cancelled && data.payment && !data.isCompleted && <button className='sm:min-w-48 py-2 border rounded  text-stone-500 bg-indigo-50'>Paid</button>}  
                  {!data.cancelled && !data.payment  && !data.isCompleted && <button onClick={()=>appoinmentRazorPay(data._id )} className='text-sm text-[var(--greyBlack)] text-center sm:w-48 py-2 cursor-pointer border border-[#D1D1D1] rounded hover:bg-[var(--primary)] hover:text-[var(--white)] transition-all duration-300'>Pay Online</button>  }
                  {!data.cancelled && !data.isCompleted && <button onClick={()=>cancelAppoinment(data._id)} className='text-sm text-[var(--greyBlack)] text-center sm:w-48 py-2 cursor-pointer border border-[#D1D1D1] rounded hover:bg-red-700 hover:text-[var(--white)] transition-all duration-300'>Cancel appoinment</button>} 
                  {data.cancelled && !data.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appoinment cancelled</button>} 
                  {data.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-600'>Appointment completed</button>}
                  </div>
                </div>
              ))
          }
          </div>
    </div>
  )
}

export default MyAppoinments
