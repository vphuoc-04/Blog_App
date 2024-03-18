import React from 'react'
import Logo from '../assets/logo/vphuoc.png'
import Profile from '../assets/img/profile.png'

const Navbar = () => {
  return (
    <div className = "navbar">
      <a className = "logo" href = "/">
        <img src = { Logo } alt = "" />
      </a>
      <div className = "profile">
        <img src = { Profile } alt = "" />
      </div>
    </div>
  )
}

export default Navbar