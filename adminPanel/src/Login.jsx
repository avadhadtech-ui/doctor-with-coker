import React from 'react'
import {useState,useContext} from 'react'
import {assets} from './assets/assets.js'
import {AdminContext} from './context/AdminContext.jsx'
import {DoctorContext} from './context/DoctorContext.jsx'
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
const Login = () => {
    const [state,setState] = useState('Admin')
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('')
    const {setAToken,backendUrl} = useContext(AdminContext) 
    const {setDToken}= useContext(DoctorContext)
    const navigate = useNavigate()
    
    const onSubmitHandler = async (event) => {
        event.preventDefault();
    
        try {
            if (state === "Admin") {
                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
                if (data.success) {
                    localStorage.setItem('aToken', data.token);
                    setAToken(data.token);
                    toast.success("Login successful!");
                } else {
                    toast.error(data.message || "Something went wrong.");
                    console.error("Login failed:", data.message);
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password });
                if (data.success) {
                    localStorage.setItem('dToken', data.token);
                    setDToken(data.token);
                    toast.success("Login successful!");
                    navigate('/doctor-dashboard')
                    console.log(data.token);
                } else {
                    toast.error(data.message || "Something went wrong.");
                    console.error("Login failed:", data.message);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
            console.error("Error is : ", error);
        }
    }
    

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-[#808080] rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
            <p className='text-2xl font-semibold m-auto'><span className='text-[var(--primary)]'>{state ==="Admin" ? <span>Admin</span> : <span>Doctor</span>}</span> Login</p>
            <div className='w-full'>
                <p>Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required/>
            </div>
            <div className='w-full'>
                <p>Password</p>
                <input type='password' onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1'  autoComplete='off' required  />
              {
                state ==="Admin" ?   <p className='mt-1 text-[var(--primary)] cursor-pointer' onClick={()=>navigate('/admin/forgot/password')}>Forgot Password ?</p> :   <p className='mt-1 text-[var(--primary)] cursor-pointer' onClick={()=>navigate('/doctor/forgot/password')}>Forgot Password ?</p>
              }
            </div>
            <button className='bg-[var(--primary)] text-white w-full py-2 rounded-md text-base cursor-pointer'>Login</button>

                {
                    state === "Admin" ? <p>Doctor Login <span className='cursor-pointer underline text-[var(--primary)]' onClick={()=>setState('Doctor')}>Click here </span> </p> : <p>Admin Login <span className='cursor-pointer underline text-[var(--primary)]' onClick={()=>setState('Admin')}>Click here </span> </p>
                }

        </div>
    </form>
  )
}

export default Login
