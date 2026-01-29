import {createContext,useState,useEffect} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props)=>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors,setDoctors] = useState([])
    const [token,setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'):false)
    const [userData,setUserData] = useState(false);


    const getDoctorsData = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/list')
            console.log("API URL:", backendUrl + '/api/doctor/list'); 
                if(data.success){
                    setDoctors(data.doctors)
                }else{
                    toast.error(data.message)
                }
        } catch (error) {
                console.log(error)
                toast.error(error.message)
        }
    }
    const loadUserProfileDataFromApi = async (req,res) =>{
            try {
                const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
                console.log(data)
                if(data.success){
                    console.log("USER DATA FROM API:", data.userData)
                    setUserData(data.userData)
                }else{
                    toast.error(data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
    }
    useEffect(()=>{
            getDoctorsData()
    },[])
    useEffect(()=>{
            if(token){
                loadUserProfileDataFromApi()
            }else{
                    setUserData(false)
            }
    },[token])
    const value = {
        doctors,getDoctorsData,
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadUserProfileDataFromApi,
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider