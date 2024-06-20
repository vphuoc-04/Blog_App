import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import moment from 'moment';
import axios from 'axios';

const Comment = ({ postId }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [button, setButton] = useState(false);
    const [likes, setLikes] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const { currentUser } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        username: '',
        img: ''
    });

    useEffect(() => {
        const fetchCommentData = async () => {
            try{
                const res = await axios.get("/comments?postId=" + postId);
                if(Array.isArray(res.data)) {
                    const reversedComments = res.data.reverse();
                    setComments(reversedComments);

                    const likesRes = await axios.get("/likes?postId=" + postId);
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
        if(currentUser && currentUser.id){
            const fetchUserData = async () => {
                try{
                    const res = await axios.get(`/users/${currentUser.id}`);
                    setUserData(res.data);
                } 
                catch(err){
                    console.log(err);
                }
            };
            fetchUserData();
        }
    }, [currentUser]);

    useEffect(() => {
        const handleInputClick = () => {
            setButton(true);
        };
        const inputElement = document.getElementById('comment');
        if(inputElement){
            inputElement.addEventListener('click', handleInputClick);
        }
        return () => {
            if(inputElement){
                inputElement.removeEventListener('click', handleInputClick);
            }
        };
    }, []);

    const handleInputChange = (event) => { setComment(event.target.value); };

    const handleSubmit = async (event) => {
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
                const res = await axios.post('/comments/', newComment);
                setComment('');
                setComments((prevComments) => [{
                    ...newComment,
                    id: res.data.id
                }, ...prevComments]);
                setButton(false);
            } 
            catch(err){
                console.log(err);
            }
        }
    };

    const handleLikeComment = async (commentId) => {
        try{
            if(likes[commentId]) {
                await axios.delete(`/likes?postId=${postId}&commentId=${commentId}`);
                setLikeCounts((prevCount) => ({
                    ...prevCount, [commentId]: prevCount[commentId] - 1
                }));
            } 
            else{
                await axios.post(`/likes/`, { postId, commentId });
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
    
    return (
        <div className = "comment">
            <div className = "container">
                {currentUser ? (
                    <div className = "user">
                        <img src = {isURL(currentUser.img) ? currentUser.img : `../image/${currentUser.img}`} style = {{ width: 50, height: 50, objectFit: 'cover' }} />
                        <div className = "action">
                            <input
                                name = "comment"
                                placeholder = "Viết bình luận..."
                                id = "comment"
                                onChange = {handleInputChange}
                                value = {comment}
                            />
                            {button ? (
                                <div className = "buttons">
                                    <span onClick = {(e) => { e.stopPropagation(); setButton(false); setComment("") }}>Hủy</span>
                                    <button
                                        className = {comment.length > 0 ? "active-button-comment" : ""}
                                        disabled = {comment.length === 0}
                                        onClick = {handleSubmit}
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
                                <p>{moment(c.date).fromNow()}</p>
                            </div>
                            <div className = "infoComment">
                                <p> {c.comment} </p>
                            </div>
                            <div className = "likeAndReply">
                                <span>
                                    {likes[c.id] ? (
                                        <FavoriteOutlinedIcon style={{ color: 'red', cursor: 'pointer' }} fontSize ="small" onClick = { () => handleLikeComment(c.id) }/>
                                    ) : (
                                        <FavoriteBorderOutlinedIcon style={{ cursor: 'pointer' }} fontSize ="small" onClick = { () => handleLikeComment(c.id) }/>
                                    )}
                                </span>
                                <p> {likeCounts[c.id] || 0}</p>
                                <div className = "replyComment" style={{ cursor: 'pointer' }}>Trả lời

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Comment;
