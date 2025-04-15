import React, { useContext } from 'react'
import AuthContext from '../context/AuthProvider'
import { Navigate, Outlet } from 'react-router-dom'

export default function RequireAuth() {
    const {auth} = useContext(AuthContext)
    console.log(auth);
    
  return (
    auth?.token?<Outlet/> : <Navigate to="/login"/>
  )
}