import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AuthContext'
import { Link, NavLink, useLocation } from 'react-router-dom'
import axios from 'axios'
import Logo from '../assets/logo/vphuoc.png'
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { FetchReportCommentData } from '../services/CommentService'
import { isURL } from '../services/AvatarService'

const Navbar = () => {
    const { currentUser, logoutAdmin } = useContext(AdminContext);
    const [viewReport, setViewReport] = useState(false);
    const [dataReport, setDataReport] = useState([]);
    const [newReportCount, setNewReportCount] = useState(0);
    const [post, setPost] = useState([]);
    const [activeIconNav, setActiveIconNav] = useState(null);
    const [boxActionReport, setBoxActionReport] = useState(null);
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

    useEffect(() => {
        const FetchReports = async () => {
            await FetchReportCommentData(setDataReport, setNewReportCount);
        };

        FetchReports();

        const intervalId = setInterval(() => {
            FetchReports();
        }, 1000); 

        return () => clearInterval(intervalId); 
    }, []);

    const handleViewReport = async () => {
        setViewReport(prevView => {
            if(prevView){
                setActiveIconNav(null);
                setBoxActionReport(null);
            }
            else{
                setActiveIconNav('report');
            }
            return !prevView;
        });
        await FetchReportCommentData(setDataReport, setNewReportCount);
    }

    const handleActionReport = (id) => {
        setBoxActionReport((prevId) => (prevId === id ? null : id));
    }

    const handleDeleteReport = async (id) => {
        try{
            const res = await axios.delete(`/reportcomments/report/delete/${id}`);
            if(res.status === 200){
                setDataReport(prevReport => prevReport.filter(dataReport => dataReport.id !== id))
            }
            else{
                console.log("Lỗi không xóa được comment");
            }
        }
        catch(err){
            console.log(err);
        }
    }
    return (
        <div className = "navbar">
            <div className = "container">
                <a className = "logo" href = "/">
                    <img src = { Logo } alt = "" />
                </a>
                {currentUser && (
                    <div className = "iconNav">
                        <div className = "icon">
                            <i 
                                className = {`fa-regular fa-envelope ${activeIconNav === 'report' ? 'activeIconNav' : ''}`}
                                onClick = { handleViewReport }
                            />
                            <i 
                                class = "fa-regular fa-bell"
                            />
                        </div>
                        {newReportCount > 0 && <span className = "newReportCount">{newReportCount}</span>}
                        {viewReport && (
                            <div className = "report">
                                {dataReport.length > 0 ? (
                                    dataReport.map((r) => (
                                        <div className = "dataReport" key = {r.id}>
                                            <div className = "info">
                                                <div className = "avatar">
                                                    <img src = {isURL(r.img) ? r.img : `http://localhost:3000/image/${r.img}`} /> 
                                                </div>
                                                <p>@{r.username} đã báo cáo về bình luận của @{r.userReported}: </p>
                                                {post.map((p) => {
                                                    if(r.postId === p.id){
                                                        return(
                                                            <div className = "imagePost">
                                                                <img src = { `http://localhost:3000/upload/${p.img}` } />
                                                                <MoreVertIcon 
                                                                    style = {{ color: '#828282', cursor: 'pointer', fontSize: '20'}} 
                                                                    onClick = {() => handleActionReport(r.id) }
                                                                />
                                                                
                                                            </div>
                                                        )
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            <p>"{ r.report }"</p>
                                            <div className = "boxActionReport">
                                                {boxActionReport === r.id && (
                                                    <div className = "viewAndDelete">
                                                        <span><i class = "fa-regular fa-eye"></i>Xem chi tiết</span>
                                                        <span><i class = "fa-regular fa-trash-can" onClick = { () => handleDeleteReport(r.id) }></i>Xóa</span>
                                                    </div>
                                                )}
                                            </div>
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