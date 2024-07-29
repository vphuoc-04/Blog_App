import React, { useContext, useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Logo from '../assets/logo/vphuoc.png'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const defaultAvatar = "https://imgur.com/AhaZ0qB.jpg";
  const [avatar, setAvatar] = useState(currentUser?.img || defaultAvatar);
  useEffect(() => {
    setAvatar( `../image/${currentUser?.img}` || defaultAvatar);
  }, [currentUser]);
  const isURL = (str) => { const pattern = /^https?:\/\//i; return !!pattern.test(str);};

  const displayAvatar = (imgUrl) => {
    if (imgUrl) {
      if (isURL(imgUrl)) {
        return <img src = {imgUrl} alt = "" />;
      } 
      else {
        return <img src = {`../image/${imgUrl}`} alt = "" />;
      }
    }
    return null;
  };
  return (
    <div className = "navbar">
      <div className = "container">
        <a className = "logo" href = "/">
          <img src = { Logo } alt = ""/>
        </a>
        <div className = "links">
          <NavLink exact = { true } className = "links" activeNav = "active" to = "/">Home</NavLink> 
          <NavLink exact = { true } className = "links" activeNav = "active" to = "/about">About</NavLink>
          <NavLink exact = { true } className = "links" activeNav = "active" to = "/contact">Contact</NavLink>
          {currentUser ? (
            <details className = "user">
              <summary className = "avatar">
                { displayAvatar(currentUser.img) }
              </summary>
              <div className = "menu">
                <span>{currentUser?.username}</span>
                <NavLink className = "button" to = {`/profile/${ currentUser.username }`}><i class="fa-solid fa-user"></i></NavLink>
                <NavLink className = "button" onClick = { logout } to = "/"><i class="fa-solid fa-right-from-bracket"></i></NavLink>
              </div>
            </details>
          ) : (
            <Link className = "login" to = "/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar