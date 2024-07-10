import React, { useEffect, useState } from 'react'
import {Link, useLocation } from 'react-router-dom'
import Delete from '../assets/img/delete.png'
import Edit from '../assets/img/edit.png'
import axios from 'axios'
import ReactPaginate from 'react-paginate';

const Allpost = () => {
    const [listPost, setListPost] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const id = useLocation().search;
    const listPostPerPage = 3;

    useEffect(() => {
        const fetchData = async () => {
            try{
            const res = await axios.get(`posts${id}`);
            const reversedPosts = res.data.reverse();
            setListPost(reversedPosts);
            setPageCount(Math.ceil(res.data.length / listPostPerPage))
        }
        catch(err){
            console.log(err);
        }
    };
    fetchData();
  }, [id]);

    const handleDelete = async (id) => {
        try{
            await axios.delete(`/posts/${id}`);
            window.location.reload();
        }
        catch (err){
            console.log(err);
        }
    }
  
    const handlePageClick = (event) => { setCurrentPage(event.selected); }

    const displayListPosts = listPost.slice(
        currentPage * listPostPerPage,
        (currentPage + 1) * listPostPerPage
    );

    return (
        <div className = "allpost">
            <div className = "post">
                { displayListPosts.map((post) => (
                    <div className = "content"  key = { post.id }>
                        <div className = "thumbnail" to = {`/posts/${ post.id }`}>
                        <img src = { `http://localhost:3000/upload/${ post.img }` } alt = "" />
                    </div>
                        <div className = "des">
                            <h3> { post.title } </h3>
                            <p> { post.introdes } </p>
                            <div className = "icon">
                                <img 
                                    onClick = {() => handleDelete(post.id) }
                                    src = { Delete }
                                    alt = ""
                                />
                                <Link to = {`/write?edit=2`} state = { post }>
                                    <img 
                                        src = { Edit }
                                        alt = ""
                                    />
                                </Link>
                            </div>
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

export default Allpost