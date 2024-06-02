import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { FaCamera } from 'react-icons/fa';
import AvatarEditorComponent from './AvatarEditor';

const ProfileAdmin = () => {
  const [file, setFile] = useState(null);
  const defaultAvatar = "https://imgur.com/AhaZ0qB.jpg";
  const [showEditor, setShowEditor] = useState(false);
  const [infoProfile, setInfoProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const { currentUser, setCurrentUser, logoutAdmin } = useContext(AdminContext);
  const [fileURL, setFileURL] = useState(null);
  const [adminData, setAdminData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    oldPassword: '',
    newPassword: '',
    img: currentUser.img
  });
  const [tempAdminData, setTempAdminData] = useState(adminData);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try{
        const res = await axios.get(`/admin/${currentUser.id}`);
        setAdminData(res.data);
        setTempAdminData(res.data)
      }
      catch(err){
        console.log(err);
      }
    }
    fetchAdminData();
  },[currentUser.id]);

  const handleChange = (e) => {
    setTempAdminData({...tempAdminData,[e.target.name]: e.target.value})
  }

  const uploadAdminAvatar = async () => {
    try{  
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/admin-avatar", formData);
      return res.data;
    }
    catch(err){
      console.log(err);
    }
  }

  const handleUploadAvatar = async () => {
    setShowEditor(false);
    const avatarImg = await uploadAdminAvatar();
    if (avatarImg) {
      try {
        const res = await axios.put(`/admin/avatar/${currentUser.id}`, {
          img: avatarImg,
        });
        const updated = { ...currentUser, img: avatarImg };
        localStorage.setItem("user", JSON.stringify(updated));
        setCurrentUser(updated);
        setAdminData((prevData) => ({ ...prevData, img: avatarImg }));
        setFileURL(`../image/${avatarImg}`);
      } 
      catch (err) {
        console.log(err);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const objectURL = URL.createObjectURL(file);
      setFileURL(objectURL);
      setShowEditor(true);
    }
  };

  const handleUpdateAdminProfile = async (event) => {
    event.preventDefault();
    try{
      const res = await axios.put(`/admin/profile/${currentUser.id}`, {
        username: tempAdminData.username,
        email: tempAdminData.email,
      });
      console.log(res.data); 
      window.location.reload();
    } 
    catch(err){
      console.log(err);
    }
  }

  const handleChanglePassword = async (event) => {
    event.preventDefault();
    try{
      const res = await axios.put(`/admin/password/${currentUser.id}`,{
        oldPassword: tempAdminData.oldPassword,
        newPassword: tempAdminData.newPassword,
      });
      console.log(res.data);
      logoutAdmin();
      navigate('/login');
    }
    catch(err){
      setError(err.response.data);
    }
  }

  return (
    <div className = "profileAdmin">
      <div className = "container">
        <div className = "avatar">
          <input 
            style = {{ display: "none" }}
            type = "file"
            id = "file"
            onChange={ handleFileChange }
          />
          <label className = "avatar" htmlFor = "file" >
            {showEditor ? (
              <AvatarEditorComponent 
                src = {fileURL} 
                onAvatarSave = { handleUploadAvatar}  
                onClose = {() => setShowEditor(false)} />
            ) : (
              <>
                <img src = {fileURL ? fileURL : (adminData?.img ? `/image/${adminData?.img}` : defaultAvatar)} alt = "" />
                <div className = "camera-icon">
                  <FaCamera />
                </div>
              </>
            )}
          </label>
        </div>
        <h1> { adminData.username } </h1>
        <div className = "info" style = {{ marginTop: -50, cursor: 'pointer' }} onClick = {() => setInfoProfile(true)}>
          <span>Thông Tin Cá Nhân</span>
          {infoProfile ? (
            <div className = "setting" style = {{ cursor: 'default' }}>
              <div className = "content">
                <p>Tên</p>
                <input 
                  type = "text"
                  name = "username"
                  value = { tempAdminData.username || '' }
                  onChange = { handleChange }
                />
                <p>Email</p>
                <input 
                  type = "text"
                  name = "email"
                  value = { tempAdminData.email || '' }
                  onChange = { handleChange }
                />
                <div className = "action">
                  <span onClick = {(e) => {e.stopPropagation(); setInfoProfile(false)}}>Hủy</span>
                  <button onClick = { handleUpdateAdminProfile }>Lưu</button>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className = "info" style = {{marginTop: -60, cursor: 'pointer'}} onClick={() => setChangePassword(true)} >
          <span>Mật Khẩu</span>
          {changePassword ? (
            <div className = "setting" style = {{ cursor: 'default' }}>
              <div className = "content">
                <p>Mật Khẩu Cũ</p>
                <input 
                  type = "password"
                  name = "oldPassword"
                  value = { tempAdminData.oldPassword || '' }
                  onChange = { handleChange }
                />
                <p>Mật Khẩu Mới</p>
                <input 
                  type = "password"
                  name = "newPassword"
                  value = { tempAdminData.newPassword || '' }
                  onChange = { handleChange }
                />
                { error && <p style={{ color: 'red' }}>{error}</p> }
                <div className = "action">
                  <span onClick = {(e) => {e.stopPropagation(); setChangePassword(false)}}>Hủy</span>
                  <button onClick = { handleChanglePassword }>Lưu</button>
                </div>
              </div>
            </div>
            ) : (
              <div></div>
            )}
        </div>
      </div>
    </div>
  )
}

export default ProfileAdmin