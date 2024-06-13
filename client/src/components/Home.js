import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment';
import ReactPaginate from 'react-paginate';

const Home = () => {
  const [ posts, setPosts ] = useState([]);
  const [ admin, setAdmin ] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const id = useLocation().search;
  const postPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get(`/posts${id}`);
        const reversedPosts = res.data.reverse();
        setPosts(reversedPosts)
        setPageCount(Math.ceil(res.data.length / postPerPage));
      }
      catch(err){
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchDataAdmin = async () => {
      try{
        const res = await axios.get(`admin${id}`)
        setAdmin(res.data);
      }
      catch(err){
        console.log(err);
      }
    };
    fetchDataAdmin();
  }, [id]);

  const handlePageClick = (event) => { setCurrentPage(event.selected); }

  const displayPosts = posts.slice(
    currentPage * postPerPage,
    (currentPage + 1) * postPerPage
  );

  return (
    <div className = "home">
      <h1 className = "name">
        <a href = "/">Văn Phước</a>
      </h1>
      <h2>Software Engineer</h2>
      <h1 className = "titleNewPost">Tất Cả Bài Viết</h1>
      <div className = "posts">
        { displayPosts.map((post) => (
          <div className = "allPost">
            <div className = "newPost" key = { post.id }>
              <Link className = "img" to = {`/post/${post.url}`}>
                <img src = { `../upload/${post.img}` } alt = "" />
              </Link>
              <div className = "title"> { post.title } </div>
              <div className = "des"> { post.introdes } </div>
              <div className = "admin">
                { admin.map((a) => (
                  <div className = "adminInfo">
                    <img src = { `http://localhost:3001/image/${a.img}` } alt = '' />
                    <p>{ a.username }</p>
                  </div>
                )) }
                <div className = "date"> {moment(post.date).fromNow()} </div>
              </div>
            </div>
            <div className = "popularPost">
            </div>
          </div>
        )) }
      </div>
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

export default Home