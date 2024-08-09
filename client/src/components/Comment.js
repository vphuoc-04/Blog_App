import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import DOMPurify from "dompurify";

import {
    FetchCommentData, 
    FetchReplyCommentData, 
    DeleteComment, 
    LikeComment, 
    EditComment, 
    AddComment, 
    ReplyComment,
    ReportComment
} from '../services/CommentService';

import { 
    CommentCurrentUser, 
    CommentActions, 
    FormEditComment, 
    RenderReplyCommentForm, 
    RenderNextReplyCommentForm,
    ReplyCommentActions,
    NextReplyCommentActions,
    FormEditReplyComment,
} from '../utils/CommentStructure';

import { fetchUserData } from '../services/AuthService';

import { isURL, displayAvatar } from '../services/AvatarService';

import Favorite from '../assets/logo/vphuoc.png'

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
    const [reportText, setReportText] = useState('');
    const [reportSuccessful, setReportSuccessful] = useState(null);
    const { currentUser } = useContext(AuthContext);

    // Fetch data of comment
    useEffect(() => {
        FetchCommentData(postId, currentUser, setComments, setLikes, setLikeCounts, setFavorites);
    }, [postId, currentUser]);

    // Fetch data of reply comment
    useEffect((parentId) => {
        FetchReplyCommentData(postId, parentId, currentUser, setReplyComments, setLikes, setLikeCounts, setFavorites);
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

    // Send report
    const handleSendReport = async (commentId, userId, userReported, commentReported) => {
        ReportComment(reportText, userId, postId, commentId, currentUser, userReported, commentReported, setShowReportForm);
        setReportSuccessful(true);
        setTimeout(() => {
            setReportSuccessful(null);
            setShowReportForm(false);
            setReportText('');
        }, 3000);
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

    const handleInputCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleInputReplycomentChange = (event) => {
        setReplyComment(event.target.value)
    };
    
    const handleInputReport = (event) => {
        setReportText(event.target.value);
    }

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
        setReportText('');
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
            if(rc.parentId === parentId){
                count++;
                count += countReplies(rc.id);
            }
        });
        return count;
    };
    
    const RenderReplies = (parentId) => {
        return replycomments.filter(rc => rc.parentId === parentId).map(rc => (
            <div className = "container" style = {{ marginLeft: 0 }} key = {rc.id}>
                {editCommentId === rc.id ? (
                    <FormEditReplyComment
                        rc = { rc }
                        editCommentContent = { editCommentContent }
                        setEditCommentContent = { setEditCommentContent }
                        originalContent = { originalContent}
                        displayAvatar = { displayAvatar }
                        handleEditSaveComment = { handleEditSaveComment }
                        handleCancelEdit = { handleCancelEdit }
                    />
                ) : (
                    <div className = "content">
                        <div className = "infoCommentAccount">
                            <div className = "avatar"> {displayAvatar(rc?.img)} </div>
                            <div className = "username"> {rc.username} </div>
                            <p>{moment(rc.date).format("DD/MM/YYYY")}</p>
                            <MoreVertIcon 
                                style = {{ color: '#828282', cursor: 'pointer', position: 'absolute', left: 1035, marginTop: 25, }} onClick = {() => handleBoxActionComment(rc.id) } 
                            />                           
                            <NextReplyCommentActions
                                currentUser = { currentUser }
                                rc = { rc }
                                reportText = { reportText }
                                handleEditComment = { handleEditComment }
                                handleDeleteComment = { handleDeleteComment }
                                handleReportComment = { handleReportComment }
                                showReportForm = { showReportForm }
                                reportComment = { reportComment }
                                boxActionComment = { boxActionComment }
                                handleCloseReportForm = { handleCloseReportForm }
                                handleSendReport = { handleSendReport }
                                handleInputReport = { handleInputReport }
                                reportSuccessful = { reportSuccessful }
                            />
                        </div>
                        <div className = "infoComment">
                            <p dangerouslySetInnerHTML = {{ __html: DOMPurify.sanitize(rc.comment) }}></p>
                        </div>
                        <div className = "likeAndCountLike">
                            <span>
                                {likes[rc.id] ? (
                                    <FavoriteOutlinedIcon 
                                        style = {{ color: 'red', cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(rc.id) }
                                    />
                                ) : (
                                    <FavoriteBorderOutlinedIcon 
                                        style = {{ cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(rc.id) }
                                    />
                                )}
                            </span>
                            <p> {likeCounts[rc.id] || 0}</p>
                        </div>
                        <div className = "reply">
                            <div className = "replyComment">
                                <p style={{ cursor: 'pointer' }} onClick = {() => {handleReplyClick(rc.id, rc.username)}}>Trả lời</p>
                                <RenderNextReplyCommentForm
                                    rc = { rc }
                                    replyCommentForm = { replyCommentForm }
                                    isURL = { isURL }
                                    currentUser = { currentUser }
                                    replycomment = { replycomment }
                                    handleInputReplycomentChange = { handleInputReplycomentChange }
                                    setReplyCommentForm = { setReplyCommentForm }
                                    setReplyComment = { setReplyComment }
                                    handleReplyComment = { handleReplyComment }
                                />
                            </div>
                        </div>
                    </div>
                )}
                {RenderReplies(rc.id)}
            </div>
        ));
    }

    return (
        <div className = "comment">
            <div className= "commentCount"> { comments.length + replycomments.length } Bình Luận</div>
            <div className = "container">
                <CommentCurrentUser
                    currentUser = { currentUser }
                    commentButton = { commentButton }
                    isURL = { isURL }
                    setCommentButton = { setCommentButton }
                    comment = { comment }
                    setComment = { setComment }
                    handleComment = { handleComment }
                    handleInputCommentChange = { handleInputCommentChange }
                />
                <div className = "listcomments">
                    {Array.isArray(comments) && comments.map((c) => (
                        <div className = "container" key = {c.id}>
                            {editCommentId === c.id ? (
                                <FormEditComment
                                    displayAvatar = { displayAvatar }
                                    c = { c }
                                    editCommentContent = { editCommentContent }
                                    setEditCommentContent = { setEditCommentContent }
                                    handleCancelEdit = { handleCancelEdit }
                                    originalContent = { originalContent }
                                    handleEditSaveComment = { handleEditSaveComment }
                                />
                            ) : (
                            <div className = "content">
                                <div className = "infoCommentAccount">
                                    <div className = "avatar"> {displayAvatar(c?.img)} </div>
                                    <div className = "username"> {c.username} </div>
                                    <p> {moment(c.date).format("DD/MM/YYYY")} </p>
                                    <div className = "editAndDelete">
                                        <div className = "button">
                                            <MoreVertIcon 
                                                style = {{ color: '#828282', cursor: 'pointer', marginTop: -20 }} onClick = {() => handleBoxActionComment(c.id) } 
                                            />
                                            <CommentActions
                                                currentUser = { currentUser }
                                                c = { c }
                                                reportText = { reportText }
                                                handleEditComment = { handleEditComment }
                                                handleDeleteComment = { handleDeleteComment }
                                                handleReportComment = { handleReportComment }
                                                showReportForm = { showReportForm }
                                                reportComment = { reportComment }
                                                boxActionComment = { boxActionComment }
                                                handleCloseReportForm = { handleCloseReportForm }
                                                handleSendReport = { handleSendReport }
                                                handleInputReport = { handleInputReport }
                                                reportSuccessful = { reportSuccessful }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className = "infoComment">
                                    {!c.isEditing && <p>{c.comment}</p>}
                                </div>
                                <div className = "likeAndCountLike">
                                    <span>
                                        {likes[c.id] ? (
                                            <FavoriteOutlinedIcon 
                                                style = {{ color: 'red', cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(c.id) }
                                            />
                                        ) : (
                                            <FavoriteBorderOutlinedIcon 
                                                style = {{ cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(c.id) }
                                            />
                                        )}
                                    </span>
                                    <p> {likeCounts[c.id] || 0}</p>
                                </div>
                                <div className = "reply">
                                    <div className = "replyComment">
                                        <p style = {{ cursor: 'pointer' }} onClick = {() => {handleReplyClick(c.id, c.username)}}>Trả lời</p>
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
                                        <RenderReplyCommentForm
                                            replyCommentForm = { replyCommentForm }
                                            c = { c }
                                            isURL = { isURL }
                                            currentUser = { currentUser }
                                            replycomment = { replycomment }
                                            handleInputReplycomentChange = { handleInputReplycomentChange }
                                            setReplyCommentForm = { setReplyCommentForm }
                                            setReplyComment = { setReplyCommentForm }
                                            handleReplyComment = { handleReplyComment }
                                        />
                                    </div>
                                </div>
                                {showReplies[c.id] && (
                                    <div className="listReplyComments">
                                        {Array.isArray(replycomments) && replycomments.map((rc) => {
                                            if(c.id === rc.parentId){
                                                return (
                                                    <div className = "container" key = { rc.id }>
                                                    {editCommentId === rc.id ? (
                                                        <FormEditReplyComment
                                                            rc = { rc }
                                                            editCommentContent = { editCommentContent }
                                                            setEditCommentContent = { setEditCommentContent }
                                                            originalContent = { originalContent}
                                                            displayAvatar = { displayAvatar }
                                                            handleEditSaveComment = { handleEditSaveComment }
                                                            handleCancelEdit = { handleCancelEdit }
                                                        />                                                      
                                                    ) : (
                                                        <div className = "content">
                                                            <div className = "infoCommentAccount">
                                                                <div className = "avatar"> {displayAvatar(rc?.img)} </div>
                                                                <div className = "username"> {rc.username} </div>
                                                                <p>{moment(rc.date).format("DD/MM/YYYY")}</p>
                                                                <div className = "editAndDelete">
                                                                    <div className = "button">
                                                                        <MoreVertIcon 
                                                                            style = {{ color: '#828282', cursor: 'pointer', marginTop: -20}} onClick = {() => handleBoxActionComment(rc.id) }                                                                              
                                                                        />
                                                                        <ReplyCommentActions
                                                                            currentUser = { currentUser }
                                                                            rc = { rc }
                                                                            reportText = { reportText }
                                                                            handleEditComment = { handleEditComment }
                                                                            handleDeleteComment = { handleDeleteComment }
                                                                            handleReportComment = { handleReportComment }
                                                                            showReportForm = { showReportForm }
                                                                            reportComment = { reportComment }
                                                                            boxActionComment = { boxActionComment }
                                                                            handleCloseReportForm = { handleCloseReportForm }
                                                                            handleSendReport = { handleSendReport }
                                                                            handleInputReport = { handleInputReport }
                                                                            reportSuccessful = { reportSuccessful }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className = "infoComment">
                                                                <p dangerouslySetInnerHTML = {{ __html: DOMPurify.sanitize(rc.comment) }}></p>
                                                            </div>
                                                            <div className = "likeAndCountLike">
                                                                <span>
                                                                    {likes[rc.id] ? (
                                                                        <FavoriteOutlinedIcon 
                                                                            style = {{ color: 'red', cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(rc.id) }
                                                                        />
                                                                    ) : (
                                                                        <FavoriteBorderOutlinedIcon 
                                                                            style = {{ cursor: 'pointer' }} fontSize = "small" onClick = { () => handleLikeComment(rc.id) }
                                                                        />
                                                                    )}
                                                                </span>
                                                                <p> {likeCounts[rc.id] || 0}</p>
                                                            </div>
                                                            <div className = "reply">
                                                                <div className = "replyComment">
                                                                    <p style = {{ cursor: 'pointer' }} onClick={() => { handleReplyClick(rc.id, rc.username); }}>Trả lời</p>
                                                                    <RenderNextReplyCommentForm
                                                                        replyCommentForm = { replyCommentForm }
                                                                        isURL = { isURL }
                                                                        rc = { rc }
                                                                        currentUser = { currentUser }
                                                                        replycomment = { replycomment }
                                                                        handleInputReplycomentChange = { handleInputReplycomentChange }
                                                                        setReplyCommentForm = { setReplyCommentForm }
                                                                        setReplyComment = { setReplyComment }
                                                                        handleReplyComment = { handleReplyComment }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                        {RenderReplies(rc.id)}
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
