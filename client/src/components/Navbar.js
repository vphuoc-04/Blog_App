import React, { useContext } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Logo from '../assets/logo/vphuoc.png'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {

  const { currentUser, logout } = useContext(AuthContext);

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
          <span className = "user"> { currentUser?.username } </span>
          {currentUser ? (
            <NavLink className = "logout" onClick = { logout } to = "/">Logout</NavLink>
          ) : (
            <Link className = "login" to = "/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar