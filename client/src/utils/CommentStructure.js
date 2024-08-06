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
                                        <i class = "fa-solid fa-check"></i>
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
                                        <i class = "fa-solid fa-check"></i>
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

export { CommentCurrentUser, CommentActions, RenderReplyCommentForm, RenderNextReplyCommentForm, FormEditComment, ReplyCommentActions, NextReplyCommentActions, FormEditReplyComment }