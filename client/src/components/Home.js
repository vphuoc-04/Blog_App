import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const [ posts, setPosts ] = useState([]);

  const life = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get(`/posts${life}`);
        setPosts(res.data)
      }
      catch(err){
        console.log(err);
      }
    };
    fetchData();
  }, [life]);

  return (
    <div className = "home">
      <h1 className = "name">
        <a href = "/">Văn Phước</a>
      </h1>
      <h2>Software Engineer</h2>
      <div className = "posts">
        { posts.map((post) => (
          <div className = "post" key = { post.id }>
            <Link className = "img" to = {`/post/${post.id}`}>
              <img src = { `../upload/${post.img}` } alt = "" />
            </Link>
            <p> { post.title } </p>
          </div>
        )) }
      </div>
    </div>
  )
}

export default Home