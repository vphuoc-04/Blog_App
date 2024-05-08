import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Delete from '../assets/img/delete.png'
import axios from 'axios';

export const User = () => {
  const [listUser, setListUser] = useState([]);
  const id = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get(`users${id}`);
        setListUser(res.data);
      }
      catch(err){
        console.log(err);
      }
    };
    fetchData();
  },[id])

  const handleDelete = async (id) => {
    try{
      await axios.delete(`/users/${id}`)
      window.location.reload();
    }
    catch(err){
      console.log(err);
    }
  }
  return (
    <div className = "userManagement">
      <table>
        <tr>
          <th></th>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
        { listUser.map((users) => (
            <tr>
              <td>
                <img src = { `http://localhost:3000/upload/${ users?.img }` } alt = ""/>
              </td>
              <td> { users.id } </td>
              <td> { users.username } </td>
              <td> { users.email } </td>
              <td>
                <img
                  className = "delete"
                  onClick = {() => handleDelete( users.id )}
                  src = { Delete }
                />
              </td>
            </tr>
        ))}
      </table>
    </div>
  )
}

export default User