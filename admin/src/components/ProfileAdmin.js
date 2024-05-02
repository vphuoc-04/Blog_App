import React, { useContext, useEffect, useState } from 'react'
import Avatar from '../assets/img/avatar.jpg'
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const ProfileAdmin = () => {
  const [file, setFile] = useState(null);
  const { currentUser, logoutAdmin } = useContext(AdminContext);
  const [adminData, setAdminData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    oldPassword: '',
    newPassword: '',
    img:''
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

  const handleSave = async (event) => {
    event.preventDefault();
    const avatarImg = await uploadAdminAvatar();
    try{
      const res = await axios.put(`/admin/${currentUser.id}`, {
        ...adminData,
        img: file ? avatarImg: "",
      });
      logoutAdmin();
      navigate("/");
      console.log(res.data); 
    } 
    catch(err){
      setError(err.response.data); 
    }
  };

  const uploadAdminAvatar = async () => {
    try{  
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    }
    catch(err){
      console.log(err);
    }
  }
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
          type = "file"
          id = "file"
          name = ""
          onChange = {(event) => setFile(event.target.files[0])}
        />
        <label className = "avatar" htmlFor = "file">
          <img src = { file?URL.createObjectURL(file):Avatar } alt = "" />
        </label>
      </div>
    </div>
  )
}

export default ProfileAdmin