import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import axios from 'axios';
import { 
    fetchCommentData, fetchReplyCommentData, DeleteComment, 
    LikeComment, EditComment, AddComment, ReplyComment
} from '../services/CommentService';

import { fetchUserData } from '../services/AuthService';

import { isURL, displayAvatar } from '../services/AvatarService';

const Comment = ({ postId }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [commentButton, setCommetButton] = useState(false);
    const [replyCommentForm, setReplyCommentForm] = useState({});
    const [likes, setLikes] = useState({});
    const [replycomment, setReplyComment] = useState("");
    const [replycomments, setReplyComments] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [boxActionComment, setBoxActionComment] = useState(null);
    const [originalContent, setOriginalContent] = useState('');
    const { currentUser } = useContext(AuthContext);

    // Fetch data of comment
    useEffect(() => {
        fetchCommentData(postId, currentUser, setComments, setLikes, setLikeCounts);
    }, [postId, currentUser]);

    // Fetch data of reply comment
    useEffect((parentId) => {
        fetchReplyCommentData(postId, parentId, currentUser, setReplyComments, setLikes, setLikeCounts);
    }, [postId, currentUser]);

    // Fetch user data
    useEffect(() => {
        if (currentUser && currentUser.id) {
            fetchUserData(currentUser);
        }
    }, [currentUser]);

    // Like comment
    const handleLikeComment = async (commentId) => {
        LikeComment(postId, commentId, likes, setLikes, setLikeCounts);
    };

    // Edit comment
    const handleEditSaveComment = async (id) => {
        EditComment(id, setComments, setEditCommentId, editCommentContent, setEditCommentContent);
    }

    // Delete comment
    const handleDeleteComment = async (id, parentId) => {
        DeleteComment(id, parentId, setComments);
    }

    // Comment
    const handleComment = async (event) => {
        AddComment(event, comment, postId, currentUser, setComment, setComments, setCommetButton);
    }

    // Reply comment
    const handleReplyComment = async (parentId) => {
        ReplyComment(parentId, postId, currentUser, replycomment, setReplyComment, setReplyComments, setReplyCommentForm);
    }

    useEffect(() => {
        const handleInputCommentClick = () => {
            setCommetButton(true);
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

    const handleInputCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleInputReplycomentChange = (event) => {
        setReplyComment(event.target.value)
    };

    const handleReplyClick = (id) => {
        console.log("Click vào nút Trả lời tiếp theo với id:", id);
        setReplyCommentForm((prevForms) => ({
            ...prevForms,
            [id]: !prevForms[id]
        }));
    }
    
    const handleBoxActionComment = (id) => {
        setBoxActionComment((prevId) => (prevId === id ? null : id));
    }
    
    const handleEditComment = (id, comment) => {
        setEditCommentId(id);
        setEditCommentContent(comment);
        setBoxActionComment(false);
        setOriginalContent(comment);
        setComments(comments.map(comment => 
            comment.id === id ? { ...comment, isEditing: true } : comment
        ));
    };

    const handleCancelEdit = (id) => {
        setEditCommentId(null);
        setComments(prevComments => prevComments.map(comment => 
            comment.id === id ? { ...comment, isEditing: false } : comment
        ));
    };

    const renderReplies = (parentId) => {
        return replycomments.filter(rc => rc.parentId === parentId).map(rc => (
            <div className = "container" style = {{ marginLeft: 0 }} key = {rc.id}>
                <div className = "infoCommentAccount">
                    <div className = "avatar"> {displayAvatar(rc?.img)} </div>
                    <div className = "username"> {rc.username} </div>
                    <p>{moment(rc.date).format("DD/MM/YYYY")}</p>
                </div>
                <div className = "infoComment">
                    <p> {rc.comment} </p>
                </div>
                <div className = "likeAndCountLike">
                    <span>
                        {likes[rc.id] ? (
                            <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize ="small" onClick = { () => handleLikeComment(rc.id) }/>
                        ) : (
                            <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize ="small" onClick = { () => handleLikeComment(rc.id) }/>
                        )}
                    </span>
                    <p> {likeCounts[rc.id] || 0}</p>
                </div>
                <div className = "reply">
                    <div className = "replyComment">
                        <p style={{ cursor: 'pointer' }} onClick={() => {
                            console.log('rc.id:', rc.id, 'rc.parentId:', rc.parentId);
                            handleReplyClick(rc.id);
                        }}>Trả lời</p>
                        {replyCommentForm[rc.id] && (
                            <div className = "mainReplyComment">
                                <img src = {
                                    isURL(currentUser.img) ? currentUser.img : `../image/${currentUser.img}`} 
                                    style = {{ width: 50, height: 50, objectFit: 'cover' }} 
                                />
                                <div className = "inputAndUserName">
                                    <div className = "username"> {currentUser.username} </div>
                                    <input
                                        name = "replycomment"
                                        placeholder = "Viết bình luận..."
                                        id = "replycomment"
                                        onChange = { handleInputReplycomentChange }
                                        value = { replycomment}
                                    />
                                    <div className = "buttons">
                                        <span onClick = {(e) => { e.stopPropagation(); setReplyCommentForm(false); setReplyComment("") }}>Hủy</span>
                                        <button
                                            className = {replycomment.length > 0 ? "active-button-comment" : ""}
                                            disabled = {replycomment.length === 0}
                                            onClick = { () => handleReplyComment(rc.id) }
                                        >Bình Luận</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {renderReplies(rc.id)}
            </div>
        ));
    }

    return (
        <div className = "comment">
            <div className= "commentCount"> { comments.length + replycomments.length } Bình Luận</div>
            <div className = "container">
                {currentUser ? (
                    // phần bình luận 
                    <div className = "mainComment">
                        <img 
                            src = {isURL(currentUser.img) ? currentUser.img : `../image/${currentUser.img}`} 
                            style = {{ width: 50, height: 50, objectFit: 'cover' }} 
                        />
                        <div className = "action">
                            <input
                                name = "comment"
                                placeholder = "Viết bình luận..."
                                id = "comment"
                                onChange = {handleInputCommentChange}
                                value = {comment}
                            />
                            {commentButton ? (
                                <div className = "buttons">
                                    <span onClick = {(e) => { e.stopPropagation(); setCommetButton(false); setComment("") }}>Hủy</span>
                                    <button
                                        className = {comment.length > 0 ? "active-button-comment" : ""}
                                        disabled = {comment.length === 0}
                                        onClick = { handleComment }
                                    >Bình Luận</button>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Vui lòng đăng nhập để bình luận</p>
                )}
                <div className = "listcomments">
                    {Array.isArray(comments) && comments.map((c) => (
                        // Danh sách các bình luận
                        <div className = "container" key = {c.id}>
                            <div className = "infoCommentAccount">
                                <div className = "avatar"> {displayAvatar(c?.img)} </div>
                                <div className = "username"> {c.username} </div>
                                <p> {moment(c.date).format("DD/MM/YYYY")} </p>
                                <div className = "editAndDelete">
                                    <div className = "button">
                                        <MoreVertIcon style = {{ color: '#828282', cursor: 'pointer' }} onClick = {() => handleBoxActionComment(c.id) } />
                                        {currentUser && currentUser.id ? (
                                            <div className="boxActionComment">
                                                {boxActionComment === c.id && (
                                                    <div className="view">
                                                        <span onClick={() => handleEditComment(c.id, c.comment)}><i className="fa-regular fa-pen-to-square"></i>Chỉnh sửa</span>
                                                        <span onClick={() => handleDeleteComment(c.id, c.parentId)}><i className="fa-regular fa-trash-can"></i>Xóa</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                {boxActionComment === c.id && (
                                                    <div className="view">
                                                        <span onClick={() => handleDeleteComment(c.id, c.parentId)}><i className="fa-regular fa-trash-can"></i>Báo cáo</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {editCommentId === c.id && (
                                <div className = "editComment">
                                    <div className = "action">
                                        <div className = "input">
                                            <input 
                                                value = { editCommentContent } 
                                                onChange = {(event) => setEditCommentContent(event.target.value)} 
                                            />
                                        </div>
                                        <div className = "buttons">
                                            <span 
                                                style = {{ cursor: 'pointer' }}
                                                onClick = {() => handleCancelEdit(c.id)}>Hủy</span>
                                            <button 
                                                className = { editCommentContent.length > 0 && editCommentContent !== originalContent ? "active-button-edit" : "" }
                                                disabled = { editCommentContent.length === 0 || editCommentContent === originalContent}
                                                onClick = {() => handleEditSaveComment(c.id)}>Lưu</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className = "infoComment">
                                {!c.isEditing && <p>{c.comment}</p>}
                            </div>
                            <div className = "likeAndCountLike">
                                <span>
                                    {likes[c.id] ? (
                                        <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize ="small" onClick = { () => handleLikeComment(c.id) }/>
                                    ) : (
                                        <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize ="small" onClick = { () => handleLikeComment(c.id) }/>
                                    )}
                                </span>
                                <p> {likeCounts[c.id] || 0}</p>
                            </div>
                            <div className = "reply">
                                <div className = "replyComment">
                                    <p style={{ cursor: 'pointer' }}
                                        onClick = {() => {
                                            console.log('c.id: ', c.id)
                                            handleReplyClick(c.id)}}
                                    >Trả lời</p>
                                    {replyCommentForm[c.id] && (
                                        // Phần bình luận cho bình luận đầu tiên
                                        <div className = "mainReplyComment">
                                            <img src = {
                                                isURL(currentUser.img) ? currentUser.img : `../image/${currentUser.img}`} 
                                                style = {{ width: 50, height: 50, objectFit: 'cover' }} 
                                            />
                                            <div className = "inputAndUserName">
                                                <div className = "username"> {currentUser.username} </div>
                                                <input
                                                    name = "replycomment"
                                                    placeholder = "Viết bình luận..."
                                                    id = "replycomment"
                                                    onChange = { handleInputReplycomentChange }
                                                    value = { replycomment }
                                                />
                                                <div className = "buttons">
                                                    <span onClick = {(e) => { e.stopPropagation(); setReplyCommentForm(false); setReplyComment("") }}>Hủy</span>
                                                    <button
                                                        className = {replycomment.length > 0 ? "active-button-comment" : ""}
                                                        disabled = {replycomment.length === 0}
                                                        onClick = { () => handleReplyComment(c.id) }
                                                    >Bình Luận</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="listReplyComments">
                                {Array.isArray(replycomments) && replycomments.map((rc) => {
                                    if(c.id === rc.parentId){
                                        return (
                                            <div className = "container" key = { rc.id }>
                                                <div className = "infoCommentAccount">
                                                    <div className = "avatar"> {displayAvatar(rc?.img)} </div>
                                                    <div className = "username"> {rc.username} </div>
                                                    <p>{moment(rc.date).format("DD/MM/YYYY")}</p>
                                                </div>
                                                <div className = "infoComment">
                                                    <p> {rc.comment} </p>
                                                </div>
                                                <div className = "likeAndCountLike">
                                                    <span>
                                                        {likes[rc.id] ? (
                                                            <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize ="small" onClick = { () => handleLikeComment(rc.id) }/>
                                                        ) : (
                                                            <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize ="small" onClick = { () => handleLikeComment(rc.id) }/>
                                                        )}
                                                    </span>
                                                    <p> {likeCounts[rc.id] || 0}</p>
                                                </div>
                                                <div className = "reply">
                                                    <div className = "replyComment">
                                                        <p style={{ cursor: 'pointer' }} onClick={() => {
                                                            console.log('rc.id:', rc.id, 'rc.parentId:', rc.parentId);
                                                            handleReplyClick(rc.id);
                                                        }}>Trả lời</p>
                                                        {replyCommentForm[rc.id] && (
                                                            <div className = "mainReplyComment">
                                                                <img src = {
                                                                    isURL(currentUser.img) ? currentUser.img : `../image/${currentUser.img}`} 
                                                                    style = {{ width: 50, height: 50, objectFit: 'cover' }} 
                                                                />
                                                                <div className = "inputAndUserName">
                                                                    <div className = "username"> {currentUser.username} </div>
                                                                    <input
                                                                        name = "replycomment"
                                                                        placeholder = "Viết bình luận..."
                                                                        id = "replycomment"
                                                                        onChange = { handleInputReplycomentChange }
                                                                        value = { replycomment}
                                                                    />
                                                                    <div className = "buttons">
                                                                        <span onClick = {(e) => { e.stopPropagation(); setReplyCommentForm(false); setReplyComment("") }}>Hủy</span>
                                                                        <button
                                                                            className = {replycomment.length > 0 ? "active-button-comment" : ""}
                                                                            disabled = {replycomment.length === 0}
                                                                            onClick = { () => handleReplyComment(rc.id) }
                                                                        >Bình Luận</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {renderReplies(rc.id)}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Comment;
