import React from 'react'
import './App.css'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Doctor from './pages/Doctor.jsx'
import Login from './pages/Login.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import MyProFile from './pages/MyProFile.jsx'
import MyAppoinments from './pages/MyAppoinments.jsx'
import Appoinments from './pages/Appoinments.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { ToastContainer, toast } from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword.jsx'
import Otp from './pages/FetchOtp.jsx'
import PageNotFound from './pages/PageNotFound.jsx'
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
     <Navbar />
          <Routes>
               <Route path='/' element={<Home />}/>
               <Route path='/doctors' element={<Doctor />}/>
               <Route path='/doctors/:speciality' element={<Doctor />}/>
               <Route path='/login' element={<Login />}/>
               <Route path='/about' element={<About />}/>
               <Route path='/contact' element={<Contact />}/>
               <Route path='/my-profile' element={<MyProFile />}/>
               <Route path='/my-appoinments' element={<MyAppoinments />}/>
               <Route path='/appoinments/:docId' element={<Appoinments />} />
               <Route path='/forgot/password' element={<ForgotPassword />} />
               <Route path="/otp" element={<Otp />} />
               <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />

    </div >
  )
}

export default App



