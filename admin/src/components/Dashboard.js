import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './Sidebar'
import Post from '../components/Post'
import Allpost from './Allpost'

const Dashboard = () => {
  return (
    <div className = "dashboard">
        <Sidebar />
        <Routes>
          <Route path = "/write" element = { <Post /> } />
          <Route path = "/allpost" element = { <Allpost /> } />
        </Routes>
    </div>
  )
}

export default Dashboard