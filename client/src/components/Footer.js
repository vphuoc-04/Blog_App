import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = () => {

  return (
    <footer>
      <h3>Copyright © Văn Phước</h3>
      <h3>Thanks for visiting, if you need assistance 
        <NavLink to = "/contact">
          <button>
            <i class = "fa-regular fa-paper-plane"></i>
          </button>
        </NavLink>
      </h3>
    </footer>
  )
}

export default Footer