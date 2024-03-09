import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = () => {

  return (
    <footer>
      <h3>Copyright © Văn Phước</h3>
      <h3>Cảm ơn bạn đã tham quan, nếu bạn có vấn đề hãy kết nối với tôi
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