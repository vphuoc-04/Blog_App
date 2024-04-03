import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import adminImg from '../assets/img/aboutMe.png'
import axios from 'axios';
import moment from 'moment'
import DOMPurify from "dompurify";

const Content = () => {
  const [post, setPost] = useState({});

  const location = useLocation();

  const postId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get(`/posts/${postId}`)
        setPost(res.data);
      }
      catch(err){
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }
  
  return (
    <div className = "content">
      <h1 className = "name">
        <a href = "/">Văn Phước</a>
      </h1>
      <h2>Software Engineer</h2>
        <div className = "container">
          <div className = "admin">
            <img src = { adminImg } alt = ""/>
            <div className = "nameAndDate">
              <span> { post.username }</span>
              <p>{moment(post.date).fromNow()}</p>
            </div>
          </div>
          <div className = "contentPost">
            <h1> { post.title } </h1>
            <img
              src = { `../upload/${post?.img}` }
              alt = ""
            />
            <p 
              dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.des),
            }}
            ></p>
          </div>
        </div>
    </div>
  )
}

export default Content