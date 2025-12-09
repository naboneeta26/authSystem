import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerification from './pages/EmailVerification'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/emailVerify' element={<EmailVerification />} />
        <Route path='/resetPassword' element={<ResetPassword />} />
      </Routes>
    </div>
  )
}

export default App