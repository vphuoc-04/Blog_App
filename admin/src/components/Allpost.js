import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const Allpost = () => {
  const [listPost, setListPost] = useState([]);

  const life = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get(`posts${life}`);
        setListPost(res.data);
      }
      catch(err){
        console.log(err);
      }
    };
    fetchData();
  }, [life]);
  return (
    <div className = "allpost">
      <div className = "post">
        { listPost.map((post) => (
          <div className = "content"  key = { post.id }>
            <div className = "thumbnail" to = {`/post/${ post.id }`}>
              <img src = { `http://localhost:3000/upload/${ post.img }` } alt = "" />
            </div>
            <div className = "des">
              <h3> { post.title } </h3>
              <p> { post.des } </p>
            </div>
          </div>
        )) }
      </div>
    </div>
  )
}

export default Allpost