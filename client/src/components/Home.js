import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import adminImg from '../assets/img/aboutMe.png'
import axios from 'axios'
import moment from 'moment';

const Home = () => {
  const [ posts, setPosts ] = useState([]);
  const [ admin, setAdmin ] = useState([]);
  const id = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get(`/posts${id}`);
        const reversedPosts = res.data.reverse();
        setPosts(reversedPosts)
      }
      catch(err){
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchDataAdmin = async () => {
      try{
        const res = await axios.get(`admin${id}`)
        setAdmin(res.data);
      }
      catch(err){
        console.log(err);
      }
    };
    fetchDataAdmin();
  }, [id]);

  return (
    <div className = "home">
      <h1 className = "name">
        <a href = "/">Văn Phước</a>
      </h1>
      <h2>Software Engineer</h2>
      <h1 className = "titleNewPost">Tất Cả Bài Viết</h1>
      <div className = "posts">
        { posts.map((post) => (
          <div className = "allPost">
            <div className = "newPost" key = { post.id }>
              <Link className = "img" to = {`/post/${post.id}`}>
                <img src = { `../upload/${post.img}` } alt = "" />
              </Link>
              <div className = "title"> { post.title } </div>
              <div className = "des"> { post.introdes } </div>
              <div className = "admin">
                { admin.map((a) => (
                  <div className = "adminInfo">
                    <img src = { a.img } alt = '' />
                    <p>{ a.username }</p>
                  </div>
                )) }
                <div className = "date"> {moment(post.date).fromNow()} </div>
              </div>
            </div>
            <div className = "popularPost">
            </div>
          </div>
        )) }
      </div>
    </div>
  )
}

export default Home