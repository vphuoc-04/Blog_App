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

import { displayAvatar, isURL } from '../services/AvatarService'

import { 
    fetchCommentData, 
    fetchReplyCommentData,
    DeleteComment,
    FavoriteComment 
} from '../services/CommentService'

const ListPost = () => {
    const [listPost, setListPost] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [readPosts, setReadPosts] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [replycomments, setReplyComments] = useState([]);
    const id = useLocation().search;
    const [likes, setLikes] = useState({});
    const [favorites, setFavorites] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [replyCommentForm, setReplyCommentForm] = useState({});
    const [replycomment, setReplyComment] = useState("");
    const [commentButton, setCommentButton] = useState(false);
    const [showReplies, setShowReplies] = useState({});

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

    const handleFavoriteComment = async (commentId) => {
        FavoriteComment(readPosts.id, commentId, favorites, readPosts, setFavorites);
    }; 

    const handleDeleteComment = async (id, parentId) => {
        DeleteComment(id, parentId, setComments);
    }
  
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
        // Fetch comment data

        fetchCommentData(post.id, currentUser, setComments, setLikes, setLikeCounts, setFavorites);

        // Fetch reply comment data
        fetchReplyCommentData(post.id, parentId, currentUser, setReplyComments, setLikes, setLikeCounts, setFavorites)
    }   

    const handleInputCommentChange = (event) => {
        setComment(event.target.value);
    };

    useEffect(() => {
        const handleInputCommentClick = () => {
            setCommentButton(true);
        };
        const inputElement = document.getElementById('comment')
        if(inputElement){
            inputElement.addEventListener('click', handleInputCommentClick);
        }
        return () => {
            if(inputElement){
                inputElement.removeEventListener('click', handleInputCommentClick);
            }
        };
    }, [])

    const countReplies = (parentId) => {
        let count = 0;
        replycomments.forEach(rc => {
            if (rc.parentId === parentId) {
                count++;
                count += countReplies(rc.id);
            }
        });
        return count;
    };

    const toggleReplies = (commentId) => {
        setShowReplies(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };


    const renderReplies = (parentId) => {
        return replycomments.filter(rc => rc.parentId === parentId).map(rc => (
            <div className = "replyContainer" style = {{ marginLeft: 0 }} key = {rc.id}>
                <div className = "client"  >
                    <img src = {`http://localhost:3000/image/${rc?.img}`} />
                    <p> { rc.username } </p>
                </div>
                <div className = "content">
                    <p dangerouslySetInnerHTML = {{
                        __html: DOMPurify.sanitize(rc.comment),
                    }}></p>
                    <div className = "favoriteAndDelete">
                        <span>
                            {favorites[rc.id] ? (
                                <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize ="small" onClick = { () => handleFavoriteComment(rc.id) }/>
                            ) : (
                                <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize ="small" onClick = { () => handleFavoriteComment(rc.id) }/>
                            )}
                        </span>
                        <img src = { Delete } style = {{ cursor: 'pointer' }} onClick = {()=> handleDeleteComment(rc.id) }/>
                    </div>
                </div>
                <div className = "likeCountAndRepy"> 
                    <FavoriteBorderOutlinedIcon fontSize ="xx-small" />
                    {likeCounts[rc.id] || 0}
                    <p>Trả lời</p>
                </div>
                {renderReplies(rc.id)}
            </div>
        ));
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
                                <span className = "closeReadButton" onClick = {handleCloseReadPost}>&times;</span>
                                <div className = "container" key = { post.id }>
                                    <div className = "contentPost">
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

                                            <div className = "client"  >
                                                <img src = {`http://localhost:3000/image/${c?.img}`} alt = ""/>
                                                <p> { c.username } </p>
                                            </div>
                                            <div className = "content">
                                                <p dangerouslySetInnerHTML = {{
                                                    __html: DOMPurify.sanitize(c.comment),
                                                }}></p>
                                                <div className = "favoriteAndDelete">
                                                    <span>
                                                        {favorites[c.id] ? (
                                                            <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize = "small" onClick = { () => handleFavoriteComment(c.id) }/>
                                                        ) : (
                                                            <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize = "small" onClick = { () => handleFavoriteComment(c.id) }/>
                                                        )}
                                                    </span>
                                                    <img src = { Delete } style = {{ cursor: 'pointer' }} onClick = {() => handleDeleteComment(c.id) }/>
                                                </div>
                                            </div>

                                            <div className = "likeCountAndRepy"> 
                                                <FavoriteBorderOutlinedIcon fontSize ="xx-small" />
                                                {likeCounts[c.id] || 0}
                                                <p>Trả lời</p>
                                            </div>
                                            <div className = "showReplies" style = {{ cursor: 'pointer', marginLeft: 65, fontSize: 13 }}
                                                onClick = {() => toggleReplies(c.id)}>
                                                {showReplies[c.id] ? `Ẩn ${countReplies(c.id)} phản hồi` : `Hiện ${countReplies(c.id)} phản hồi`}
                                            </div>
                                            {showReplies[c.id] && ( 
                                                <div className = "listReplyComment">
                                                    {Array.isArray(replycomments) && replycomments.map((rc) => {
                                                        if(c.id === rc.parentId){
                                                            return (
                                                                <div className = "replyContainer">
                                                                    <div className = "client"  >
                                                                        <img src = {`http://localhost:3000/image/${rc?.img}`} />
                                                                        <p> { rc.username } </p>
                                                                    </div>
                                                                    <div className = "content">
                                                                        <p dangerouslySetInnerHTML = {{
                                                                            __html: DOMPurify.sanitize(rc.comment),
                                                                        }}></p>
                                                                        <div className = "favoriteAndDelete">
                                                                            <span>
                                                                                {favorites[rc.id] ? (
                                                                                    <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize ="small" onClick = { () => handleFavoriteComment(rc.id) }/>
                                                                                ) : (
                                                                                    <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize ="small" onClick = { () => handleFavoriteComment(rc.id) }/>
                                                                                )}
                                                                            </span>
                                                                            <img src = { Delete } style = {{ cursor: 'pointer' }} onClick = {()=> handleDeleteComment(rc.id) }/>
                                                                        </div>
                                                                    </div>
                                                                    <div className = "likeCountAndRepy"> 
                                                                        <FavoriteBorderOutlinedIcon fontSize ="xx-small" />
                                                                        {likeCounts[rc.id] || 0}
                                                                        <p>Trả lời</p>
                                                                    </div>
                                                                    {renderReplies(rc.id)}
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            )}
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