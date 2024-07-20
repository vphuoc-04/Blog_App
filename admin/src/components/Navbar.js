import React, { useContext } from 'react'
import { AdminContext } from '../context/AuthContext'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../assets/logo/vphuoc.png'

const Navbar = () => {
  const { currentUser, logoutAdmin } = useContext(AdminContext);
  return (
    <div className = "navbar">
      <div className = "container">
        <a className = "logo" href = "/">
          <img src = { Logo } alt = "" />
        </a>
        <div className = "profile">
          {currentUser ? (
            <details className = "user">
              <summary className = "avatar">
                <img src = { `../image/${currentUser.img}` } alt = '' />
              </summary>
              <div className = "menu">
                <span>{currentUser?.username}</span>
                <NavLink className = "button" onClick = { logoutAdmin } to = "/"><i class="fa-solid fa-right-from-bracket"></i></NavLink>
              </div>
            </details>
          ) : (
            <Link className = "button" to = "/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar