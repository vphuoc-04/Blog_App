import React from 'react'
import { Link } from 'react-router-dom'
import Addpost from '../assets/img/addpost.png'
import Editpost from '../assets/img/editpost.png'

const Sidebar = () => {
  return (
    <div className = "sidebar">
      <Link to = {'/post'} style = {{ textDecoration: "none" }}>
        <div className = "sidebarItem">
        <img src = { Addpost } alt ="" />
          <p>Đăng Tải Bài Viết</p>
        </div>
      </Link>
      <Link to = {'/listpost'} style = {{ textDecoration: "none" }}>
        <div className = "sidebarItem">
          <img src = { Editpost } alt ="" />
          <p>Quản Lý Bài Viết</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar