import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorLists = () => {
  const { doctors, aToken, getAllDoctors,changeAvailableStatus } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='font-medium text-lg'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-indigo-100 rounded-xl max-w-50 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-indigo-50 group-hover:bg-[var(--primary)] transition-all duration-500' src={item.image} alt={`Doctor ${index}`} />
            <div className='p-4'>
              <p className='text-neutral-800 text-lg font-medium '>{item.name}</p>
              <p className='text-zinc-600 text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={()=>changeAvailableStatus(item._id)} type="checkbox" name="" checked={item.available } id="" />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorLists;
