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
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Avatar</th>
          <th>Actions</th>
        </tr>
        { listUser.map((users) => (
            <tr>
              <td> { users.id } </td>
              <td> { users.username } </td>
              <td> { users.email } </td>
              <td> { users.img } </td>
              <td>
                <img
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