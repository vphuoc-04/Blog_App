import React, { useContext, useEffect, useState } from 'react'
import {Link, useLocation } from 'react-router-dom'
import Delete from '../assets/img/delete.png'
import Edit from '../assets/img/edit.png'
import axios from 'axios'
import DOMPurify from "dompurify";
import ReactPaginate from 'react-paginate';
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import { AdminContext } from '../context/AuthContext'

const ListPost = () => {
    const [listPost, setListPost] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [readPosts, setReadPosts] = useState(false);
    const [comments, setComments] = useState([]);
    const [replycomments, setReplyComments] = useState([]);
    const id = useLocation().search;
    const [likes, setLikes] = useState({});
    const [favorite, setFavorite] = useState({});
    const [likeCounts, setLikeCounts] = useState({});

    const listPostPerPage = 3;

    const { currentUser } = useContext(AdminContext);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const res = await axios.get(`posts${id}`);
                const reversedPosts = res.data.reverse();
                setListPost(reversedPosts);
                setPageCount(Math.ceil(res.data.length / listPostPerPage))
            }
            catch(err){
                console.log(err);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if(readPosts){
            document.body.classList.add('darkBackground');
        } 
        else{
            document.body.classList.remove('darkBackground');
        }
    }, [readPosts]);

    const handleDelete = async (id) => {
        try{
            await axios.delete(`/posts/${id}`);
            window.location.reload();
        }
        catch (err){
            console.log(err);
        }
    }

    const fetchComments = async (postId) => {
        try {
            const res = await axios.get(`/comments/data/comment?postId=${postId}`);
            if(Array.isArray(res.data)) {
                const reversedComments = res.data.reverse();
                setComments(reversedComments);
    
                const likesRes = await axios.get("/likecomments?postId=" + postId);
                const initLike = {};
                const likeCount = {};
                likesRes.data.forEach((like) => {
                    if(!likeCount[like.commentId]){
                        likeCount[like.commentId] = 0;
                    }
                    likeCount[like.commentId] += 1;
                    if(like.userId === currentUser.id){
                        initLike[like.commentId] = true;
                    }
                });
                setLikes(initLike);
                setLikeCounts(likeCount);

                const favoriteRes = await axios.get("/favoritecomments?postId=" + postId);
                const initFavorite = {};
                favoriteRes.data.forEach((favorite) => {
                    if (favorite.userId === currentUser.id) {
                        initFavorite[favorite.commentId] = true;
                    }
                });
                setFavorite(initFavorite);
            } 
            
            else{
                console.log(res.data);
                setComments([]);
            }
        } 
        catch(err){
            console.log(err);
        }
    };

    const fetchReplyComment = async (postId, parentId) => {
        try{
            const res = await axios.get(`/comments/data/reply?postId=${postId}&parentId=${parentId}`);
            console.log(res.data)
            if(Array.isArray(res.data)) {
                const reversedComments = res.data.reverse();
                setReplyComments(reversedComments);
    
                const likesRes = await axios.get("/likecomments?postId=" + postId);
                const initLike = {};
                const likeCount = {};
                likesRes.data.forEach((like) => {
                    if(!likeCount[like.commentId]){
                        likeCount[like.commentId] = 0;
                    }
                    likeCount[like.commentId] += 1;
                    if(like.userId === currentUser.id){
                        initLike[like.commentId] = true;
                    }
                });
                setLikes(initLike);
                setLikeCounts(likeCount);
            } 
            else{
                console.log(res.data);
                setReplyComments([]);
            }
        } 
        catch(err){
            console.log(err);
        }
    }

    const handleFavoriteComment = async (commentId) => {
        try{
            if(favorite[commentId]){
                await axios.delete(`/favoritecomments?postId=${readPosts.id}&commentId=${commentId}`);
            } 
            else{
                await axios.post(`/favoritecomments/`, { 
                    postId: readPosts.id, 
                    commentId 
                });
            }
            setFavorite((prevFavorite) => ({ ...prevFavorite, [commentId]: !prevFavorite[commentId] }));
        } 
        catch(err){
            console.log(err);
        }
    }; 

    const DeleteComment = async (id, parentId) => {
        try{
            const res = await axios.delete(`/comments/admin/delete/${id}`, {
                params: { parentId }
            });
            if(res.status === 200){
                setComments(prevComments => prevComments.filter(comment => comment.id !== id));
            } 
            else{
                console.error("Failed to delete comment");
            }
        }   
        catch(err) {
            console.log("Error:", err.response ? err.response.data : err.message);
        }
    };
  
    const handlePageClick = (event) => { setCurrentPage(event.selected); }

    const displayListPosts = listPost.slice(
        currentPage * listPostPerPage,
        (currentPage + 1) * listPostPerPage
    );

    const handleCloseReadPost = () => {
        setReadPosts(null);
        setComments([]);
    }

    const handleReadPost = (post, parentId) => {
        setReadPosts(post);
        fetchComments(post.id);
        fetchReplyComment(post.id, parentId)
    }   

    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

    return (
        <div className = "listPost">
            <div className = "post">
                { displayListPosts.map((post) => (
                    <div className = "content"  key = { post.id }>
                            <div 
                                className = "thumbnail" 
                                to = {`/posts/${ post.id }`} 
                                style = {{ cursor: 'pointer' }} 
                                onClick = {() => handleReadPost(post) }>
                                <img src = { `http://localhost:3000/upload/${ post?.img }` } alt = "" />
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
                        { readPosts && (
                            <div className = "readPosts" >
                                <div className = "container" key = { post.id }>
                                    <div className = "content">
                                        <div className = "picAndDes">
                                            <img src = { `http://localhost:3000/upload/${ readPosts?.img }` } alt = "" />
                                            <p dangerouslySetInnerHTML = {{
                                                __html: DOMPurify.sanitize(readPosts.des),
                                            }}></p>
                                        </div>
                                    </div>
                                </div>
                                <div className = "comments" postId = { post.id }>
                                    {Array.isArray(comments) && comments.map((c) => (
                                        <div className = "container" commentId = {c.id}>
                                        <span className = "closeReadButton" onClick = {handleCloseReadPost}>&times;</span>
                                            <div className = "client"  >
                                                <img src = {`http://localhost:3000/image/${c?.img}`} />
                                                <p> { c.username } </p>
                                            </div>
                                            <div className = "content">
                                                <p> { c.comment } </p>
                                                <div className = "favoriteAndDelete">
                                                    <span>
                                                        {favorite[c.id] ? (
                                                            <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize ="small" onClick = { () => handleFavoriteComment(c.id) }/>
                                                        ) : (
                                                            <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize ="small" onClick = { () => handleFavoriteComment(c.id) }/>
                                                        )}
                                                    </span>
                                                    <img src = { Delete } style = {{ cursor: 'pointer' }} onClick = {()=> DeleteComment(c.id) }/>
                                                </div>
                                            </div>

                                            <div className = "likeCount"> 
                                                <FavoriteBorderOutlinedIcon fontSize ="xx-small" />
                                                {likeCounts[c.id] || 0}
                                            </div>
                                            {Array.isArray(replycomments) && replycomments.map((rc) => (
                                                <div className = "replyContainer">
                                                    <div className = "client"  >
                                                        <img src = {`http://localhost:3000/image/${rc?.img}`} />
                                                        <p> { rc.username } </p>
                                                    </div>
                                                    <div className = "content">
                                                        <p> { rc.comment } </p>
                                                        <div className = "favoriteAndDelete">
                                                            <span>
                                                                {favorite[rc.id] ? (
                                                                    <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize ="small" onClick = { () => handleFavoriteComment(rc.id) }/>
                                                                ) : (
                                                                    <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize ="small" onClick = { () => handleFavoriteComment(rc.id) }/>
                                                                )}
                                                            </span>
                                                            <img src = { Delete } style = {{ cursor: 'pointer' }} onClick = {()=> DeleteComment(rc.id) }/>
                                                        </div>
                                                    </div>
                                                    <div className = "likeCount"> 
                                                        <FavoriteBorderOutlinedIcon fontSize ="xx-small" />
                                                        {likeCounts[rc.id] || 0}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )) }
                                </div>
                            </div>
                        )}
                    </div>
                )) }
            </div>
            <ReactPaginate
                breakLabel = "..."
                nextLabel = ">"
                onPageChange = { handlePageClick }
                pageRangeDisplayed = {1}
                pageCount = { pageCount }
                previousLabel = "<"
                renderOnZeroPageCount = { null }
                containerClassName = "paginate"
                pageClassName = "page-item"
                pageLinkClassName = "page-link"
                previousClassName = "page-item"
                previousLinkClassName = "page-link"
                nextClassName = "page-item"
                nextLinkClassName = "page-link"
                breakClassName = "page-item"
                breakLinkClassName = "page-link"
                activeClassName = "active"
                disabledClassName = "disabled"
            />
            
        </div>

    )
}

export default ListPost