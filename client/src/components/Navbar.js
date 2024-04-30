import React, { useContext } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo/vphuoc.png'
import Avatar from '../assets/img/aboutMe.png'
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
          {currentUser ? (
            <details className = "user">
              <summary className = "avatar">
                <img src = { Avatar } />
              </summary>
              <div className = "menu">
                <span>{currentUser?.username}</span>
                <NavLink className = "button" to = "/setting"><i class="fa-solid fa-user"></i></NavLink>
                <NavLink className = "button" onClick = { logout } to = "/"><i class="fa-solid fa-right-from-bracket"></i></NavLink>
              </div>
            </details>
          ) : (
            <Link className = "login" to = "/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar