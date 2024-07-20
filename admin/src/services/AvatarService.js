import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-edit';

const AvatarEditorComponent = ({ src, onAvatarSave, onClose }) => {
  const [preview, setPreview] = useState(null);

  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  const handleCrop = (view) => {
    setPreview(view);
  };

  const handleBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 716800) {
      alert("File is too big!");
      elem.target.value = "";
    }
  };

  return (
    <div className = "avatarEditor" onClick={(e) => e.preventDefault()}>
      <AvatarEditor
        width = {250}
        height = {250}
        onCrop = {handleCrop}
        onClose = {handleClose}
        onBeforeFileLoad = {handleBeforeFileLoad}
        src = {src}
      />
      <div className = "action">
        <span onClick = {handleClose}>Hủy</span>
        <button onClick = {() => onAvatarSave(preview)}>Lưu</button>
      </div>
    </div>
  );
};

const isURL = (str) => { const pattern = /^https?:\/\//i; return !!pattern.test(str); };
const displayAvatar = (avatar) => {
    if(avatar) {
        if(isURL(avatar)) {
            return <img src = {avatar} alt = "" />;
        }
        else{
            return <img src = {`../image/${avatar}`} alt = "" />;
        }
    }
    return null;
};

export default AvatarEditorComponent;

export { isURL, displayAvatar };