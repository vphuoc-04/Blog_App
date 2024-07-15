import { createContext, useEffect, useState } from 'react'
import axios from 'axios'

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    const LoginAdmin = async(input) => {
        const res = await axios.post("/auth/loginAdmin", input);
        setCurrentUser(res.data);
        
    };

    const logoutAdmin = async(input) => {
        await axios.post("/auth/logoutAdmin");
        setCurrentUser(null);
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    },[currentUser])
    return(
        <AdminContext.Provider value={{ currentUser, LoginAdmin, logoutAdmin }}>
            { children }
        </AdminContext.Provider>
    )
}