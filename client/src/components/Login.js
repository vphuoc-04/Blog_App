import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {

  const [input, setinput] = useState({
    username: "",
    password: ""
  });

  const handleInput = (event) => {
    setinput((prev) => ({...prev, [event.target.name]: event.target.value}))
  };

  const [showPassword, setShowPassword] = useState("");

  const { username, password } = input;

  return (
    <div className = "auth">
        <h1>Login</h1>
        <form>
            <input 
              name = "username"
              type = "text"
              placeholder= "Username"
              onChange = { handleInput }
            />
            <input 
              name = "password"
              type = {showPassword === true ? "text" : "password"} 
              placeholder = "Password"
              onChange = { handleInput }
            />
            <div className = "showPassword">
              <i className = {showPassword === true ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} 
                onClick = {() => setShowPassword(!showPassword)}
              />
            </div>
            <button 
              className = {username && password ? "active-button" : ""}
              disabled = {username && password ? false : true}
              >Login</button>
            <span>Don't you have an account? <Link to = "/register">Register</Link></span>
        </form>
    </div>
  )
}

export default Login