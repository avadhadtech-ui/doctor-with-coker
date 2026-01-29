import React from 'react'
import { useParams, useNavigate } from "react-router";
import {useContext,useState,useEffect} from 'react'
import {AppContext} from '../context/AppContext.jsx'


const Doctor = () => {
  const {speciality} = useParams()
  let [filter,setFilter] = useState([])
  const [showFilter,setShowFilter] = useState(false)
  const {doctors} = useContext(AppContext)

  const filterData = () =>{
    if(speciality){
      setFilter(doctors.filter((doc) => doc.speciality === speciality))
    }else{
            setFilter(doctors)
    }
  }
  const toggling = ()=>{
    setShowFilter(!showFilter)
  }
  useEffect(()=>{
    filterData()
  },[doctors,speciality])
  const navigate = useNavigate()
  return (
    <div>
        <p className='text-[var(--grey)] '>Browse through the doctors specialist.</p>
        <div className='flex flex-col sm:flex-row items-start gap-5 mt-5 '>
          <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-[var(--primary)] text-[var(--white)]" : ''}`} onClick={toggling}>Filters</button>
          <div className={`flex-col gap-4 text-sm text-[var(--grey)] items-center w-[100%] sm:w-[auto] ${showFilter ? 'flex' : 'hidden sm:flex '}`}>
            <p onClick={()=> speciality =="General physician" ? navigate('/doctors') : navigate('/doctors/General physician') } className={`w-[100%] pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer   ${speciality=="General physician" ? "bg-indigo-100 text-[var(--black)]" : ""}`}>General physician</p>
            <p onClick={()=> speciality =="Gynecologist" ? navigate('/doctors') : navigate('/doctors/Gynecologist') } className={`w-[100%] pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${speciality=="Gynecologist" ? "bg-indigo-100 text-[var(--black)]" : ""}`}>Gynecologist</p>
            <p onClick={()=> speciality =="Dermatologist" ? navigate('/doctors') : navigate('/doctors/Dermatologist') } className={`w-[100%] pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${speciality=="Dermatologist" ? "bg-indigo-100 text-[var(--black)]" : ""}`}>Dermatologist</p>
            <p onClick={()=> speciality =="Pediatricians" ? navigate('/doctors') : navigate('/doctors/Pediatricians') } className={`w-[100%] pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${speciality=="Pediatricians" ? "bg-indigo-100 text-[var(--black)]" : ""}`}>Pediatricians</p>
            <p onClick={()=> speciality =="Neurologist" ? navigate('/doctors') : navigate('/doctors/Neurologist') } className={`w-[100%] pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${speciality=="Neurologist" ? "bg-indigo-100 text-[var(--black)]" : ""}`}>Neurologist</p>
            <p onClick={()=> speciality =="Gastroenterologist" ? navigate('/doctors') : navigate('/doctors/Gastroenterologist') } className={`w-[100%] pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${speciality=="Gastroenterologist" ? "bg-indigo-100 text-[var(--black)]" : ""}`}>Gastroenterologist</p>
          </div>
          <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6 px-0 justify-center'>
          {
                    filter.map((data,index)=>(
                                <div onClick={()=>navigate(`/appoinments/${data._id}`)} key={index} className='border border-blue-200 rounded-xl cursor-pointer overflow-hidden hover:translate-y-[-10px] transition-all duration-500 md:w-50 sm:w-80 w-100 '>
                                    <img className='bg-blue-50' src={data.image} alt=''/>
                                    <div className='p-4'>
                                        <div className='flex items-center text-center text-green-500 gap-2 text-sm'>
                                        <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                                        </div>
                                        <p className='text-grey-900 text-lg font-medium'>{data.name}</p>
                                        <p className='text-[var(--grey)] text-sm '>{data.speciality}</p>

                                    </div>
                                </div>
                    ))
                }
          </div>
        </div>
    </div>
  )
}

export default Doctor
