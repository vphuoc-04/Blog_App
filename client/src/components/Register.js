import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleInput = (event) => {
    setInput((prev) => ({...prev, [event.target.name]: event.target.value}))
  };

  const { username, email, password } = input;

  return (
    <div className = "auth">
      <h1>Register</h1>  
        <form>
            <input 
              name = "username"
              type = "text" 
              placeholder = "Username"
              onChange = { handleInput }
            />
            <input
              name = "email" 
              type = "text" 
              placeholder = "Email"
              onChange = { handleInput }
            />
            <input 
              name = "password"
              type = "password" 
              placeholder = "Password" 
              onChange = { handleInput }
            />
            <button 
              className = {username && email && password ? "active-button" : ""}
              disabled = {username && email && password ? false : true}
              >Register</button>
            <span>Do you have an account? <Link to = "/login">Login</Link></span>
        </form>
    </div>
  )
}

export default Register