import React, { useState } from 'react'
const Recover = () => {

  const [showPassword, setShowPassword] = useState("");

  return (
    <div className = "auth">
        <h1>Recover Password</h1>
        <form>
            <input 
              name = "password"
              type = "password"
              placeholder= "Password"
            />
            <div className = "inputPassword">
              <input 
                name = "retypepassword"
                type = {showPassword === true ? "text" : "password"} 
                placeholder = "Retype password"
              />
              <div className = "showPassword">
                <i className = {showPassword === true ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} 
                  onClick = {() => setShowPassword(!showPassword)}
                />
              </div>
            </div>
            <button>Recover</button>
        </form>
    </div>
  )
}

export default Recover