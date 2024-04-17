import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Identify = () => {
    const [identify, setIdentify] = useState(null);
    const [email, setEmail] = useState('');
    const handleIdentify = async () => {
        try{
            const res = await axios.get(`/users?email=${email}`);
            if(res.data && res.data.length > 0) {
                const user = res.data.find(user => user.email.toLowerCase() === email.toLowerCase());               
                if(user){
                    setIdentify(user);
                } 
                else{
                    setIdentify(null); 
                }
            }
            else{
                setIdentify(null);
            }
        } 
        catch(err){
            console.log(err);
        }
    };

    return (
        <div className = "identify">
            <div className = "container">
                <input
                    placeholder = "Nhập địa chỉ email cần tìm..."
                    value = { email }
                    onChange = {(e) => setEmail(e.target.value.trim())} 
                />
                <button onClick = {handleIdentify}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                {identify && (
                    <div className = "info">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Avatar</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{ identify.id }</td>
                                    <td>
                                        <img src =  {identify.img } alt = "Avatar" style = {{ width: '50px', height: '50px' }} />
                                    </td>
                                    <td>{ identify.username }</td>
                                    <td>{ identify.email }</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className = "action">
                            <Link 
                                className = "recover" 
                                to = "/recover" 
                                style={{textDecoration: "none", color: "rgb(65, 175, 167)"}}
         
                            >Đặt lại mật khẩu</Link>
                            <Link 
                                className = "back" 
                                to = "/" 
                                style={{textDecoration: "none", color: "rgb(65, 175, 167)"}}
                            >Quay về trang chủ</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Identify;
