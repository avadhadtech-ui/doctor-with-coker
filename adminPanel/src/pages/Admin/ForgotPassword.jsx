import React from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      email: ""
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(`${backendUrl}/admin/forget/password`, {
          email: values.email
        })

        if (response.data.success) {
          toast.success(`OTP has been sent to ${values.email}`)
          sessionStorage.setItem('email', values.email) 
          navigate('/admin/verify-otp')
          resetForm()
        } else {
          toast.error(response.data.message || "Email not found")
        }

      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || "Something went wrong.")
      }
    }
  })

  return (
    <div className='h-screen flex justify-center items-center'>
 <form onSubmit={handleSubmit} className='max-h-auto flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[270px] sm:w-96 border rounded-xl text-[var(--greyBlack)] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>Forgot Password</p>
        <p>Enter your email to receive password reset instructions</p>

        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type='email'
            name='email'
            onChange={handleChange}
            value={values.email}
            required
          />
        </div>

        <button
          type="submit"
          className='bg-[var(--primary)] cursor-pointer text-[var(--white)] w-full py-2 rounded-md text-base'
        >
          Send OTP
        </button>

        <p className='text-sm'>
          Remembered your password?{' '}
          <span
            onClick={() => navigate('/login')}
            className='text-[var(--primary)] underline cursor-pointer'
          >
            Login here
          </span>
        </p>
      </div>
    </form>
    </div>
   
  )
}

export default ForgotPassword
