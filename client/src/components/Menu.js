import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const Menu = () => {
  const [posts, setPosts] = useState([]);
  const id = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get(`/posts${id}`);
        setPosts(res.data);
      }
      catch(err){
        console.log(err);
      }
    };
    fetchData();
  },[id]);

  return (
    <div className = "menu">
      <h1>Những Bài Viết Khác</h1>
      {posts.map((post) => (
        <div className = "anotherPosts" key = {post.id}>
          <Link className = "img" to = {`/post/${post.id}`}>
            <img 
              src = {`../upload/${post?.img}`} 
              alt = "" 
            />
          </Link>
          <h2>{ post.title }</h2>
        </div>
      )) }
    </div>
  )
}

export default Menu