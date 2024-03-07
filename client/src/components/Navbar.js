import React from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../assets/logo/vphuoc.png'

const Navbar = () => {

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
        </div>
      </div>
    </div>
  )
}

export default Navbar