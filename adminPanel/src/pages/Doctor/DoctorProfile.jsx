import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfile } = useContext(DoctorContext);
  const { backendUrl } = useContext(AdminContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('fees', profileData.fees);
      formData.append('address[line1]', profileData.address.line1?.trim() || '');
      formData.append('address[line2]', profileData.address.line2?.trim() || '');
      formData.append('available', profileData.available);
      formData.append('experience', profileData.experience);
      if (imageFile) formData.append('image', imageFile);

      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, formData, {
        headers: { dtoken: dToken, 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success('Profile updated');
        setIsEdit(false);
        setImageFile(null);
        getProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Update failed');
      console.error(error);
    }
  };

  const deleteProfile = async () => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/doctor/delete-profile`,  {
        headers: { dtoken: dToken},
      });
      
      if (data.success) {
        toast.success('Profile deleted');
        setProfileData(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Delete failed');
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfileData((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (dToken) getProfile();
  }, [dToken]);

  return profileData ? (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          
          <div className="px-6 pb-6">
        
            <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                  <img
                    className="w-full h-full object-cover"
                    src={profileData.image}
                    alt={profileData.name}
                  />
                </div>
                {isEdit && (
                  <label className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 p-2.5 rounded-full cursor-pointer shadow-lg transition-all">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" name='image' accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-gray-600 font-medium">{profileData.degree}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-600 font-medium">{profileData.speciality}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                {isEdit ? (
                  <>
                    <button
                      onClick={updateProfile}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEdit(false)}
                      className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEdit(true)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md"
                    >
                      Delete Profile
                    </button>
                  </>
                )}
              </div>
            </div>

           
            <div className="grid md:grid-cols-2 gap-6 mt-8">
    
              <div className="md:col-span-2 bg-gray-50 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{profileData.about}</p>
              </div>

    
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Experience</h2>
                {isEdit ? (
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                    value={profileData.experience}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, experience: e.target.value }))}
                    placeholder="e.g 5 years"
                  />
                ) : (
                  <p className="text-2xl font-bold text-blue-600">{profileData.experience}</p>
                )}
              </div>


              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Consultation Fee</h2>
                {isEdit ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900 mr-2">$</span>
                    <input
                      type="number"
                      className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                      value={profileData.fees}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, fees: e.target.value }))}
                    />
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-green-600">${profileData.fees}</p>
                )}
              </div>




              <div className="md:col-span-2 bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Availability Status</h2>
                    <p className="text-sm text-gray-600">Toggle your availability for appointments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.available}
                      onChange={() =>
                        isEdit &&
                        setProfileData((prev) => ({ ...prev, available: !prev.available }))
                      }
                      className="sr-only peer"
                      disabled={!isEdit}
                    />
                    <div className={`w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 ${!isEdit && 'opacity-60 cursor-not-allowed'}`}></div>
                    <span className={`ml-3 text-sm font-medium ${profileData.available ? 'text-green-600' : 'text-gray-500'}`}>
                      {profileData.available ? 'Available' : 'Unavailable'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Profile</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete your profile? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  deleteProfile();
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default DoctorProfile;

