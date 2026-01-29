import React from 'react'
import { assets } from '../../assets/assets'
import {useState,useContext} from 'react'
import{ AdminContext } from '../../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
  const [doctorImg,setDoctorImg] = useState(false)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [experience,setExperience] = useState('1 Year')
  const [fees,setFees] = useState('')
  const [about,setAbout] = useState('')
  const [speciality,setSpeciality] = useState('')
  const [degree,setDegree] = useState('')
  const [address1,setAddress1] = useState('')
  const [address2,setAddress2] = useState('')


  const {backendUrl,aToken} = useContext(AdminContext)

  const onSubmitHandler = async (event)=>{
    event.preventDefault();
      try{
        if(!doctorImg){
          return toast.error("Not selected image")
        } 
        const formData = new FormData()
         formData.append('image',doctorImg)
         formData.append('name',name)
         formData.append('email',email)
         formData.append('password',password)
         formData.append('experience',experience)
         formData.append('fees',Number(fees))
         formData.append('about',about)
         formData.append('speciality',speciality)
         formData.append('degree',degree)
         formData.append('address',JSON.stringify({line1:address1,line2:address2}))
        
        formData.forEach((value,key)=>{
          console.log(`${key} : ${value}`)
        })
        const { data } = await axios.post(
          backendUrl + '/api/admin/add-doctor',
          formData,
          { headers: { aToken } }
        );
        
        if (data.success) {
          toast.success(data.message);
          setDoctorImg(false)
          setName('')
          setPassword('')
          setSpeciality('')
          setEmail('')
          setAddress1('')
          setAddress2('')
          setFees('')
          setAbout('')
          setDegree('')
        } else {
          toast.error(data.message);
        }
      }
      catch(error){
            console.log(error)
            toast.error("Something went wrong");
      }
  }


  return (
    <div className="h-[100vh] flex justify-center">
      <form onSubmit={onSubmitHandler}
        className="w-full max-w-4xl ml-5 mr-5 bg-white rounded border border-[#808080] p-8 space-y-6 h-[100vh] overflow-y-auto"
      >
        <h2 className="text-lg font-medium text-gray-800">Add Doctor</h2>

        <div className="flex items-center gap-4 text-gray-500">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              className="w-16 h-16 bg-gray-100 rounded-full object-cover border border-[#808080]"
              src={doctorImg ? URL.createObjectURL(doctorImg) : assets.upload_area}
              alt="Upload"
            />
          </label>
          <input type="file" id="doc-img" hidden onChange={(e)=>setDoctorImg(e.target.files[0])} />
          <p className="text-sm leading-tight">
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 text-gray-600">
          <div className="flex-1 space-y-4">
            <div>
              <p className="mb-1">Doctor name</p>
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-[#808080] rounded px-3 py-2"
                onChange={(e)=>setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div>
              <p className="mb-1">Doctor email</p>
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-[#808080] rounded px-3 py-2"
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div>
              <p className="mb-1">Doctor password</p>
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-[#808080] rounded px-3 py-2"
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
                autoComplete='off'
                required
              />
            </div>
            <div>
              <p className="mb-1">Experience</p>
              <select className="w-full border border-[#808080] rounded px-3 py-2"   onChange={(e)=>setExperience(e.target.value)}
                value={experience}>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-1">Fees</p>
              <input
                type="number"
                placeholder="Fees"
                className="w-full border border-[#808080] rounded px-3 py-2"
                onChange={(e)=>setFees(e.target.value)}
                value={fees}
                required
              />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <p className="mb-1">Speciality</p>
              <select className="w-full border border-[#808080] rounded px-3 py-2" onChange={(e) => setSpeciality(e.target.value)} value={speciality}>
              <option>Select one speciality</option>
                <option>General physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
              </select>
            </div>
            <div>
              <p className="mb-1">Education</p>
              <input
                type="text"
                placeholder="Education"
                className="w-full border border-[#808080] rounded px-3 py-2"
                onChange={(e)=>setDegree(e.target.value)}
                value={degree}
                required
              />
            </div>
            <div>
              <p className="mb-1">Address</p>
              <input
                type="text"
                placeholder="Address 1"
                className="w-full border border-[#808080] rounded px-3 py-2 mb-2"
                onChange={(e)=>setAddress1(e.target.value)}
                value={address1}
                required
              />
              <input
                type="text"
                placeholder="Address 2"
                className="w-full border border-[#808080] rounded px-3 py-2"
                onChange={(e)=>setAddress2(e.target.value)}
                value={address2}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mb-1">About Doctor</p>
          <textarea 
            onChange={(e)=>setAbout(e.target.value)}
            value={about}
            placeholder="Write about doctor"
            rows={5}
            className="w-full border border-[#808080] rounded px-3 py-2"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition cursor-pointer"
        >
          Add doctor
        </button>
      </form>
    </div>
  )
}

export default AddDoctor
