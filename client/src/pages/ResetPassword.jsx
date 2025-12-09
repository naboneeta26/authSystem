import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const[email,setEmail]=useState("")

  console.log(email);
  
  

  const navigate = useNavigate()

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
    
          <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

          <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 test-sm'>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
            <p className='text-center mb-6 text-indigo-300'>Enter your registered email id!</p>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.mail_icon} alt="" className='w-3 h-3' />
              <input type="email"  value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
          </form>
    </div>
  )
}

export default ResetPassword