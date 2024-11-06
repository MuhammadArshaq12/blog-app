// BlogList.jsx
'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem';
import EditBlogModal from '@/Components/AdminComponents/blogmodel';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './file.css';

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchBlogs = async () => {
    const response = await axios.get('/api/blog');
    setBlogs(response.data.blogs);
  };

  const deleteBlog = async (mongoId) => {
    const response = await axios.delete('/api/blog', {
      params: { id: mongoId },
    });
    toast.success(response.data.msg);
    fetchBlogs();
  };

  const handleEditClick = (blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setSelectedBlog(null);
  };

  const handleUpdateBlogs = () => {
    fetchBlogs();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className='blog-container'>
      <h1>All blogs</h1>
      <div className="table-container">
        <table className="blog-table">
          <thead>
            <tr>
              <th scope="col" className="author-column">Author name</th>
              <th scope="col">Blog Title</th>
              <th scope="col">Blog Category</th>
              <th scope="col">Date</th>
              <th scope="col">Registered Only</th>
              <th scope="col" className="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((item) => (
              <BlogTableItem
                key={item._id}
                mongoId={item._id}
                title={item.title}
                category={item.category}
                author={item.author}
                authorImg={item.authorImg}
                date={item.date}
                isRegisteredOnly={item.isRegisteredOnly}
                deleteBlog={deleteBlog}
                editBlog={() => handleEditClick(item)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <br></br>
      {isEditing && (
        <EditBlogModal
          blog={selectedBlog}
          onClose={handleCloseModal}
          onUpdate={handleUpdateBlogs}
        />
      )}
    </div>
  );
};

export default Page;

