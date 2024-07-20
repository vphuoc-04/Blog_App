import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AdminContext } from '../context/AuthContext'

const LoginAdmin = () => {

  const [input, setinput] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();

  const [err, setErr] = useState(null);

  const handleInput = (event) => {
    setinput((prev) => ({...prev, [event.target.name]: event.target.value}))
  };

  const { LoginAdmin } = useContext(AdminContext);
  console.log(LoginAdmin);

  const handleSubmit = async (event) => {
    event.preventDefault()
    try{
      await LoginAdmin(input);
      const res =  await axios.post("/auth/loginAdmin", input);
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
        </form>
    </div>
  )
}

export default LoginAdmin