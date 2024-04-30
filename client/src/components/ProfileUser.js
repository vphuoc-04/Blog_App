import React, { useContext, useEffect, useState } from 'react'
import Avatar from '../assets/img/avatar.jpg'
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const ProfileUser = () => {
  const [avatar, setAvatar] = useState(null);
  const { currentUser, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    oldPassword: '',
    newPassword: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const res = await axios.get(`/users/${currentUser.id}`);
        setUserData(res.data);
      }
      catch(err){
        console.log(err);
      }
    };
    fetchUserData();
  }, [currentUser.id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try{
      const res = await axios.put(`/users/${currentUser.id}`, userData);
      logout();
      navigate("/");
      console.log(res.data); 
    } 
    catch(err){
      setError(err.response.data); 
    }
  };
  return (
    <div className = "profileUser">
      <div className = "content">
        <p>Tên</p>
        <input 
          type = "text"
          name = "username"
          value = { userData.username || '' }
          onChange = { handleChange }
        />
        <p>Email</p>
        <input 
          type = "text"
          name = "email"
          value = { userData.email || '' }
          onChange = { handleChange }
        />
        <p>Mật Khẩu Cũ</p>
        <input 
          type = "password"
          name = "oldPassword"
          value = { userData.oldPassword || '' }
          onChange = { handleChange }
        />
        <p>Mật Khẩu Mới</p>
        <input 
          type = "password"
          name = "newPassword"
          value = { userData.newPassword || '' }
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

export default ProfileUser