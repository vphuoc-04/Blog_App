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
  const { currentUser, setCurrentUser, logoutAdmin } = useContext(AdminContext);
  const [fileURL, setFileURL] = useState(null);
  const [adminData, setAdminData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    oldPassword: '',
    newPassword: '',
    img: currentUser.img
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

  /*const handleSave = async (event) => {
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
  };*/

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
        const res = await axios.put(`/admin/${currentUser.id}`, {
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
  return (
    <div className = "profileAdmin">
      {/* <div className = "content">
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
      </div> */}
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
    </div>
  )
}

export default ProfileAdmin