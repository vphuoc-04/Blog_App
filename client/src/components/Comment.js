import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import axios from 'axios';

const Comment = ({ postId }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [commentButton, setCommetButton] = useState(false);
    const [replyCommentbutton, setReplyCommentbutton] = useState(false);
    const [likes, setLikes] = useState({});
    const [likesReplyComment, setLikesReplyComment] = useState({});
    const [replycomment, setReplyComment] = useState("");
    const [replycomments, setReplyComments] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});
    const [likeReplyCommentsCount, setLikeReplyCommentCount] = useState({});
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [boxActionComment, setBoxActionComment] = useState(null);
    const { currentUser } = useContext(AuthContext);

    const isURL = (str) => { const pattern = /^https?:\/\//i; return !!pattern.test(str); };
    const displayAvatar = (avatarCmt) => {
        if(avatarCmt) {
            if(isURL(avatarCmt)) {
                return <img src={avatarCmt} alt="" />;
            }
            else{
                return <img src={`../image/${avatarCmt}`} alt="" />;
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchCommentData = async () => {
            try{
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
        fetchCommentData();
    }, [postId, currentUser]);

    useEffect(() => {
        const fetchReplyCommentData = async (parentId) => {
            try{
                const res = await axios.get(`/comments/data/reply?postId=${postId}&parentId=${parentId}`);
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
        };
        fetchReplyCommentData();
    }, [postId, currentUser]);

    useEffect(() => {
        if(currentUser && currentUser.id){
            const fetchUserData = async () => {
                try{
                    const res = await axios.get(`/users/${currentUser.id}`);
                    currentUser(res.data);
                } 
                catch(err){
                    console.log(err);
                }
            };
            fetchUserData();
        }
    }, [currentUser]);

    const handleReplyClick = (commentId) => { setReplyCommentbutton(commentId); }
    const handleNextReplyClick = (commentId, replyCommentId) => { setReplyCommentbutton(commentId, replyCommentId); }

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

    const handleComment = async (event) => {
        event.preventDefault();
        if(comment.length > 0){
            try{
                const newComment = {
                    comment: comment,
                    postId,
                    date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    username: currentUser.username,
                    img: currentUser.img
                };
                const res = await axios.post('/comments/comment/', newComment);
                setComment('');
                setComments((prevComments) => [{
                    ...newComment,
                    id: res.data.id
                }, ...prevComments]);
                setCommetButton(false);
            } 
            catch(err){
                console.log(err);
            }
        }
    };
    
    const handleReplyComment = async (parentId) => {
        if(replycomment.length > 0){
            try{
                const newReplyComment = {
                    comment: replycomment,
                    postId,
                    parentId,
                    date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    username: currentUser.username,
                    img: currentUser.img
                };
                const res = await axios.post('/comments/comment/reply', newReplyComment);
                setReplyComment('');
                setReplyComments((prevReplyComments) => [{
                    ...newReplyComment,
                    id: res.data.id
                }, ...prevReplyComments]);
                setReplyCommentbutton(false);
            } 
            catch(err){
                console.error('Error posting reply comment:', err.response ? err.response.data : err.message);
            }
        }
    };    

    const handleLikeComment = async (commentId) => {
        try{
            if(likes[commentId]){
                await axios.delete(`/likecomments?postId=${postId}&commentId=${commentId}`);
                setLikeCounts((prevCount) => ({
                    ...prevCount, [commentId]: prevCount[commentId] - 1
                }));
            } 
            else{
                await axios.post(`/likecomments/`, { postId, commentId });
                setLikeCounts((prevCounts) => ({
                    ...prevCounts, [commentId]: (prevCounts[commentId] || 0) + 1
                }));
            }
            setLikes((prevLikes) => ({ ...prevLikes, [commentId]: !prevLikes[commentId] }));
        } 
        catch(err){
            console.log(err);
        }
    };

    const handleBoxActionComment = (id) => {
        setBoxActionComment((prevId) => (prevId === id ? null : id));
    }

    const handleDeleteComment = async (id, parentId) => {
        try{
            const res = await axios.delete(`/comments/delete/${id}`, {
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
    
    const handleEditComment = (id, currentText) => {
        setEditCommentId(id);
        setEditCommentContent(currentText);
    };

    const handleSaveEditComment = async (id) => {
        try{
            const res = await axios.put(`/comments/edit/${id}`, {
                comment: editCommentContent,
                date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            });
            if(res.status === 200){
                setComments(prevComments => prevComments.map(comment => 
                    comment.id === id ? { ...comment, comment: editCommentContent } : comment
                ));
                setEditCommentId(null);
                setEditCommentContent('');
            } 
            else{
                console.error("Failed to edit comment");
            }
        } 
        catch (err){
            console.log("Error:", err.response ? err.response.data : err.message);
        }
    };

    return (
        <div className = "comment">
            <div className= "commentCount"> { comments.length } Bình Luận</div>
            <div className = "container">
                {currentUser ? (
                    <div className = "mainComment">
                        <img src = {isURL(currentUser.img) ? currentUser.img : `../image/${currentUser.img}`} style = {{ width: 50, height: 50, objectFit: 'cover' }} />
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
                        <div className = "container" key = {c.id}>
                            <div className = "infoCommentAccount">
                                <div className = "avatar"> {displayAvatar(c?.img)} </div>
                                <div className = "username"> {c.username} </div>
                                <p>{moment(c.date).format("DD/MM/YYYY")}</p>
                                <div className = "editAndDelete">
                                    <div className = "button">
                                        <MoreVertIcon style = {{ color: '#828282', cursor: 'pointer' }} onClick = {() => handleBoxActionComment(c.id) } />
                                        {currentUser ? (
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
                                                <span>Báo Cáo</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {editCommentId === c.id && (
                                <div className = "editComment">
                                    <textarea 
                                        value = { editCommentContent } 
                                        onChange = {(e) => setEditCommentContent(e.target.value)} 
                                    />
                                    <button style = {{ cursor: 'pointer', width:100, height: 100 }} onClick = {() => handleSaveEditComment(c.id)}>Lưu</button>
                                    <button onClick = {() => setEditCommentId(null)}>Hủy</button>
                                </div>
                            )}
                            <div className = "infoComment">
                                <p> {c.comment} </p>
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
                                    <p style={{ cursor: 'pointer' }} onClick = { () => handleReplyClick(c.id) }>Trả lời</p>
                                    {replyCommentbutton === c.id && (
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
                                                    <span onClick = {(e) => { e.stopPropagation(); setReplyCommentbutton(false); setReplyComment("") }}>Hủy</span>
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
                                    if(rc.parentId === c.id) {
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
                                                        {likesReplyComment[rc.id] ? (
                                                            <FavoriteOutlinedIcon style = {{ color: 'red', cursor: 'pointer' }} fontSize ="small" onClick = { () => handleLikeComment(rc.id) }/>
                                                        ) : (
                                                            <FavoriteBorderOutlinedIcon style = {{ cursor: 'pointer' }} fontSize ="small" onClick = { () => handleLikeComment(rc.id) }/>
                                                        )}
                                                    </span>
                                                    <p> {likeReplyCommentsCount[rc.id] || 0}</p>
                                                </div>
                                                <div className = "reply">
                                                    <div className = "replyComment">
                                                        <p style={{ cursor: 'pointer' }} onClick = { () => handleNextReplyClick(rc.id) }>Trả lời</p>
                                                        {replyCommentbutton === rc.id && (
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
                                                                        <span onClick = {(e) => { e.stopPropagation(); setReplyCommentbutton(false); setReplyComment("") }}>Hủy</span>
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
