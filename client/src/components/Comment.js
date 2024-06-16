import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

const Comment = () => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [button, setButton] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        username: '',
        img: ''
    });
    const location = useLocation();
    const postUrl = location.pathname.split("/")[2];
    const postId = useLocation().search;

    useEffect(() => {
        const fetcCommentData = async () => {
            try{
                const res = await axios.get(`/comments/${postId}`);
                if(Array.isArray(res.data)) {
                    const reversedComments = res.data.reverse();
                    setComments(reversedComments);
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
        fetcCommentData();
    }, [postId])

    useEffect(() => {
        if(currentUser && currentUser.id){
            const fetchUserData = async () => {
                try{
                    const res = await axios.get(`/users/${currentUser.id}`);
                    setUserData(res.data);
                } 
                catch (err){
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
        if (inputElement) {
            inputElement.addEventListener('click', handleInputClick);
        }
        return () => {
            if (inputElement) {
                inputElement.removeEventListener('click', handleInputClick);
            }
        };
    }, []);

    const handleInputChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (comment.length > 0) {
            try {
                const newComment = {
                    comment: comment,
                    postUrl,
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

    const isURL = (str) => { const pattern = /^https?:\/\//i; return !!pattern.test(str);};
    const displayAvatar = (avatarCmt) => {
        if (avatarCmt) {
            if (isURL(avatarCmt)) {
                return <img src = {avatarCmt} alt = "" />;
            } 
            else {
                return <img src = {`../image/${avatarCmt}`} alt = "" />;
            }
        }
        return null;
    };

    return (
        <div className = "comment">
            <div className = "container">
            {currentUser ? (
                <div className = "user">
                    <img src={isURL(currentUser.img) ? currentUser.img : `../image/${currentUser.img}`} style = {{ width: 50, height: 50, objectFit: 'cover' }} />
                    <div className = "action">
                        <input 
                            name = "comment"  
                            placeholder = "Viết bình luận..." 
                            id = "comment" 
                            onChange = { handleInputChange }  
                            value = { comment }     
                        />
                        { button ? (
                        <div className = "buttons">
                            <span onClick = {(e) => {e.stopPropagation(); setButton(false); setComment("")} }>Hủy</span>
                            <button 
                                className = { comment.length > 0 ? "active-button-comment" : "" } 
                                disabled = {comment.length  === 0} 
                                onClick = { handleSubmit }
                            >Bình Luận</button>
                        </div>
                        ) : (
                            <div></div>
                        ) }
                    </div>
                </div>
                ) :(
                    <p>Vui lòng đăng nhập để bình luận</p>
                )}
                <div className = "listcomments">
                    {Array.isArray(comments) && comments.map((c) => (
                        <div className = "container" key={c.id}>
                            <div className = "infoCommentAccount">
                                <div className = "avatar"> { displayAvatar(c?.img) } </div>
                                <div className = "username"> { c.username } </div>
                                <p>{ moment(c.date).fromNow() }</p>
                            </div>
                            <div className = "infoComment">
                                <p> { c.comment } </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Comment