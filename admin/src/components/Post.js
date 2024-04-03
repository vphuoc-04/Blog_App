import React, { useState } from 'react'
import Upload from '../assets/img/upload.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Post = () => {
  const state = useLocation().state; 
  const [title, setTitle] = useState(state?.title || "");
  const [value, setValue] = useState(state?.des || "");
  const [introdes, setIntroDes] = useState(state?.introdes || "");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const upload = async () => {
    try{
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    }
    catch(err){
      console.log(err);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const imgUrl = await upload();
    try{
      state
        ? await axios.put(`/posts/${state.id}`, {
            title,
            introdes: introdes,
            des: value,
            img: file ? imgUrl : "",
          })
        : await axios.post(`/posts/`, {
            title,
            des: value,
            introdes: introdes,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          });
          navigate("/")
    }
    catch(err){
      console.log(err);
    }
  };

  return (
    <div className = "post">
      <div className = "content">
        <input
          type = "text"
          value = { title }
          placeholder = "Tiêu đề"
          onChange = {(event) => setTitle(event.target.value)}
        />
        <input
          type = "text"
          value = { introdes }
          placeholder = "Lời mở đầu"
          onChange = {(event) => setIntroDes(event.target.value)}
        />
        <div className = "postContent">
          <ReactQuill
            className = "reactQuill"
            theme = "snow"
            placeholder = "Nội dung"
            value = { value }
            onChange = {setValue}
          />
        </div>
      </div>
      <div className = "menu">
        <div className = "item">
          <input
            style = {{ display: "none" }}
            type = "file"
            id = "file"
            name = ""
            onChange = {(event) => setFile(event.target.files[0])}
          />
          <label className = "file" htmlFor = "file">
            <img src = { file?URL.createObjectURL(file):Upload } alt = ""/>
          </label>
          <div className = "buttons">
            <button onClick = { handleUpload }>Đăng Tải</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post