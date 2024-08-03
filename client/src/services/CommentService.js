import axios from "axios";
import moment from 'moment';
import ContentEditable from "react-contenteditable";

const CommentCurrentUser = ({currentUser, commentButton, isURL, setCommentButton, comment, setComment, handleComment, handleInputCommentChange}) => {
    if(currentUser){
        return(
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
        )
    }
    else{
        return <p>Vui lòng đăng nhập để bình luận</p>;
    }
}

const CommentActions = ({currentUser, c, reportText, handleEditComment, handleDeleteComment, handleReportComment, showReportForm, reportComment, 
    boxActionComment, handleCloseReportForm, handleSendReport, handleInputReport, reportSuccessful}) => {
    if(currentUser && currentUser.id === c.uidc){
        return(
            <div className = "boxActionComment">
                {boxActionComment === c.id && (
                    <div className = "editAndDelete">
                        <span onClick = {() => handleEditComment(c.id, c.comment)}><i className = "fa-regular fa-pen-to-square"></i>Chỉnh sửa</span>
                        <span onClick = {() => handleDeleteComment(c.id, c.parentId)}><i className = "fa-regular fa-trash-can"></i>Xóa</span>
                    </div>
                )}
            </div>
        )
    }
    else{
        return(
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
                                    <textarea placeholder = "Lý do của bạn..." rows = "5" value = { reportText } onChange = { handleInputReport }></textarea>
                                    <div className = "buttonsReport">
                                        <span onClick = {handleCloseReportForm}>Hủy</span>
                                        <button onClick = {() => handleSendReport(c.id, c.uidc, c.username, c.comment)}>Gửi</button>
                                    </div>
                                </div>
                                {reportSuccessful && (
                                    <div className = "reportSuccessful">
                                        <i class="fa-solid fa-check"></i>
                                        <p>Báo cáo của bạn đã được gửi đến admin!</p>
                                    </div>
                                )} 
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }
}

const ReplyCommentActions = ({currentUser, rc, reportText, handleEditComment, handleDeleteComment, handleReportComment, showReportForm, reportComment, 
    boxActionComment, handleCloseReportForm, handleSendReport, handleInputReport, reportSuccessful}) => {
    if(currentUser && currentUser.id === rc.uidc){
        return(
            <div className = "boxActionComment">
                {boxActionComment === rc.id && (
                    <div className = "editAndDelete">
                        <span onClick = {() => handleEditComment(rc.id, rc.comment)}><i className = "fa-regular fa-pen-to-square"></i>Chỉnh sửa</span>
                        <span onClick = {() => handleDeleteComment(rc.id, rc.parentId)}><i className = "fa-regular fa-trash-can"></i>Xóa</span>
                    </div>
                )}
            </div>
        )
    }
    else{
        return(
            <div className = "boxActionComment">
                {boxActionComment === rc.id && (
                    <div className = "report">
                        <span onClick = {() => handleReportComment(rc.id)}><i className = "fa-regular fa-trash-can"></i>Báo cáo</span>
                    </div>
                )}
                <div>
                    {showReportForm && reportComment && (
                        <>
                            <div className = "overlay"></div>
                            <div className = "reportForm">
                                <div className = "form">
                                    <h2>Báo cáo bình luận này</h2>
                                    <textarea placeholder = "Lý do của bạn..." rows = "5" value = { reportText } onChange = { handleInputReport }></textarea>
                                    <div className = "buttonsReport">
                                        <span onClick = {handleCloseReportForm}>Hủy</span>
                                        <button onClick = {() => handleSendReport(rc.id, rc.uidc, rc.username, rc.comment)}>Gửi</button>
                                    </div>
                                </div>
                                {reportSuccessful && (
                                    <div className = "reportSuccessful">
                                        <i class="fa-solid fa-check"></i>
                                        <p>Báo cáo của bạn đã được gửi đến admin!</p>
                                    </div>
                                )} 
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }
}

const NextReplyCommentActions = ({currentUser, rc, reportText, handleEditComment, handleDeleteComment, handleReportComment, showReportForm, reportComment, 
    boxActionComment, handleCloseReportForm, handleSendReport, handleInputReport, reportSuccessful}) => {
    if(currentUser && currentUser.id === rc.uidc){
        return(
            <div className = "boxActionCommentReplies">
                {boxActionComment === rc.id && (
                    <div className = "editAndDelete">
                        <span onClick = {() => handleEditComment(rc.id, rc.comment)}><i className = "fa-regular fa-pen-to-square"></i>Chỉnh sửa</span>
                        <span onClick = {() => handleDeleteComment(rc.id, rc.parentId)}><i className = "fa-regular fa-trash-can"></i>Xóa</span>
                    </div>
                )}
            </div>
        )
    }
    else{
        return(
            <div className = "boxActionCommentReplies">
                {boxActionComment === rc.id && (
                    <div className = "report">
                        <span onClick = {() => handleReportComment(rc.id)}><i className = "fa-regular fa-trash-can"></i>Báo cáo</span>
                    </div>
                )}
                <div>
                    {showReportForm && reportComment && (
                        <>
                            <div className = "overlay"></div>
                            <div className = "reportForm">
                                <div className = "form">
                                    <h2>Báo cáo bình luận này</h2>
                                    <textarea placeholder = "Lý do của bạn..." rows = "5" value = { reportText } onChange = { handleInputReport }></textarea>
                                    <div className = "buttonsReport">
                                        <span onClick = {handleCloseReportForm}>Hủy</span>
                                        <button onClick = {() => handleSendReport(rc.id, rc.uidc, rc.username, rc.comment)}>Gửi</button>
                                    </div>
                                </div>
                                {reportSuccessful && (
                                    <div className = "reportSuccessful">
                                        <i class="fa-solid fa-check"></i>
                                        <p>Báo cáo của bạn đã được gửi đến admin!</p>
                                    </div>
                                )} 
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }
}

const RenderReplyCommentForm = ({replyCommentForm, c, isURL, currentUser, replycomment, handleInputReplycomentChange, setReplyCommentForm, setReplyComment, handleReplyComment}) => {
    if(replyCommentForm[c.id]){
        return(
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
        )
    }
    else{
        return null;
    }
}

const RenderNextReplyCommentForm = ({replyCommentForm, isURL, rc, currentUser, replycomment, handleInputReplycomentChange, setReplyCommentForm, setReplyComment, handleReplyComment}) => {
    if(replyCommentForm[rc.id]){
        return(
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
                            className = {replycomment.length 
                            > 0 ? "active-button-comment" : ""}
                            disabled = {replycomment.length === 0}
                            onClick = { () => handleReplyComment(rc.id, rc.username) }
                        >Bình Luận</button>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return null;
    }
}

const FormEditComment = ({displayAvatar, c, editCommentContent, setEditCommentContent, handleCancelEdit, originalContent, handleEditSaveComment}) => {
    return(
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
    )
}

const FormEditReplyComment = ({editCommentContent, rc, setEditCommentContent, originalContent, displayAvatar, handleEditSaveComment, handleCancelEdit}) => {
    return(
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
    )
}

const FetchCommentData = async (postId, currentUser, setComments, setLikes, setLikeCounts, setFavorites) => {
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

            const favoriteRes = await axios.get("/favoritecomments?postId=" + postId);
            const initFavorite = {};
            favoriteRes.data.forEach((favorites) => {
                if (favorites.adminId === currentUser.id) {
                    initFavorite[favorites.commentId] = true;
                }
            });
            setFavorites(initFavorite);
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

const FetchReplyCommentData = async (postId, parentId, currentUser, setReplyComments, setLikes, setLikeCounts, setFavorites) => {
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

            const favoriteRes = await axios.get("/favoritecomments?postId=" + postId);
            const initFavorite = {};
            favoriteRes.data.forEach((favorites) => {
                if (favorites.adminId === currentUser.id) {
                    initFavorite[favorites.commentId] = true;
                }
            });
            setFavorites(initFavorite);
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

const LikeComment = async (postId, commentId, likes, setLikes, setLikeCounts) => {
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

const EditComment = async (id, setComments, setEditCommentId, editCommentContent, setEditCommentContent) => {
    try{
        const res = await axios.put(`/comments/edit/${id}`, {
            comment: editCommentContent,
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        });
        if(res.status === 200){
            setComments(prevComments => prevComments.map(comment => 
                comment.id === id ? { ...comment, comment: editCommentContent, isEditing: false } : comment
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

const DeleteComment = async (id, parentId, setComments) => {
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

const AddComment = async (event, comment, postId, currentUser, setComment, setComments, setCommetForm) => {
    event.preventDefault();
    if(comment.length > 0){
        try{
            const newComment = {
                comment: comment,
                postId,
                date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                username: currentUser.username,
                img: currentUser.img,
                parentId: null
            };
            const res = await axios.post('/comments/comment/', newComment);
            setComment('');
            setComments((prevComments) => [{
                ...newComment,
                id: res.data.id
            }, ...prevComments]);
            setCommetForm(false);
        } 
        catch(err){
            console.log(err);
        }
    }
};

const ReplyComment = async (parentId, postId, currentUser, replycomment, setReplyComment, setReplyComments, setReplyCommentForm, answered) => {
    if(replycomment.length > 0){
        try{
            const newReplyComment = {
                comment: replycomment,
                postId,
                parentId,
                date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                username: currentUser.username,
                img: currentUser.img,
                answered
            };
            const res = await axios.post('/comments/comment/reply', newReplyComment);
            setReplyComment('');
            setReplyComments((prevReplyComments) => [{
                ...newReplyComment,
                id: res.data.id
            }, ...prevReplyComments]);
            setReplyCommentForm(false);
        } 
        catch(err){
            console.error('Error posting reply comment:', err.response ? err.response.data : err.message);
        }
    }
};

const ReportComment = async (reportText, userId, postId, commentId, currentUser, userReported, commentReported, setShowReportForm, setReportSuccessful) => {
    try{
        const contentReport = {
            report: reportText,
            userId,
            postId,
            commentId,
            username: currentUser.username,
            img: currentUser.img,
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userReported,
            commentReported
        };
        await axios.post('/reportcomments/report/add', contentReport);
        setReportSuccessful(true);
    }
    catch(err){
        console.log(err);
    }
};
 
export {
    CommentCurrentUser, CommentActions, RenderReplyCommentForm, FetchCommentData, FetchReplyCommentData, RenderNextReplyCommentForm, FormEditComment,
    ReplyCommentActions, LikeComment, EditComment, DeleteComment, AddComment, ReplyComment, NextReplyCommentActions, FormEditReplyComment, ReportComment
};