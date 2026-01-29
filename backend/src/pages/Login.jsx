import React, { useState, useContext,useEffect } from 'react'
import { useFormik } from 'formik'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'


const Login = () => {
  const [state, setState] = useState('Sign-up')
  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)


  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      names: '',
      password: '',
      email: '',
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (state === 'Sign-up') {
          const { data } = await axios.post(backendUrl + '/api/user/register', {
            name: values.names,
            password: values.password,
            email: values.email
          })
          if (data.success) {
            localStorage.setItem('token', data.token)
            setToken(data.token)
          } else {
            toast.error(data.message)
          }
        } else {
          const { data } = await axios.post(backendUrl + '/api/user/login', {
            password: values.password,
            email: values.email
          })
          if (data.success) {
            localStorage.setItem('dToken', data.token)
            setToken(data.token)
          } else {
            toast.error(data.message)
          }
        }
      } catch (error) {
        toast.error(error.message)
      }
      resetForm()
    }
  })
  const navigateToForget = ()  =>{
      navigate('/forgot/password')
  }

  useEffect(()=>{
      if(token){
          navigate('/')
      }
  },[token])
  return (
    <form onSubmit={handleSubmit} className='max-h-auto flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[270px] sm:w-96 border rounded-xl text-[var(--greyBlack)] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign-up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign-up' ? 'sign up' : 'login'} to book appointment</p>

        {state === 'Sign-up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" name='names' onChange={handleChange} value={values.names} />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='email' name='email' onChange={handleChange} value={values.email} />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='password' name='password' onChange={handleChange} value={values.password} />
        </div>
        {
            state === "Sign-up" ? "": <p onClick={()=>navigateToForget()} className='text-[var(--primary)] cursor-pointer'>Forget password ?</p> 
          }

        <button type="submit" className='bg-[var(--primary)] text-[var(--white)] w-full py-2 rounded-md text-base'>
          {state === 'Sign-up' ? 'Create Account' : 'Login'}
        </button>

        {state === 'Sign-up'
          ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-[var(--primary)] underline cursor-pointer'>Login here</span></p>
          : <p>Create a new account? <span onClick={() => setState('Sign-up')} className='text-[var(--primary)] underline cursor-pointer'>Click here</span></p>}

      </div>
    </form>
  )
}

export default Login
