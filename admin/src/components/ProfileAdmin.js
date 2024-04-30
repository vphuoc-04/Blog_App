import React, { useContext, useEffect, useState } from 'react'
import Avatar from '../assets/img/avatar.jpg'
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const ProfileAdmin = () => {
  const [avatar, setAvatar] = useState(null);
  const { currentUser, logoutAdmin } = useContext(AdminContext);
  const [adminData, setAdminData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    oldPassword: '',
    newPassword: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try{
        const res = await axios.get(`/admin/${currentUser.id}`);
        setAdminData(res.data);
      }
      catch(err){
        console.log(err);
      }
    }
    fetchAdminData();
  },[currentUser.id]);

  const handleChange = (e) => {
    setAdminData({...adminData,[e.target.name]: e.target.value})
  }

  const handleSave = async () => {
    try{
      const res = await axios.put(`/admin/${currentUser.id}`, adminData);
      logoutAdmin();
      navigate("/");
      console.log(res.data); 
    } 
    catch(err){
      setError(err.response.data); 
    }
  };

  return (
    <div className = "profileAdmin">
      <div className = "content">
        <p>Tên</p>
        <input 
          type = "text"
          name = "username"
          value = { adminData.username || '' }
          onChange = { handleChange }
        />
        <p>Email</p>
        <input 
          type = "text"
          name = "email"
          value = { adminData.email || '' }
          onChange = { handleChange }
        />
        <p>Mật Khẩu Cũ</p>
        <input 
          type = "password"
          name = "oldPassword"
          value = { adminData.oldPassword || '' }
          onChange = { handleChange }
        />
        <p>Mật Khẩu Mới</p>
        <input 
          type = "password"
          name = "newPassword"
          value = { adminData.newPassword || '' }
          onChange = { handleChange }
        />
        { error && <p style={{ color: 'red' }}>{error}</p> }
      <div className = "button">
        <button onClick = { handleSave }>Lưu</button>
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