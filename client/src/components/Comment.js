import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import axios from 'axios';
import ContentEditable from 'react-contenteditable';
import DOMPurify from "dompurify";

import { NavLink } from 'react-router-dom';

import { 
    fetchCommentData, 
    fetchReplyCommentData, 
    DeleteComment, 
    LikeComment, 
    EditComment, 
    AddComment, 
    ReplyComment
} from '../services/CommentService';

import { fetchUserData } from '../services/AuthService';

import { isURL, displayAvatar } from '../services/AvatarService';

import Favorite from '../assets/logo/vphuoc.png'
import { Link } from 'react-router-dom';

const Comment = ({ postId }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [commentButton, setCommentButton] = useState(false);
    const [replyCommentForm, setReplyCommentForm] = useState({});
    const [likes, setLikes] = useState({});
    const [replycomment, setReplyComment] = useState("");
    const [replycomments, setReplyComments] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [boxActionComment, setBoxActionComment] = useState(null);
    const [reportComment, setReportComment] = useState(null);
    const [showReportForm, setShowReportForm] = useState(false);
    const [originalContent, setOriginalContent] = useState('');
    const [showReplies, setShowReplies] = useState({});
    const [favorites, setFavorites] = useState({});
    const [repliedUsername, setRepliedUsername] = useState('');
    const { currentUser } = useContext(AuthContext);

    // Fetch data of comment
    useEffect(() => {
        fetchCommentData(postId, currentUser, setComments, setLikes, setLikeCounts, setFavorites);
    }, [postId, currentUser]);

    // Fetch data of reply comment
    useEffect((parentId) => {
        fetchReplyCommentData(postId, parentId, currentUser, setReplyComments, setLikes, setLikeCounts, setFavorites);
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
        AddComment(event, comment, postId, currentUser, setComment, setComments, setCommentButton);
    }

    // Reply comment
    const handleReplyComment = async (parentId, answered) => {
        ReplyComment(parentId, postId, currentUser, replycomment, setReplyComment, setReplyComments, setReplyCommentForm, answered);
    }

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

    useEffect(() => {
        if (showReportForm) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [showReportForm]);

    const handleInputCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleInputReplycomentChange = (event) => {
        setReplyComment(event.target.value)
    };

    const handleReplyClick = (id, username) => {
        console.log("Click vào nút Trả lời tiếp theo với id:", id);
        setReplyComment(`<a href="/profile/${username}">@${username}</a>&nbsp`);
        setReplyCommentForm((prevForms) => ({ ...prevForms, [id]: !prevForms[id] }));
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

    const handleReportComment = (id) => {
        setReportComment(id);
        setShowReportForm(true);
        setBoxActionComment(false);
    };

    const handleCloseReportForm = () => {
        setShowReportForm(false);
        setReportComment(null);
    };

    const toggleReplies = (commentId) => {
        setShowReplies(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

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
    
    const renderReplies = (parentId) => {
        return replycomments.filter(rc => rc.parentId === parentId).map(rc => (
            <div className = "container" style = {{ marginLeft: 0 }} key = {rc.id}>
                {editCommentId === rc.id ? (
                    <div className = "formEdit">
                        <div className = "avatar"> {displayAvatar(rc?.img)} </div>
                        <div className = "form">
                            <input className = "inputFormEdit"
                                type = "text"
                                value = { editCommentContent }
                                onChange = {(e) => setEditCommentContent(e.target.value)}
                            />
                            <div className = "buttons">
                                <span 
                                    style = {{ cursor: 'pointer' }}
                                    onClick = {() => handleCancelEdit(rc.id)}>Hủy</span>
                                <button 
                                    className = { editCommentContent.length > 0 && editCommentContent !== originalContent ? "active-button-edit" : "" }
                                    disabled = { editCommentContent.length === 0 || editCommentContent === originalContent}
                                    onClick = {() => handleEditSaveComment(rc.id)}>Lưu</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className = "content">
                        <div className = "infoCommentAccount">
                            <div className = "avatar"> {displayAvatar(rc?.img)} </div>
                            <div className = "username"> {rc.username} </div>
                            <p>{moment(rc.date).format("DD/MM/YYYY")}</p>
                            <MoreVertIcon 
                                style = {{ color: '#828282', cursor: 'pointer', position: 'absolute', left: 1028 }} onClick = {() => handleBoxActionComment(rc.id) } 
                            />
                            {currentUser && currentUser.id === rc.uidc ? (
                                <div className = "boxActionCommentReplies">
                                    {boxActionComment === rc.id && (
                                        <div className = "editAndDelete">
                                            <span onClick = {() => handleEditComment(rc.id, rc.comment)}><i className = "fa-regular fa-pen-to-square"></i>Chỉnh sửa</span>
                                            <span onClick = {() => handleDeleteComment(rc.id, rc.parentId)}><i className = "fa-regular fa-trash-can"></i>Xóa</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className = "boxActionCommentReplies">
                                    {boxActionComment === rc.id && (
                                        <div className = "report">
                                            <span onClick = {() => handleReportComment(rc.id)}><i className="fa-regular fa-trash-can"></i>Báo cáo</span>
                                        </div>
                                    )}
                                    <div>
                                        {showReportForm && reportComment && (
                                            <>
                                                <div className = "overlay"></div>
                                                <div className = "reportForm">
                                                    <div className = "form">
                                                        <h2>Báo cáo bình luận này</h2>
                                                        <textarea placeholder=  "Lý do của bạn..." rows = "5"></textarea>
                                                        <div className = "buttonsReport">
                                                            <span onClick = {handleCloseReportForm}>Hủy</span>
                                                            <button>Gửi</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                            )}
                        </div>
                        <div className = "infoComment">
                            <p dangerouslySetInnerHTML = {{
                                __html: DOMPurify.sanitize(rc.comment),
                            }}></p>
                        </div>
                        <div className = "likeAndCountLike">
                            <span>
                                {likes[rc.id] ? (
                                    <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(rc.id) }/>
                                ) : (
                                    <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(rc.id) }/>
                                )}
                            </span>
                            <p> {likeCounts[rc.id] || 0}</p>
                        </div>
                        <div className = "reply">
                            <div className = "replyComment">
                                <p style={{ cursor: 'pointer' }} onClick={() => {
                                    console.log('rc.id:', rc.id, 'rc.parentId:', rc.parentId, 'rc.username: ', rc.username);
                                    handleReplyClick(rc.id, rc.username);
                                }}>Trả lời</p>
                                {replyCommentForm[rc.id] && (
                                    <div className = "mainReplyComment">
                                        <img src = {
                                            isURL(currentUser.img) ? currentUser.img : `../image/${currentUser.img}`} 
                                            style = {{ width: 50, height: 50, objectFit: 'cover' }} 
                                        />
                                        <div className = "inputAndUserName">
                                            <div className = "username"> {currentUser.username} </div>
                                            <ContentEditable
                                                html = {replycomment} 
                                                onChange = {handleInputReplycomentChange}
                                                tagName = "div" 
                                                className = "replycomment"
                                            />
                                            <div className = "buttons">
                                                <span onClick = {(e) => { e.stopPropagation(); setReplyCommentForm(false); setReplyComment("") }}>Hủy</span>
                                                <button
                                                    className = {replycomment.length > 0 ? "active-button-comment" : ""}
                                                    disabled = {replycomment.length === 0}
                                                    onClick = { () => handleReplyComment(rc.id, rc.username) }
                                                >Bình Luận</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
                                    <span onClick = {(e) => { e.stopPropagation(); setCommentButton(false); setComment("") }}>Hủy</span>
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
                        <div className = "container" key = {c.id}>
                            {editCommentId === c.id ? (
                                <div className = "formEdit">
                                    <div className = "avatar"> {displayAvatar(c?.img)} </div>
                                    <div className = "form">
                                        <input className = "inputFormEdit"
                                            type = "text"
                                            value = { editCommentContent }
                                            onChange = {(e) => setEditCommentContent(e.target.value)}
                                        />
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
                            ) : (
                            <div className = "content">
                                <div className = "infoCommentAccount">
                                    <div className = "avatar"> {displayAvatar(c?.img)} </div>
                                    <div className = "username"> {c.username} </div>
                                    <p> {moment(c.date).format("DD/MM/YYYY")} </p>
                                    <div className = "editAndDelete">
                                        <div className = "button">
                                            <MoreVertIcon style = {{ color: '#828282', cursor: 'pointer' }} onClick = {() => handleBoxActionComment(c.id) } />
                                            {currentUser && currentUser.id === c.uidc ? (
                                                <div className = "boxActionComment">
                                                    {boxActionComment === c.id && (
                                                        <div className = "editAndDelete">
                                                            <span onClick = {() => handleEditComment(c.id, c.comment)}><i className = "fa-regular fa-pen-to-square"></i>Chỉnh sửa</span>
                                                            <span onClick = {() => handleDeleteComment(c.id, c.parentId)}><i className = "fa-regular fa-trash-can"></i>Xóa</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className = "boxActionComment">
                                                    {boxActionComment === c.id && (
                                                        <div className = "report">
                                                            <span onClick = {() => handleReportComment(c.id)}><i className = "fa-regular fa-trash-can"></i>Báo cáo</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        {showReportForm && reportComment && (
                                                            <>
                                                                <div className = "overlay"></div>
                                                                <div className = "reportForm">
                                                                    <div className = "form">
                                                                        <h2>Báo cáo bình luận này</h2>
                                                                        <textarea placeholder = "Lý do của bạn..." rows = "5"></textarea>
                                                                        <div className = "buttonsReport">
                                                                            <span onClick = {handleCloseReportForm}>Hủy</span>
                                                                            <button>Gửi</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className = "infoComment">
                                    {!c.isEditing && <p>{c.comment}</p>}

                                </div>
                                <div className = "likeAndCountLike">
                                    <span>
                                        {likes[c.id] ? (
                                            <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(c.id) }/>
                                        ) : (
                                            <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(c.id) }/>
                                        )}
                                    </span>
                                    <p> {likeCounts[c.id] || 0}</p>
                                </div>
                                <div className = "reply">
                                    <div className = "replyComment">
                                        <p style = {{ cursor: 'pointer' }} 
                                            onClick = {() => { 
                                                console.log('c.id: ', c.id)
                                                handleReplyClick(c.id, c.username)}} >Trả lời
                                        </p>
                                        <div className = "favoriteComment">
                                            { favorites[c.id] && (
                                                <div>
                                                    <img src = { Favorite } />
                                                </div>
                                            )}
                                        </div>
                                        <div className = "showReplies" style = {{ cursor: 'pointer', marginLeft: 10, fontSize: 13 }}
                                            onClick = {() => toggleReplies(c.id)}>
                                            {showReplies[c.id] ? `Ẩn ${countReplies(c.id)} phản hồi` : `Hiện ${countReplies(c.id)} phản hồi`}
                                        </div>
                                        {replyCommentForm[c.id] && (
                                            <div className = "mainReplyComment">
                                                <img src = {
                                                    isURL(currentUser.img) ? currentUser.img : `../image/${currentUser.img}`} 
                                                    style = {{ width: 50, height: 50, objectFit: 'cover' }} 
                                                />
                                                <div className = "inputAndUserName">
                                                    <div className = "username"> {currentUser.username} </div>
                                                    <ContentEditable
                                                        html = {replycomment} 
                                                        onChange = {handleInputReplycomentChange}
                                                        tagName = "div" 
                                                        className = "replycomment"
                                                    />
                                                    <div className = "buttons">
                                                        <span onClick = {(e) => { e.stopPropagation(); setReplyCommentForm(false); setReplyComment("") }}>Hủy</span>
                                                        <button
                                                            className = {replycomment.length > 0 ? "active-button-comment" : ""}
                                                            disabled = {replycomment.length === 0}
                                                            onClick = { () => handleReplyComment(c.id, c.username) }
                                                        >Bình Luận</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {showReplies[c.id] && (
                                    <div className="listReplyComments">
                                        {Array.isArray(replycomments) && replycomments.map((rc) => {
                                            if(c.id === rc.parentId){
                                                return (
                                                    <div className = "container" key = { rc.id }>
                                                    {editCommentId === rc.id ? (
                                                        <div className = "formEdit">
                                                            <div className = "avatar"> {displayAvatar(rc?.img)} </div>
                                                            <div className = "form">
                                                                <input className = "inputFormEdit"
                                                                    type = "text"
                                                                    value = { editCommentContent }
                                                                    onChange = {(e) => setEditCommentContent(e.target.value)}
                                                                />
                                                                <div className = "buttons">
                                                                    <span 
                                                                        style = {{ cursor: 'pointer' }}
                                                                        onClick = {() => handleCancelEdit(rc.id)}>Hủy</span>
                                                                    <button 
                                                                        className = { editCommentContent.length > 0 && editCommentContent !== originalContent ? "active-button-edit" : "" }
                                                                        disabled = { editCommentContent.length === 0 || editCommentContent === originalContent}
                                                                        onClick = {() => handleEditSaveComment(rc.id)}>Lưu</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className = "content">
                                                            <div className = "infoCommentAccount">
                                                                <div className = "avatar"> {displayAvatar(rc?.img)} </div>
                                                                <div className = "username"> {rc.username} </div>
                                                                <p>{moment(rc.date).format("DD/MM/YYYY")}</p>
                                                                <div className = "editAndDelete">
                                                                    <div className = "button">
                                                                        <MoreVertIcon style = {{ color: '#828282', cursor: 'pointer' }} onClick = {() => handleBoxActionComment(rc.id) } />
                                                                        {currentUser && currentUser.id === rc.uidc ? (
                                                                            <div className="boxActionComment">
                                                                                {boxActionComment === rc.id && (
                                                                                    <div className="editAndDelete">
                                                                                        <span onClick={() => handleEditComment(rc.id, rc.comment)}><i className="fa-regular fa-pen-to-square"></i>Chỉnh sửa</span>
                                                                                        <span onClick={() => handleDeleteComment(rc.id, rc.parentId)}><i className="fa-regular fa-trash-can"></i>Xóa</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <div className = "boxActionComment">
                                                                                {boxActionComment === rc.id && (
                                                                                    <div className = "report">
                                                                                        <span onClick={() => handleReportComment(rc.id)}><i className="fa-regular fa-trash-can"></i>Báo cáo</span>

                                                                                    </div>
                                                                                )}
                                                                                <div>
                                                                                {showReportForm && reportComment && (
                                                                                    <>
                                                                                        <div className = "overlay"></div>
                                                                                        <div className = "reportForm">
                                                                                            <div className = "form">
                                                                                                <h2>Báo cáo bình luận này</h2>
                                                                                                <textarea placeholder="Lý do của bạn..." rows = "5"></textarea>
                                                                                                <div className = "buttonsReport">
                                                                                                    <span onClick = {handleCloseReportForm}>Hủy</span>
                                                                                                    <button>Gửi</button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className = "infoComment">
                                                                <p dangerouslySetInnerHTML = {{
                                                                    __html: DOMPurify.sanitize(rc.comment),
                                                                }}></p>
                                                            </div>
                                                            <div className = "likeAndCountLike">
                                                                <span>
                                                                    {likes[rc.id] ? (
                                                                        <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(rc.id) }/>
                                                                    ) : (
                                                                        <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(rc.id) }/>
                                                                    )}
                                                                </span>
                                                                <p> {likeCounts[rc.id] || 0}</p>
                                                            </div>
                                                            <div className = "reply">
                                                                <div className = "replyComment">
                                                                    <p style={{ cursor: 'pointer' }} onClick={() => {
                                                                        console.log('rc.id:', rc.id, 'rc.parentId:', rc.parentId);
                                                                        handleReplyClick(rc.id, rc.username);
                                                                    }}>Trả lời</p>
                                                                    {replyCommentForm[rc.id] && (
                                                                        <div className = "mainReplyComment">
                                                                            <img src = {
                                                                                isURL(currentUser.img) ? currentUser.img : `../image/${currentUser.img}`} 
                                                                                style = {{ width: 50, height: 50, objectFit: 'cover' }} 
                                                                            />
                                                                            <div className = "inputAndUserName">
                                                                                <div className = "username"> {currentUser.username} </div>
                                                                                <ContentEditable
                                                                                    html = {replycomment} 
                                                                                    onChange = {handleInputReplycomentChange}
                                                                                    tagName = "div" 
                                                                                    className = "replycomment"
                                                                                />
                                                                                <div className = "buttons">
                                                                                    <span onClick = {(e) => { e.stopPropagation(); setReplyCommentForm(false); setReplyComment("") }}>Hủy</span>
                                                                                    <button
                                                                                        className = {replycomment.length > 0 ? "active-button-comment" : ""}
                                                                                        disabled = {replycomment.length === 0}
                                                                                        onClick = { () => handleReplyComment(rc.id, rc.username) }
                                                                                    >Bình Luận</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        )}
                                                        {renderReplies(rc.id)}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Comment;
