import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './pages/Dashboard'
import CreateAccount from './components/CreateAccount'
import RequireAuth from './utils/RequireAuth'
import SearchAccount from './components/SearchAccount'
import SortedList from './components/SortedList'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
import FundTransfer from './components/FundTransfer'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route index path="/" element={<Home />} />
          <Route index path="/login" element={<Login />} />
          <Route index path="/signup" element={<Signup />} />

          {/* Private Routes */}
          <Route element={<RequireAuth />}>
            <Route index path="/dashboard" element={<Dashboard />} />
            <Route index path="/create-account" element={<CreateAccount />} />
            <Route index path="/search-account" element={<SearchAccount />} />
            <Route index path="/sorted-list" element={<SortedList />} />
            <Route index path='/deposit' element={<Deposit />} />
            <Route index path='/withdraw' element={<Withdraw />} />
            <Route index path='/fund-transfer' element={<FundTransfer/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
