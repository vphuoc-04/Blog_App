import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AuthContext'
import { Link, NavLink, useLocation } from 'react-router-dom'
import axios from 'axios'
import Logo from '../assets/logo/vphuoc.png'

import { FetchReportCommentData } from '../services/CommentService'
import { isURL } from '../services/AvatarService'

const Navbar = () => {
    const { currentUser, logoutAdmin } = useContext(AdminContext);
    const [viewReport, setViewReport] = useState(false);
    const [dataReport, setDataReport] = useState([]);
    const [newReportCount, setNewReportCount] = useState(0);
    const [post, setPost] = useState([]);
    const id = useLocation().search;

    useEffect(() => {
        const FetchPost = async () => { 
            try{
                const res = await axios.get(`posts${id}`);
                setPost(res.data);
            }
            catch(err){
                console.log(err);
            }
        }
        FetchPost();
    },[id])

    const handleViewReport = () => {
        setViewReport(prevView => !prevView);
        FetchReportCommentData(setDataReport, setNewReportCount);
    }

    return (
        <div className = "navbar">
            <div className = "container">
                <a className = "logo" href = "/">
                    <img src = { Logo } alt = "" />
                </a>
                {currentUser && (
                    <div className = "messageReport">
                        <i 
                            class = "fa-regular fa-envelope" 
                            onClick = { handleViewReport }
                        />
                        <i 
                            class = "fa-regular fa-bell"

                        />
                        {newReportCount > 0 && <span className = "newReportCount">{newReportCount}</span>}
                        {viewReport && (
                            <div className = "container">
                                {dataReport.length > 0 ? (
                                    dataReport.map((r) => (
                                        <div className = "dataReport" key = {r.id}>
                                            <div className = "infoUser">
                                                <div className = "avatar">
                                                    <img src = {isURL(r.img) ? r.img : `http://localhost:3000/image/${r.img}`} /> 
                                                </div>
                                                <p>@{r.username} đã báo cáo về bình luận của @{r.userReported}: </p>
                                                {post.map((p) => {
                                                    if(r.postId == p.id){
                                                        return(
                                                            <div className = "imagePost">
                                                                <img src = { `http://localhost:3000/upload/${p.img}` } />
                                                            </div>
                                                        )
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            <p>"{ r.commentReported }"</p>
                                        </div>
                                    ))
                                ) : (
                                    <span>Không có báo cáo nào.</span>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <div className = "profile">
                    {currentUser ? (
                        <details className = "user">
                            <summary className = "avatar">
                                <img src = { `../image/${currentUser.img}` } alt = '' />
                            </summary>
                            <div className = "menu">
                                <span>{currentUser?.username}</span>
                                <NavLink className = "button" onClick = { logoutAdmin } to = "/"><i class="fa-solid fa-right-from-bracket"></i></NavLink>
                            </div>
                        </details>
                    ) : (
                        <Link className = "button" to = "/login">Login</Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar