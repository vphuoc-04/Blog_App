import React, { useState } from 'react'
import Upload from '../assets/img/upload.png'

const Post = () => {
  const [ input, setinput ] = useState({
    title: "",
    content: ""
  });

  const { title, content } = input;

  const handleInput = (event) => {
    setinput((prev) => ({...prev, [event.target.name]: event.target.value}))
  };

  return (
    <div className = "post">
      <div className = "postTitle">
        <div className = "postItem">
          <p>Tiêu Đề</p>
          <input 
            type = "text" 
            name = "title" 
            placeholder = "Nhập tiêu đề" 
            onChange = { handleInput }
          />
        </div>
      </div>
      <div className = "postContent">
        <div className = "postItem">
          <p>Nội Dung</p>
          <textarea 
            type = "text" 
            name = "content" 
            placeholder = "Nhập nội dung" 
            onChange = { handleInput }
          />
        </div>
      </div>
      <div className = "thumbnail">
        <label htmlFor = "fileInput">
          <img src = { Upload } className = "thumbnailPic" alt = ""></img>
        </label>
        <input 
          type = "file" 
          name = "image" 
          id = "fileInput" hidden
        />
      </div>
      <button 
        className = { title && content ? "active-button" : ""}
      >Đăng Tải</button>
    </div>
  )
}

export default Post