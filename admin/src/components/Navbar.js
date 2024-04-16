import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../assets/logo/vphuoc.png'
import Profile from '../assets/img/profile.png'

const Navbar = () => {

  const { currentUser, logoutAdmin } = useContext(AdminContext);

  return (
    <div className = "navbar">
      <a className = "logo" href = "/">
        <img src = { Logo } alt = "" />
      </a>
      <div className = "profile">
        {currentUser ? (
          <span className = "user">
              <div className = "avatar">
                <img src = { Profile } />
              </div>
              <NavLink className = "logout" onClick = { logoutAdmin } to = "/">Logout</NavLink>
            </span>
        ) : (
          <Link className = "login" to = "/login">Login</Link>
        )}
      </div>
    </div>
  )
}

export default Navbar