import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';
import AvatarEditorComponent from './AvatarEditor';

const ProfileUser = () => {
  const defaultAvatar = "https://imgur.com/AhaZ0qB.jpg";
  const [file, setFile] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [infoProfile, setInfoProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const { currentUser, setCurrentUser, logout } = useContext(AuthContext);
  const [fileURL, setFileURL] = useState(null);
  const [userData, setUserData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    oldPassword: '',
    newPassword: '',
    img: currentUser.img || defaultAvatar
  });
  const [tempUserData, setTempUserData] = useState(userData);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const res = await axios.get(`/users/${currentUser.id}`);
        setUserData(res.data);
        setTempUserData(res.data);
      }
      catch(err){
        console.log(err);
      }
    };
    fetchUserData();
  }, [currentUser.id]);

  const handleChange = (e) => {
    setTempUserData({ ...tempUserData, [e.target.name]: e.target.value });
  };

  const uploadUserAvatar = async () => {
    try{  
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/user-avatar", formData);
      return res.data;
    }
    catch(err){
      console.log(err);
    }
  }

  const handleUploadAvatar = async () => {
    setShowEditor(false);
    const avatarImg = await uploadUserAvatar();
    if (avatarImg) {
      try {
        const res = await axios.put(`/users/avatar/${currentUser.id}`, {
          img: avatarImg,
        });
        const updated = { ...currentUser, img: avatarImg };
        localStorage.setItem("user", JSON.stringify(updated));
        setCurrentUser(updated);
        setUserData((prevData) => ({ ...prevData, img: avatarImg }));
        setFileURL(`../image/${avatarImg}`);
        console.log(res);
      } 
      catch (err) {
        console.log(err);
      }
    }
  };

  const handleUpdateUserProfile = async (event) => {
    event.preventDefault();
    try{
      const res = await axios.put(`/users/profile/${currentUser.id}`, {
        username: tempUserData.username,
        email: tempUserData.email,
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
      const res = await axios.put(`/users/password/${currentUser.id}`,{
        oldPassword: tempUserData.oldPassword,
        newPassword: tempUserData.newPassword,
      });
      console.log(res.data);
      logout();
      navigate('/login');
    }
    catch(err){
      setError(err.response.data);
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const objectURL = URL.createObjectURL(file);
      setFileURL(objectURL);
      setShowEditor(true);
    }
  };

  const isURL = (str) => { const pattern = /^https?:\/\//i; return !!pattern.test(str);};

  const displayAvatar = () => {
    const { img } = userData;
    if(isURL(img)){
      return <img src = {img} alt = "User Avatar" />;
    } 
    else {
      return <img src = {`../image/${img}`} alt = "User Avatar" />;
    }
  };

  return (
    <div className = "profileUser">
      <div className = "container">
        <div className = "avatar">
          <input 
            style = {{ display: "none" }}
            type = "file"
            id = "file"
            onChange={handleFileChange}
          />
          <label className = "avatar" htmlFor = "file" >
            {showEditor ? (
              <AvatarEditorComponent 
                src = {fileURL} 
                onAvatarSave = {handleUploadAvatar} 
                onClose = {() => setShowEditor(false)} 
              />
              ) : (
              <>
                <img 
                  src = {fileURL 
                  ? fileURL 
                  : (userData?.img ? (isURL(userData.img) 
                  ? userData.img : `../image/${userData.img}`) 
                  : defaultAvatar)} alt="" 
                />
                <div className = "camera-icon">
                  <FaCamera />
                </div>
              </>
            )}
          </label>
        </div>
        <h1> { userData.username } </h1>
        <div className = "info" style = {{ marginTop: -50, cursor: 'pointer' }} onClick = {() => setInfoProfile(true)}>
          <span>Thông Tin Cá Nhân</span>
          {infoProfile ? (
            <div className = "setting" style = {{ cursor: 'default' }}>
              <div className = "content">
                <p>Tên</p>
                <input 
                  type = "text"
                  name = "username"
                  value = { tempUserData.username || '' }
                  onChange = { handleChange }
                />
                <p>Email</p>
                <input 
                  type = "text"
                  name = "email"
                  value = { tempUserData.email || '' }
                  onChange = { handleChange }
                />
                <div className = "action">
                  <span onClick = {(e) => {e.stopPropagation(); setInfoProfile(false)}}>Hủy</span>
                  <button onClick = { handleUpdateUserProfile }>Lưu</button>
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
                  value = { tempUserData.oldPassword || '' }
                  onChange = { handleChange }
                />
                <p>Mật Khẩu Mới</p>
                <input 
                  type = "password"
                  name = "newPassword"
                  value = { tempUserData.newPassword || '' }
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

export default ProfileUser