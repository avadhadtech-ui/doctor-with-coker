import React, { useState,useContext } from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import {AppContext} from '../context/AppContext'
import '../root.css';

const Navbar = () => {
  const navigate = useNavigate(); 
  const [showMenu, setShowMenu] = useState(false);
  const {token,setToken,userData} = useContext(AppContext)

  const logOut = () =>{
    setToken(false)
    localStorage.removeItem('token')
  } 

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-grey-400 px-4 lg:px-10'>
      <img
        onClick={() => { navigate('/'); scrollTo(0, 0); }}
        src={assets.logo}
        alt="Logo"
        className='w-40 sm:w-44 cursor-pointer'
      />

      <ul className='hidden lg:flex items-center gap-6 font-medium text-[var(--greyBlack)]'>
        <NavLink to='/' className={({ isActive }) => isActive ? 'text-[var(--primary)]' : ''}>
          <li className='py-1'>HOME</li>
        </NavLink>
        <NavLink to='/doctors' className={({ isActive }) => isActive ? 'text-[var(--primary)]' : ''}>
          <li className='py-1'>ALL DOCTORS</li>
        </NavLink>
        <NavLink to='/about' className={({ isActive }) => isActive ? 'text-[var(--primary)]' : ''}>
          <li className='py-1'>ABOUT</li>
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => isActive ? 'text-[var(--primary)]' : ''}>
          <li className='py-1'>CONTACT</li>
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {token && userData ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img src={userData.image} className='w-12 h-12 rounded-full' alt="profile" />
            <img src={assets.dropdown_icon} className='w-2.5' alt="dropdown" />

            <div className='absolute top-0 right-0 pt-14 text-base font-medium z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 text-grey-600 rounded flex flex-col gap-4 p-4'>
                <p onClick={() => navigate('/my-profile')} className='cursor-pointer hover:text-[var(--black)]'>My Profile</p>
                <p onClick={() => navigate('/my-appoinments')} className='cursor-pointer hover:text-[var(--black)]'>My Appointments</p>
                <p onClick={logOut} className='cursor-pointer hover:text-[var(--black)]'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-[var(--primary)] text-white px-6 py-2 rounded-full font-light hidden lg:block'
          >
            Create Account
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className='w-6 lg:hidden cursor-pointer'
          src={assets.menu_icon}
          alt="menu"
        />

        <div className={`lg:hidden fixed top-0 right-0 bottom-0 bg-white z-50 transition-all duration-300 ease-in-out ${showMenu ? 'w-full' : 'w-0 overflow-hidden'}`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="Logo" />
            <img className='w-6 cursor-pointer' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" />
          </div>
          <ul className='flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to="/"><p className='px-4 py-2 rounded'>Home</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors"><p className='px-4 py-2 rounded'>All Doctors</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about"><p className='px-4 py-2 rounded'>About</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact"><p className='px-4 py-2 rounded'>Contact</p></NavLink>
            {!token && (
              <button
                onClick={() => { navigate('/login'); setShowMenu(false); }}
                className='mt-4 bg-[var(--primary)] text-white px-6 py-2 rounded-full'
              >
                Create Account
              </button>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
