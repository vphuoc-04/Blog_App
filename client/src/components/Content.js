import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'

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
  
  return (
    <div className = "content">
        <div className = "contentPost">
          <div className = "admin">
            <span>{ post.username }</span>
            <p>Đã đăng {moment(post.date).fromNow()}</p>
          </div>
          <h1> { post.title } </h1>
          <img
            src = { `../upload/${post?.img}` }
            alt = ""
          />
          <p> { post.des } </p>
        </div>
    </div>
  )
}

export default Content