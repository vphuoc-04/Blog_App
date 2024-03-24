import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import Addpost from '../assets/img/addpost.png'
import Editpost from '../assets/img/editpost.png'

const Sidebar = () => {

  const {currentUser} = useContext(AdminContext);

  return (
    <div className = "sidebar">
      {currentUser ? (
        <div className = "show">
          <Link to = {'/write'} style = {{ textDecoration: "none" }}>
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
      ) : (
        <div className = "hide">

        </div>
      )}
    </div>
  )
}

export default Sidebar