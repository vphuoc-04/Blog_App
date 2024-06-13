import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Delete from '../assets/img/delete.png'
import axios from 'axios';
import ReactPaginate from 'react-paginate';

export const User = () => {
  const [listUser, setListUser] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const id = useLocation().search;
  const userPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get(`users${id}`);
        const reverseUser = res.data.reverse();
        setListUser(reverseUser);
        setPageCount(Math.ceil(res.data.length / userPerPage));
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

  const isURL = (str) => {
    const pattern = /^https?:\/\//i;
    return !!pattern.test(str);
  };

  const displayAvatar = (user) => {
    if(user && user.img){
      if(isURL(user.img)) {
        return <img src = {user.img} alt = "" />;
      } 
      else{
        return <img src = {`http://localhost:3000/image/${user.img}`} alt = "" />;
      }
    } 
    else {
      return null;
    }
  };

  const handlePageClick = (event) => { setCurrentPage(event.selected); }

  const displayUsers = listUser.slice(
    currentPage * userPerPage,
    (currentPage + 1) * userPerPage
  );

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
        { displayUsers.map((users) => (
            <tr>
              <td> { displayAvatar(users) } </td>
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
      <ReactPaginate
        breakLabel = "..."
        nextLabel = ">"
        onPageChange = { handlePageClick }
        pageRangeDisplayed = {1}
        pageCount = { pageCount }
        previousLabel = "<"
        renderOnZeroPageCount = { null }
        containerClassName = "paginate"
        pageClassName = "page-item"
        pageLinkClassName = "page-link"
        previousClassName = "page-item"
        previousLinkClassName = "page-link"
        nextClassName = "page-item"
        nextLinkClassName = "page-link"
        breakClassName = "page-item"
        breakLinkClassName = "page-link"
        activeClassName = "active"
        disabledClassName = "disabled"
      />
    </div>
  )
}

export default User