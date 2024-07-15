import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './Sidebar'
import Post from '../components/Post'
import ListPosts from './ListPosts'
import User from './User'
import ProfileAdmin from './ProfileAdmin'

const Dashboard = () => {
  return (
    <div className = "dashboard">
      <Sidebar />
        <div className = "routes">
          <Routes>
            <Route path = "/write" element = { <Post /> } />
            <Route path = "/listposts" element = { <ListPosts /> } />
            <Route path = "/users" element = { <User /> } />
            <Route path = "/setting" element = { <ProfileAdmin /> } />
          </Routes>
        </div>
    </div>
  )
}

export default Dashboard