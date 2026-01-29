import React from 'react'
import {useContext,useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {AppContext} from '../context/AppContext.jsx'
const RelatedDoctors = ({docId,speciality}) => {
    const {doctors} = useContext(AppContext)
    let [relDoc,setRelDoc] = useState([])
    const navigate = useNavigate()
    useEffect(()=>{
            if(doctors.length>0 && speciality){
                    const doctorData = doctors.filter((doc)=>doc.speciality === speciality && doc._id !== docId)
                    setRelDoc(doctorData)
            }
    },[doctors,docId,speciality])

  return (
    <div>
       <div className='flex flex-col items-center gap-4 my-10 text-grey-900 md:mx-5'>
            <h1 className='text-3xl font-medium'>Related Doctors</h1>
            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6 px-0 justify-start'>
                {
                    relDoc.slice(0,5).map((data)=>(
                                <div onClick={()=>{navigate(`/appoinments/${data._id}`);scrollTo(0,0)  }} key={data._id} className='border border-blue-200 rounded-xl cursor-pointer overflow-hidden hover:translate-y-[-10px] transition-all duration-500 lg:w-50 sm:w-60 w-100 '>
                                    <img className='bg-blue-50' src={data.image} alt=''/>
                                    <div className='p-4'>
                                    <div className={`flex items-center text-center  ${data.available ? "text-green-500" : 'text-red-500'}  gap-2 text-sm`}>
                                    <p className={`w-2 h-2 ${data.available ? 'bg-green-500' : 'bg-red-500'}  rounded-full `}></p><p>{data.available ? 'Available' :"Not Available"}</p>
                                        </div>
                                        <p className='text-grey-900 text-lg font-medium'>{data.name}</p>
                                        <p className='text-[var(--grey)] text-sm '>{data.speciality}</p>

                                    </div>
                                </div>
                    ))
                }
            </div>
            {/* <button onClick={()=>{navigate('/doctors');scrollTo(0,0)}} className='bg-blue-50 text-[var(--grey)] px-12 py-3 rounded-full mt-10'>more</button> */}
    </div>
    </div>
  )
}

export default RelatedDoctors
