import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { AppContext } from '../context/AppContext';
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
import  axios from 'axios'

const Appoinments = () => {
  const { docId } = useParams();
  const { doctors,backendUrl,token,getDoctorsData } = useContext(AppContext);
  const [doctor, setDoctor] = useState({});
  const navigate = useNavigate()

  let Days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [doctorsSlot, setDoctorsSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const getAvailableSlot = async () => {
    setDoctorsSlot([]);
    let todayDate = new Date();
  
    const slotsBooked = doctor.slotsBooked || {}; // booked slots from doctor
  
    for (let i = 0; i < 7; i++) {
      let curentDate = new Date(todayDate);
      curentDate.setDate(todayDate.getDate() + i);
  
      let endTime = new Date(curentDate);
      endTime.setHours(21, 0, 0, 0);
  
      if (todayDate.getDate() === curentDate.getDate()) {
        curentDate.setHours(curentDate.getHours() > 10 ? curentDate.getHours() + 1 : 10);
        curentDate.setMinutes(curentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        curentDate.setHours(10);
        curentDate.setMinutes(0);
      }
  
      let timeSlot = [];
  
      while (curentDate < endTime) {
        let formattedTime = curentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
        // Format date as in your backend
        let day = curentDate.getDate();
        let month = curentDate.getMonth() + 1;
        let year = curentDate.getFullYear();
        const slotDateKey = `${day}_${month}_${year}`;
  
        if (!slotsBooked[slotDateKey] || !slotsBooked[slotDateKey].includes(formattedTime)) {
          timeSlot.push({
            dateTime: new Date(curentDate),
            time: formattedTime,
          });
        }
  
        curentDate.setMinutes(curentDate.getMinutes() + 30);
      }
  
      if (timeSlot.length > 0) setDoctorsSlot(prev => [...prev, timeSlot]);
    }
  };
  
  

  useEffect(() => {
    if (docId && doctors.length) {
      const findAppo = doctors.find((doc) => doc._id === docId);
      if (findAppo) setDoctor(findAppo);
    }
  }, [docId, doctors]);

  useEffect(() => {
    if (doctor?._id) getAvailableSlot();
  }, [doctor]);

  const bookAppoinemnt = async() =>{
    if(!token){
          toast.warn('Login to book appoinment')
          return  navigate('/login')
    }
    try {
        let date = doctorsSlot[slotIndex][0].dateTime
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear()

        const slotDate = day + '_' + month + "_" + year
        const {data} = await axios.post(backendUrl + '/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{ token}})
        if (data.success) {
          toast.success(data.message);
          getDoctorsData();
          navigate('/my-appoinments');
        }
        else{
              
              toast.error(data.message)
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-[var(--primary)] w-full sm:max-w-72 rounded-lg"
            src={doctor?.image}
            alt={doctor?.name || 'Doctor'}
          />
        </div>

        <div className="flex-1 border border-[var(--grey)] rounded-lg p-8 py-7 bg-[var(--white)] mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-[var(--black)]">
            {doctor?.name}{' '}
            <img className="w-5" src={assets.verified_icon} alt="verified" />
          </p>

          <div className="flex items-center gap-2 text-sm mt-1 text-[var(--grey)]">
            <p>
              {doctor?.degree} - {doctor?.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {doctor?.experience}
            </button>
          </div>

          <div>
            <p className="flex items-center gap-1 font-medium text-[var(--grey)] mt-3 text-sm">
              About <img className="w-3" src={assets.info_icon} alt="info" />
            </p>
            <p className="text-sm text-[var(--grey)] max-w-[700] mt-1">
              {doctor?.about}
            </p>
          </div>

          <p className="text-[var(--grey)] font-medium mt-4">
            Appointment fee:{' '}
            <span className="text-black">${doctor?.fees}</span>
          </p>
        </div>
      </div>

      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[var(--grey)]">
        <p className="text-black">Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-scroll mt-4">
          {doctorsSlot.length > 0 &&
            doctorsSlot.map((data, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? 'bg-[var(--primary)] text-[var(--white)]'
                    : 'border border-grey-200'
                }`}
                key={index}
              >
                <p>{data[0] && Days[data[0].dateTime.getDay()]}</p>
                <p>{data[0] && data[0].dateTime.getDate()}</p>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-3 w-ful overflow-x-scroll mt-4">
          {doctorsSlot.length > 0 &&
            doctorsSlot[slotIndex]?.map((data, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(data.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  data.time === slotTime
                    ? 'bg-[var(--primary)] text-[var(--white)]'
                    : 'border border-[var(--grey)]'
                }`}
              >
                {data.time.toLowerCase()}
              </p>
            ))}
        </div>

        <button onClick={bookAppoinemnt} className="bg-[var(--primary)] text-[var(--white)] text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer">
          Book an appointment
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={doctor?.speciality} />
    </div>
  );
};

export default Appoinments;
