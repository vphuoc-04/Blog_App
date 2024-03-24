import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './Sidebar'
import Post from '../components/Post'
import Listpost from './Listpost'

const Dashboard = () => {
  return (
    <div className = "dashboard">
        <Sidebar />
        <Routes>
          <Route path = "//write" element = { <Post /> } />
          <Route path = "/listpost" element = { <Listpost /> } />
        </Routes>
    </div>
  )
}

export default Dashboard