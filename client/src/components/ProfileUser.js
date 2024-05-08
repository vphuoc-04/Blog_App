import React, { useContext, useEffect, useState } from 'react'
import Avatar from '../assets/img/avatar.jpg'
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const ProfileUser = () => {
  const [file, setFile] = useState(null);
  const { currentUser, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    oldPassword: '',
    newPassword: '',
    img: ''
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

  const handleSave = async (event) => {
    event.preventDefault();
    const avatarImg = await uploadUserAvatar();
    try{
      const res = await axios.put(`/users/${currentUser.id}`, {
        ...userData,
        img: file ? avatarImg: "",
      });
      logout();
      navigate("/");
      console.log(res.data); 
    } 
    catch(err){
      setError(err.response.data); 
    }
  };

  const uploadUserAvatar = async () => {
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
          type = "file"
          id = "file"
          name = ""
          onChange = {(event) => setFile(event.target.files[0])}
        />
        <label className = "avatar" htmlFor = "file">
          <img src = {file ? URL.createObjectURL(file) : Avatar || userData.img} alt="" />
        </label>
      </div>
    </div>
  )
}

export default ProfileUser