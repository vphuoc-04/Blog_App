import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'
import DOMPurify from "dompurify";
import Menu from './Menu';
import Comment from './Comment';

const Content = () => {
    const [post, setPost] = useState({});
    const [ admin, setAdmin ] = useState([]);
    const location = useLocation();
    const postId = location.pathname.split("/")[2];
    const id = useLocation().search;

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

    useEffect(() => {
        const fetchDataAdmin = async () => {
            try{
                const res = await axios.get(`/admin${id}`)
                setAdmin(res.data);
            }
            catch(err){
                console.log(err);
            }
        };
        fetchDataAdmin();
    }, [id]);

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
                    { admin.map((a) => (
                        <div className = "avatarAdmin">
                            <img src = { `http://localhost:3001/image/${a?.img}` } alt = '' />
                        </div>
                    )) }
                    <div className = "nameAndDate">
                        <span> { post.username }</span>
                        <p>{moment(post.date).fromNow()}</p>
                    </div>
                </div>
                <h1> { post.title } </h1>
                <div className = "contentPost">
                    <img
                        src = { `../upload/${post?.img}` }
                        alt = ""
                    />
                    <h3 className = "introdes"> { post.introdes } </h3>
                    <h3 className = "des"
                            dangerouslySetInnerHTML = {{
                            __html: DOMPurify.sanitize(post.des),
                        }}
                    ></h3>
                </div>
                <Comment postId = { post.id }/>
            </div>
            <Menu id = { post.id } />
        </div>
    )
}

export default Content  