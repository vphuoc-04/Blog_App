import React, { useState } from 'react'
import Upload from '../assets/img/upload.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'

const Post = () => {
  const state = useLocation().state; 
  const [value, setValue] = useState(state?.title || "");
  const [title, setTitle] = useState(state?.des || "");
  const [file, setFile] = useState(null);
  const [life, setLife] = useState(state?.life || "");

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
            des: value,
            life,
            img: file ? imgUrl : "",
          })
        : await axios.post(`/posts/`, {
            title,
            des: value,
            life, 
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
        <div className = "postContent">
          <textarea
            placeholder = "Nội dung"
            value = { value }
            onChange = {(event) => setValue(event.target.value)}
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
          <div className="item">
            <h1>Dev</h1>
            <div className="life">
              <input
                type="radio"
                checked={life === "dev"}
                name = "life"
                value = "dev"
                id = "dev"
                onChange={(event) => setLife(event.target.value)}
              />
              <label htmlFor="dev">Dev</label>
            </div>
          </div>
          <div className = "buttons">
            <button onClick = { handleUpload }>Đăng Tải</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post