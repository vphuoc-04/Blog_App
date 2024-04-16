import React, { useContext } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo/vphuoc.png'
import Avatar from '../assets/img/aboutMe.png'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {

  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const userSetting = () => {
    navigate("/setting");
  }

  return (
    <div className = "navbar">
      <div className = "container">
        <a className = "logo" href = "/">
          <img src = { Logo } alt = ""/>
        </a>
        <div className = "links">
          <NavLink exact = { true } className = "links" activeNav = "active" to = "/">Trang Chủ</NavLink> 
          <NavLink exact = { true } className = "links" activeNav = "active" to = "/about">Tác Giả</NavLink>
          <NavLink exact = { true } className = "links" activeNav = "active" to = "/contact">Kết Nối</NavLink>
          {currentUser ? (
            <span className = "user">
              <div className = "avatar">
                <img src = { Avatar } onClick = { userSetting }/>
              </div>
              <NavLink className = "logout" onClick = { logout } to = "/">Logout</NavLink>
            </span>
          ) : (
            <Link className = "login" to = "/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar