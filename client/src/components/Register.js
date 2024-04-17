import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

const Register = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate()
  const [err, setErr] = useState(null);
  const isValidEmail = (email) => {
    const check = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return check.test(email);
  }
  const handleInput = (event) => {
    setInput((prev) => ({...prev, [event.target.name]: event.target.value}))
  };
  const handleSubmit = async (event) => {
    event.preventDefault()
    if(!isValidEmail(input.email)){
      setErr("Định dạng email không đúng!")
      return;
    }
    try{
      const res = await axios.post("/auth/register", input)
      navigate("/login");
      console.log(res);
    }
    catch(err){
      setErr(err.response.data)
    }
  }

  console.log(input);

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
              onClick = { handleSubmit }
              >Register</button>
              {err && <h4> { err } </h4>}
            <span>Do you have an account? <Link to = "/login">Login</Link></span>
        </form>
    </div>
  )
}

export default Register