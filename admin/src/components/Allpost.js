import React, { useEffect, useState } from 'react'
import {Link, useLocation } from 'react-router-dom'
import Delete from '../assets/img/delete.png'
import Edit from '../assets/img/edit.png'
import axios from 'axios'
import DOMPurify from "dompurify";

const Allpost = () => {
  const [listPost, setListPost] = useState([]);

  const id = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get(`posts${id}`);
        setListPost(res.data);
      }
      catch(err){
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async (id) => {
    try{
      await axios.delete(`/posts/${id}`);
      window.location.reload();
    }
    catch (err){
      console.log(err);
    }
  }
  
  return (
    <div className = "allpost">
      <div className = "post">
        { listPost.map((post) => (
          <div className = "content"  key = { post.id }>
            <div className = "thumbnail" to = {`/posts/${ post.id }`}>
              <img src = { `http://localhost:3000/upload/${ post.img }` } alt = "" />
            </div>
            <div className = "des">
              <h3> { post.title } </h3>
              <p> { post.introdes } </p>
              <div className = "icon">
                <img 
                  onClick = {() => handleDelete(post.id) }
                  src = { Delete }
                  alt = ""
                />
                <Link to = {`/write?edit=2`} state = { post }>
                  <img 
                    src = { Edit }
                    alt = ""
                  />
                </Link>
              </div>
            </div>
          </div>
        )) }
      </div>
    </div>
  )
}

export default Allpost