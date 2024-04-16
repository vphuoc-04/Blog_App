import React, { useEffect, useState } from 'react'
import Avatar from '../assets/img/avatar.jpg'

const ProfileAdmin = () => {
  const [avatar, setAvatar] = useState(null);

  return (
    <div className = "profileAdmin">
      <div className = "content">
        <p>Tên</p>
        <input 
          type = "text"
        />
        <p>Email</p>
        <input 
          type = "text"
        />
        <p>Mật Khẩu</p>
        <input 
          type = "password"
        />
      <div className = "button">
        <button>Lưu</button>
        <button>Hủy</button>
      </div>
      </div>
      <div className = "avatar">
        <input 
          style = {{display: "none"}}
          type = "avatar"
          id = "avatar"
          name = ""
          onChange = {(event) => setAvatar(event.target.files[0])}
        />
        <label className = "avatar" htmlFor = "avatar">
          <img src = { avatar?URL.createObjectURL(avatar):Avatar } alt = "" />
        </label>
      </div>
    </div>
  )
}

export default ProfileAdmin