import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AdminContext } from '../context/AuthContext'


const Sidebar = () => {

  const {currentUser} = useContext(AdminContext);

  return (
    <div className = "sidebar">
      {currentUser ? (
        <div className = "show">
          <Link to = {'/write'} style = {{ textDecoration: "none" }}>
            <div className = "sidebarItem">
              <i class="fa-solid fa-pen-to-square"></i>
              <p>Đăng Tải Bài Viết</p>
            </div>
          </Link>
          <Link to = {'/listposts'} style = {{ textDecoration: "none" }}>
            <div className = "sidebarItem">
              <i class="fa-solid fa-newspaper"></i>
              <p>Quản Lý Bài Viết</p>
            </div>
          </Link>
          <Link to = {'/users'} style = {{ textDecoration: "none" }}>
            <div className = "sidebarItem">
              <i class="fa-solid fa-user"></i>
              <p>Quản Lý Người Dùng</p>
            </div>
          </Link>
          <Link to = {'/setting'} style = {{ textDecoration: "none" }}>
            <div className = "sidebarItem">
              <i class="fa-solid fa-gear"></i>
              <p>Cài Đặt</p>
            </div>
          </Link>
        </div>
      ) : (
        <div className = "hide">

        </div>
      )}
    </div>
  )
}

export default Sidebar