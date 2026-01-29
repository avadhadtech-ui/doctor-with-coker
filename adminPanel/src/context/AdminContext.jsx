import { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(() => localStorage.getItem('aToken') || '');
  const backendUrl = import.meta.env.VITE_BACKEND_URL; 
  const [doctors, setDoctors] = useState([]);
  const [appoinment,setAppoinment] = useState([])
  const [dashData,setDashData] = useState(false)

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        { headers: { atoken: aToken } } 
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(data.message);
    }
  };
  const changeAvailableStatus = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        { headers: { atoken: aToken } }
      );
  
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  
  const getAllAppoinment = async (req,res)=>{
    try {
      const {data} = await axios.get(backendUrl + '/api/admin/appoinments',{headers:{aToken}})
      if(data.success){
        setAppoinment(data.appoinments)
        console.log("Hey",data.appoinments)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }
  const cancelAppoinment = async (appoinmentId) =>{
    try {
      const {data} = await axios.post(backendUrl + '/api/admin/cancel-appoinment',{appoinmentId},{headers:{aToken}})
      if(data.success){
        getAllAppoinment();
        getDashData(); 
        toast.success(data.message)

      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', {
        headers: { atoken: aToken } 
      });
  
      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message); 
      }
  
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }
  
  const value = {
    aToken,
    setAToken,
    backendUrl,
    getAllDoctors,
    doctors,
    changeAvailableStatus,
    appoinment,setAppoinment, 
    getAllAppoinment,
    cancelAppoinment,
    dashData,getDashData, 
    
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
