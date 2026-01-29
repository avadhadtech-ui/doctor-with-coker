import { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(() => localStorage.getItem('dToken') || '');
    const [appointments, setAppointments] = useState([]);
    const [dashData,setDashData] = useState([])
    const [profileData,setProfileData]= useState(false)
    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: {
                    dtoken: dToken, 
                },
            });


            if (data.success) {
                setAppointments(data.appointments); 
            } else {
                toast.error(data.message || 'Failed to fetch appointments');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Something went wrong');
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/complete-appointment`,
                { appoinmentId: appointmentId },
                {
                    headers: { dtoken: dToken },
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancel-appointment`,
                { appoinmentId: appointmentId },
                {
                    headers: { dtoken: dToken },
                }
            );

            if (data.success) {
                toast.success(data.message);
                getAppointments(); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const getDashData = async () =>{
                try {
                    const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
                        headers: { dtoken: dToken }
                      });
                    console.log(data.dashData)
                    if(data.success){
                        setDashData(data.dashData)
                      
                    }else{
                        toast.error(data.message)
                    }
                } catch (error) {
                    console.error(error);
                    toast.error(error.message);
                }
    }
    const getProfile = async () =>{
        try {
            const response = await axios.get(`${backendUrl}/api/doctor/profile`, {
                headers: { dtoken: dToken }
              });
              if(response.data.success){
                setProfileData(response.data.data)

              }
        } catch (error) {
            
        }
    }

    const value = {
        dToken,
        setDToken,
        backendUrl,
        appointments,
        setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,setDashData,
        getDashData,
        profileData,setProfileData,
        getProfile,
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
