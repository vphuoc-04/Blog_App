import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const [input, setinput] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  console.log(login);
  const [err, setErr] = useState(null);
  const handleInput = (event) => {
    setinput((prev) => ({...prev, [event.target.name]: event.target.value}))
  };
  const handleSubmit = async (event) => {
    event.preventDefault()
    try{
      await login(input);
      const res =  await axios.post("/auth/login", input);
      navigate("/");
      console.log(res);
    }
    catch(err){
      setErr(err.response.data);
    }
  }
  console.log(input);

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
            <div className = "inputPassword">
              <input 
                name = "password"
                type = {showPassword === true ? "text" : "password"} 
                placeholder = "Password"
                onChange = { handleInput }
              />
              <span><Link to = "/identify" style = {{ textDecoration: "none", marginLeft: "95px" }}>Quên mật khẩu?</Link></span>
              <div className = "showPassword">
                <i className = {showPassword === true ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} 
                  onClick = {() => setShowPassword(!showPassword)}
                />
              </div>
            </div>
            <button 
              className = {username && password ? "active-button" : ""}
              disabled = {username && password ? false : true}
              onClick = { handleSubmit }
            >Login</button>
            {err && <h4> { err} </h4>}
            <span>Bạn không có tài khoản? <Link to = "/register" style = {{ textDecoration: "none" }}>Register</Link></span>
        </form>
    </div>
  )
}

export default Login