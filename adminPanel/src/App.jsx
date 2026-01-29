import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Login from './Login'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'

import Dashboard from './pages/Admin/Dashboard'
import AllAppoinments from './pages/Admin/AllAppoinments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorLists from './pages/Admin/DoctorLists'
import ForgotPassword from './pages/Admin/ForgotPassword'
import Otp from './pages/Admin/OtpVerify.jsx'

import DoctorDashboard from './pages/Doctor/DoctorDashbord'
import DoctorAppoinment from './pages/Doctor/DoctorAppoinment'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import ForgotDoctor from './pages/Doctor/ForgotDoctor.jsx'
import VerifyOtp from './pages/Doctor/OtpVerify.jsx'

import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return (
    <>
      {(aToken || dToken) && (
        <div className='bg-[#F8F9FD]'>
          <Navbar />
          <div className='flex items-start my-own-design'>
            <SideBar />
            <Routes>
            
              <Route path='/' element={<Dashboard />} />
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/all-appoinments' element={<AllAppoinments />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/doctor-lists' element={<DoctorLists />} />

             
              <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
              <Route path='/doctor-appoinments' element={<DoctorAppoinment />} />
              <Route path='/doctor-profile' element={<DoctorProfile />} />
            </Routes>
          </div>
        </div>
      )}

      <Routes>
        
        <Route path='/admin/forgot/password' element={<ForgotPassword />} />
        <Route path='/doctor/forgot/password' element={<ForgotDoctor />} />
        <Route path="/admin/verify-otp" element={<Otp />} />
        <Route path='/doctor/verify-otp' element={<VerifyOtp />} />

      
        {!aToken && !dToken && <Route path='*' element={<Login />} />}
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
