import axios from "axios";
import moment from 'moment';

const fetchCommentData = async (postId, currentUser, setComments, setLikes, setLikeCounts, setFavorites) => {
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

const fetchReplyCommentData = async (postId, parentId, currentUser, setReplyComments, setLikes, setLikeCounts, setFavorites) => {
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

export { fetchCommentData, fetchReplyCommentData, LikeComment, EditComment, DeleteComment, AddComment, ReplyComment };