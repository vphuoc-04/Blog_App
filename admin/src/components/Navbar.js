import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AuthContext'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../assets/logo/vphuoc.png'

import { FetchReportCommentData } from '../services/CommentService'
import { isURL } from '../services/AvatarService'

const Navbar = () => {
    const { currentUser, logoutAdmin } = useContext(AdminContext);
    const [viewReport, setViewReport] = useState(false);
    const [dataReport, setDataReport] = useState([]);
    const [newReportCount, setNewReportCount] = useState(0);

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
                                        </div>
                                        <p>"{ r.commentReported }"</p>
                                    </div>
                                ))
                            ) : (
                                <p>Không có báo cáo nào.</p>
                            )}
                        </div>
                    )}
                </div>
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