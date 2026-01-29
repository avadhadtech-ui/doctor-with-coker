import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FetchOtp = () => {
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const emailSession = sessionStorage.getItem('email');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;



  const otpFormik = useFormik({
    initialValues: {
      otp: ['', '', '', '', '', ''],
    },
    onSubmit: async (values) => {
      const otpString = values.otp.join('');
      try {
        const response = await axios.post(`${backendUrl}/user/fetch/otp`, {
          email: emailSession,
          otp: otpString,
        });
        if (response.data.success) {
          toast.success(response.data.message || 'OTP verified successfully!');
          setShowReset(true);
        } else {
          toast.error(response.data.message || 'Invalid OTP');
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to verify OTP');
      }
    },
  });

  const resetFormik = useFormik({
    initialValues: {
      password: '',
      cpassword: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.put(`${backendUrl}/user/reset/password`, {
          email: emailSession,
          password: values.password,
          cpassword: values.cpassword,
        });
        if (response.data.success) {
          toast.success(response.data.message);
          sessionStorage.removeItem('email');
          navigate('/login');
        } else {
          toast.error(response.data.message || 'Failed to reset password');
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to reset password');
      }
    },
  });

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpFormik.values.otp];
    newOtp[index] = value.slice(-1);
    otpFormik.setFieldValue('otp', newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpFormik.values.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const digits = pastedData.split('');
    const newOtp = [...otpFormik.values.otp];
    digits.forEach((digit, idx) => {
      if (idx < 6) newOtp[idx] = digit;
    });
    otpFormik.setFieldValue('otp', newOtp);
    inputRefs.current[Math.min(digits.length - 1, 5)]?.focus();
  };

  const handleResend = async () => {
    otpFormik.setFieldValue('otp', ['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    try {
      const response = await axios.post(`${backendUrl}/user/forget/password`, {
        email: emailSession,
      });
      if (response.data.success) {
        toast.success('OTP resent successfully!');
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const isOtpComplete = otpFormik.values.otp.every((val) => val !== '');

  return (
    <>
      {showReset ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8 md:p-10 border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#5f6fff] bg-opacity-10 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#5f6fff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Reset Password</h2>
              <p className="text-gray-600 text-sm sm:text-base">Enter your new password</p>
            </div>
            <form onSubmit={resetFormik.handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={resetFormik.values.password}
                  onChange={resetFormik.handleChange}
                  placeholder="Enter new password"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-[#5f6fff] focus:outline-none transition-all text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="cpassword"
                  value={resetFormik.values.cpassword}
                  onChange={resetFormik.handleChange}
                  placeholder="Confirm new password"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-[#5f6fff] focus:outline-none transition-all text-sm sm:text-base"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={resetFormik.isSubmitting}
                className="w-full bg-[#5f6fff] text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-[#4a5ee6] transition-all disabled:bg-gray-300 shadow-lg shadow-[#5f6fff]/20 text-sm sm:text-base"
              >
                {resetFormik.isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
            <div className="mt-6 sm:mt-8 text-center border-t border-gray-100 pt-4 sm:pt-6">
              <p className="text-gray-600 text-sm font-medium">Prescripto</p>
              <p className="text-gray-500 text-xs mt-1">Your Health, Our Priority</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="bg-[#5f6fff] text-white text-center p-6 sm:p-8 md:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Verify OTP</h2>
              <p className="text-xs sm:text-sm text-white text-opacity-90">Code sent to</p>
              <p className="text-xs sm:text-sm font-semibold mt-1">{emailSession}</p>
            </div>
            <div className="p-6 sm:p-8 md:p-10">
              <form onSubmit={otpFormik.handleSubmit}>
                <div className="flex gap-2 sm:gap-3 justify-center mb-6 sm:mb-8" onPaste={handlePaste}>
                  {otpFormik.values.otp.map((val, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl outline-none transition-all ${
                        val
                          ? 'border-[#5f6fff] bg-[#5f6fff] bg-opacity-10 text-[#5f6fff]'
                          : 'border-gray-300 bg-white hover:border-[#5f6fff] hover:border-opacity-50'
                      } focus:border-[#5f6fff]`}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={!isOtpComplete || otpFormik.isSubmitting}
                  className={`w-full py-3 sm:py-4 rounded-xl text-white font-semibold transition-all mb-4 sm:mb-6 text-sm sm:text-base ${
                    !isOtpComplete || otpFormik.isSubmitting
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[#5f6fff] hover:bg-[#4a5ee6] shadow-lg shadow-[#5f6fff]/20'
                  }`}
                >
                  {otpFormik.isSubmitting ? 'Verifying...' : 'Verify OTP'}
                </button>
                <div className="text-center">
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#5f6fff] font-semibold text-xs sm:text-sm hover:underline transition-all hover:text-[#4a5ee6]"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-gray-50 p-4 sm:p-6 text-center border-t border-gray-100">
              <p className="text-gray-700 text-sm font-semibold">Prescripto</p>
              <p className="text-gray-500 text-xs mt-1">Your Health, Our Priority</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FetchOtp;